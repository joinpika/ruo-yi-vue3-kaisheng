<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="form-head mb-10">
      <el-form :inline="true" :model="searchForm" :label-width="labelWidth">
        <el-form-item label="文件名称：">
          <el-input v-model="searchForm.fileName" placeholder="请输入" class="form-input" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :icon="Search" @click="getList">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 日志信息表格 -->
    <div class="form-table">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="logId" label="日志ID" align="center"/>
        <el-table-column prop="fileId" label="文件ID" align="center" />
        <el-table-column prop="fileName" label="文件名称" align="center" />
        <el-table-column prop="operationType" label="操作类型" align="center">
          <template #default="scope">
            <span v-if="scope.row.operationType === 'UPLOAD'">上传</span>
            <span v-if="scope.row.operationType === 'DOWNLOAD'">下载</span>
            <span v-if="scope.row.operationType === 'MODIFY_LEVEL'">修改等级</span>
            <span v-if="scope.row.operationType === 'OFF_SHELVES'">文件下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="operationUser" label="操作用户" align="center" />
        <el-table-column prop="operationTime" label="操作时间" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="operationDesc" label="操作描述" align="center" width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="ip" label="IP地址" align="center" width="180"/>
        <el-table-column prop="deptId" label="部门ID" align="center" width="180"/>
      </el-table>
      <div class="text-right mt-10">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-model:page-size="searchForm.pageSize"
          v-model:current-page="searchForm.pageNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { listBusFileLog } from '@/file/busFileLog.js'
import { listBusFileLevel } from '@/file/BusFileLevel.js'

// 响应式数据
const tableData = ref([])
const labelWidth = ref('120px')
const total = ref(0)
const secretOptions = ref([])

// 搜索表单
const searchForm = reactive({
  fileName: '',
  pageSize: 10,
  pageNum: 1
})

// 获取保密程度列表
const getSecretLevel = async () => {
  try {
    const res = await listBusFileLevel()
    if (res.code === 200) {
      secretOptions.value = res.rows
    }
  } catch (error) {
    ElMessage.error('获取保密程度失败')
  }
}

// 获取列表数据
const getList = async () => {
  try {
    const res = await listBusFileLog(searchForm)
    if (res.code === 200) {
      tableData.value = res.rows
      total.value = res.total
    }
  } catch (error) {
    ElMessage.error('获取日志列表失败')
  }
}

// 重置搜索条件
const handleReset = () => {
  searchForm.fileName = ''
  searchForm.pageSize = 10
  searchForm.pageNum = 1
  getList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  searchForm.pageSize = val
  getList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  searchForm.pageNum = val
  getList()
}

// 初始化
onMounted(() => {
  getList()
  getSecretLevel()
})
</script>

<style scoped>
.form-right {
  margin-right: 50px;
}

.header-after {
  display: flex;
  align-items: center;
  background-color: #e6f7ff;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #bae7ff;
}

.after-header {
  font-size: 14px;
  margin-right: 50px;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  padding-right: 100px;
}

.text-header {
  font-size: 23px;
}

.btn-group {
  display: flex;
}

.form-input {
  width: 220px;
}

.product-info-container {
  padding: 20px;
  background-color: #fff;
}

.search-section {
  padding: 15px;
  border-radius: 4px;
}

.el-button {
  margin-right: 10px;
}
</style>