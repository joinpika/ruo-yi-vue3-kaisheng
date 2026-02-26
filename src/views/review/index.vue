<template>
    <div class="container-review">
        <el-card class="box-card">
            <template #header>
                <div class="clearfix">
                    <span>审核记录</span>
                    <div style="float: right;" v-if="Object.keys(itemData).length !== 0">
                        <el-button type="primary" icon="el-icon-document-checked" class="form-btn" size="small"
                            @click="onReview('approve')">通过</el-button>
                        <el-button type="danger" icon="el-icon-document-delete" class="form-btn" size="small"
                            @click="onReview('reject')">拒绝</el-button>
                    </div>
                </div>
            </template>
            <div class="form-function" v-if="flowRecordList.length > 0">
                <el-timeline>
                    <el-timeline-item v-for="(item, index) in flowRecordList" :key="index"
                        :icon="uiUtil.setIcon(item.finishTime)" :color="uiUtil.setColor(item.finishTime)">
                        <p style="font-weight: 700">{{ item.taskName }}</p>
                        <el-card :body-style="{ padding: '10px' }">
                            <el-descriptions class="margin-top" :column="1" size="small" border>
                                <el-descriptions-item v-if="item.assigneeName" label-class-name="my-label">
                                    <template #label><i class="el-icon-user"></i>办理人</template>
                                    {{ item.assigneeName }}
                                    <el-tag type="info" size="small">{{ item.deptName }}</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item v-if="item.candidate" label-class-name="my-label">
                                    <template #label><i class="el-icon-user"></i>候选办理</template>
                                    {{ item.candidate }}
                                </el-descriptions-item>
                                <el-descriptions-item label-class-name="my-label">
                                    <template #label><i class="el-icon-date"></i>接收时间</template>
                                    {{ item.createTime }}
                                </el-descriptions-item>
                                <el-descriptions-item v-if="item.finishTime" label-class-name="my-label">
                                    <template #label><i class="el-icon-date"></i>处理时间</template>
                                    {{ item.finishTime }}
                                </el-descriptions-item>
                                <el-descriptions-item v-if="item.duration" label-class-name="my-label">
                                    <template #label><i class="el-icon-time"></i>耗时</template>
                                    {{ item.duration }}
                                </el-descriptions-item>
                                <el-descriptions-item v-if="item.comment" label-class-name="my-label">
                                    <template #label>
                                        <i class="el-icon-tickets"></i>
                                        处理意见
                                        <span v-if="item.comment.type === '1'">(正常意见)</span>
                                        <span v-if="item.comment.type === '2'">(退回意见)</span>
                                        <span v-if="item.comment.type === '3'">(驳回意见)</span>
                                        <span v-if="item.comment.type === '4'">(委派意见)</span>
                                        <span v-if="item.comment.type === '5'">(转办意见)</span>
                                        <span v-if="item.comment.type === '6'">(终止流程)</span>
                                    </template>
                                    {{ item.comment.comment }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div v-else>
                <el-empty description="暂无审核记录" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uiUtil } from '@/utils/uiUtil.js'
import { flowRecord } from "@/api/flowable/finished"
import { passTask, rejectTask } from '@/api/bus/index.js'

// 路由
const route = useRoute()
const router = useRouter()

// 解析路由参数
const itemData = ref({})
const rowData = ref({})

try {
    if (route.query.item) {
        itemData.value = JSON.parse(route.query.item) || {}
        console.log('======11111')
        console.log(itemData.value, '=====接收的item')
    }
    if (route.query.row) {
        rowData.value = JSON.parse(route.query.row) || {}
        console.log('======22222')
        console.log(rowData.value, '=====接收的row')
    }
} catch (error) {
    console.error('解析路由参数失败:', error)
}

// 审核记录列表
const flowRecordList = ref([])

// 审批信息
const infoData = ref({
    processInstanceId: '',
    id: null,
})

// 设置流程实例ID
const setProcessInstanceId = () => {
    if (Object.keys(itemData.value).length !== 0) {
        infoData.value.processInstanceId = itemData.value?.procInsId || ''
        infoData.value.id = itemData.value?.variables?.saleOrder?.fileId || null
        console.log('first23323', infoData.value.processInstanceId)
    } else if (Object.keys(rowData.value).length !== 0) {
        infoData.value.processInstanceId = rowData.value?.procInsId || ''
        infoData.value.id = rowData.value?.id || null
    }
}

// 获取审核记录列表
const getFlowRecordList = async (id) => {
    console.log(id, '=====id')
    try {
        const params = { procInsId: id }
        const res = await flowRecord(params)
        console.log(res, '=====rex')
        if (res.code == 200) {
            flowRecordList.value = res.data.flowList || []
        }
    } catch (error) {
        ElMessage.error(error.msg || '获取审核记录失败')
    }
}

// 审核操作
const onReview = (type) => {
    const approvalType = type === 'approve' ? '通过' : '拒绝'
    
    ElMessageBox.prompt(`流程审批 - ${approvalType}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入审批意见',
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return '审批意见不能为空'
            }
            return true
        }
    }).then(({ value }) => {
        // 构建审批参数
        const params = {
            comment: value.trim(),
            instanceId: infoData.value.processInstanceId,
            taskId: flowRecordList.value[0]?.taskId || '',
            variables: {
                id: infoData.value.id
            }
        }
        
        // 根据审批类型调用不同的处理方法
        if (type === 'approve') {
            taskComplete(params)
        } else if (type === 'reject') {
            taskReject(params)
        }
    }).catch(() => {
        // 用户取消审批
        ElMessage.info('已取消审批操作')
    })
}

// 审批通过
const taskComplete = async (params) => {
    try {
        const res = await passTask(params)
        if (res.code === 200) {
            ElMessage.success('审批通过!')
            router.push('/index')
        } else {
            ElMessage.error(res.msg || '审批操作失败')
        }
    } catch (error) {
        console.error('审批通过失败:', error)
        ElMessage.error('网络错误，请稍后重试')
    }
}

// 审批拒绝
const taskReject = async (params) => {
    try {
        const res = await rejectTask(params)
        if (res.code === 200) {
            ElMessage.success('审批驳回!')
            router.push('/index')
        } else {
            ElMessage.error(res.msg || '驳回操作失败')
        }
    } catch (error) {
        console.error('审批驳回失败:', error)
        ElMessage.error('网络错误，请稍后重试')
    }
}

// 初始化数据
setProcessInstanceId()

// 监听infoData变化，获取审核记录
if (infoData.value.processInstanceId) {
    getFlowRecordList(infoData.value.processInstanceId)
}

// 如果需要响应式地监听路由参数变化，可以使用watch
// watch(
//   () => route.query,
//   (newQuery) => {
//     // 处理路由参数变化
//   },
//   { immediate: true }
// )
</script>

<style lang="scss" scoped>
.container-review {
    padding: 20px;
}
</style>