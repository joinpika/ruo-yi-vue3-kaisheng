<template>
  <div>
    <div class="first-text">
      <el-button
        type="primary"
        class="form-btn"
        icon="Download"
        size="small"
        plain
        @click="handleExport"
      >导出</el-button>
    </div>
    <el-table show-summary :data="infoTableData" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column prop="settleNo" label="结算单编号" align="center" width="200" />
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
  import { ref, reactive, onMounted } from 'vue'
  import { Download } from '@element-plus/icons-vue'
  import { settleList } from '@/api/bus/salesSettle.js'

  const props = defineProps({
    id: {
      type: Number,
      default: null
    }
  })

  const infoTableData = ref([])
  const searchForm = reactive({
    customerId: props.id,
    pageNum: 1,
    pageSize: 100
  })

  onMounted(() => {
    getJsList()
    console.log('结算信息', props.id)
  })

  const handleExport = () => {
    download('bus/salesSettle/export', {
      ...searchForm
    }, `结算信息_${new Date().getTime()}.xlsx`)
  }

  const getJsList = () => {
    settleList(searchForm).then(res => {
      if (res.code === 200) {
        infoTableData.value = res.rows || []
        console.log('infoTableData :>> ', infoTableData.value)
      }
    })
  }
</script>

<style scoped>
.first-text {
  margin: 5px 0;
}
</style>