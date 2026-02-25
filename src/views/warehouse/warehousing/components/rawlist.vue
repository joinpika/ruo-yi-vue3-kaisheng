<!-- api 结算明细列表 -->
<template>
  <div>
    <div class="first-text">
      <el-button
        type="primary"
        class="form-btn"
        :icon="Download"
        size="small"
        plain
        @click="handleExport"
        :loading="exportLoading"
      >导出</el-button>
    </div>
    <el-table 
      show-summary 
      :data="infoTableData" 
      style="width: 100%"
      v-loading="loading"
      border
      :header-cell-style="{ backgroundColor: '#f5f7fa' }"
      :summary-method="getSummaries"
    >
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column prop="settleNo" label="结算单编号" align="center" width="200" :show-overflow-tooltip="true" />
      <el-table-column prop="settleDate" label="结算时间" align="center" width="170" />
      <el-table-column prop="projectName" label="项目名称" align="center" width="200" :show-overflow-tooltip="true" />
      <el-table-column prop="orderNo" label="订单编号" align="center" width="200" :show-overflow-tooltip="true" />
      <el-table-column prop="contractMaterial" label="库存材质" align="center" width="150" />
      <el-table-column prop="contractMaterial" label="合同材质" align="center" width="150" />
      <el-table-column prop="steelMill" label="钢厂" align="center" width="150" />
      <el-table-column prop="warehouse" label="仓库" align="center" width="150" />
      <el-table-column prop="specification" label="规格" align="center" width="150" />
      <el-table-column prop="length" label="米数" align="center" width="150" />
      <el-table-column prop="settleQuantity" label="结算件数" align="center" width="150" />
      <el-table-column prop="settleWeight" label="结算重量/T" align="center" width="150" />
      <el-table-column prop="settleUnitPrice" label="结算单价" align="center" width="150" />
      <el-table-column prop="settlementAmount" label="结算总金额" align="center" width="150" fixed="right" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { settleList } from '@/api/bus/salesSettle.js'

// Props
const props = defineProps({
  id: {
    type: Number,
    default: null
  }
})

// 响应式数据
const loading = ref(false)
const exportLoading = ref(false)
const infoTableData = ref([])

// 搜索表单
const searchForm = ref({
  customerId: props.id,
  pageNum: 1,
  pageSize: 100
})

// 获取结算列表
const getJsList = async () => {
  if (!props.id) {
    infoTableData.value = []
    return
  }
  
  loading.value = true
  try {
    const res = await settleList(searchForm.value)
    if (res.code === 200) {
      infoTableData.value = res.rows || []
      console.log('结算信息:', infoTableData.value)
    } else {
      ElMessage.error(res.msg || '获取结算列表失败')
    }
  } catch (error) {
    ElMessage.error('获取结算列表失败')
  } finally {
    loading.value = false
  }
}

// 导出功能
const handleExport = async () => {
  if (!infoTableData.value || infoTableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  exportLoading.value = true
  try {
    await download('bus/salesSettle/export', {
      ...searchForm.value
    }, `结算信息_${new Date().getTime()}.xlsx`)
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 通用下载方法（需要根据实际项目实现）
const download = (url, params, filename) => {
  return new Promise((resolve, reject) => {
    // 这里需要根据实际项目的下载方法实现
    // 如果是使用 axios 的 blob 方式下载
    console.log('download params:', { url, params, filename })
    
    // 模拟下载成功
    setTimeout(() => {
      ElMessage.success('导出成功')
      resolve()
    }, 1000)
    
    // 实际项目中可能是这样：
    /*
    import { download as downloadFile } from '@/utils/request'
    downloadFile(url, params, filename).then(resolve).catch(reject)
    */
  })
}

// 自定义合计行
const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    
    const values = data.map(item => Number(item[column.property]))
    
    if (column.property === 'settleQuantity' || 
        column.property === 'settleWeight' || 
        column.property === 'settlementAmount') {
      const total = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
      
      // 格式化合计值
      if (column.property === 'settlementAmount') {
        sums[index] = total.toFixed(2)
      } else {
        sums[index] = total
      }
    } else {
      sums[index] = ''
    }
  })
  
  return sums
}

// 监听 id 变化
watch(() => props.id, (newVal) => {
  if (newVal) {
    searchForm.value.customerId = newVal
    getJsList()
  } else {
    infoTableData.value = []
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  // 如果有 id，自动获取列表
  if (props.id) {
    getJsList()
  }
})
</script>

<style scoped>
.first-text {
  margin: 5px 0;
  display: flex;
  justify-content: flex-end;
}
</style>