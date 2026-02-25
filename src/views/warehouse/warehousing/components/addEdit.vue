<template>
  <div class="container">
    <div class="wrap-content">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="入库日期">
            <el-date-picker v-model="inboundDate" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="物料分类">
            <el-select v-model="searchForm.inventoryType" placeholder="请选择">
              <el-option v-for="dict in dict.type.material_type" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="search-btns">
          <el-button type="primary" icon="Search" size="small" @click="getList">搜索</el-button>
          <el-button icon="Refresh" size="small" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="box-line"></div>

      <!-- 列表相关 -->
      <el-row :gutter="20" style="margin-top: 16px;">
        <splitpanes :horizontal="device === 'mobile'" class="default-theme">
          <pane size="16">
            <el-col>
              <div class="head-container">
                <el-tree ref="treeRef" :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                  :filter-node-method="filterNode" node-key="id" default-expand-all highlight-current
                  @node-click="handleNodeClick" />
              </div>
            </el-col>
          </pane>
          <pane size="84">
            <el-col>
              <div>
                <el-table v-loading="loading" :data="tableData" style="width: 100%" 
                  :header-cell-style="{ backgroundColor: '#f5f7fa' }" height="550px">
                  <el-table-column type="index" align="center" label="序号" width="50" />
                  <el-table-column prop="warehouseName" label="仓库名称" align="center" min-width="100" />
                  <el-table-column prop="locationName" label="库位名称" align="center" min-width="100"/>
                  <el-table-column prop="inventoryType" label="物料分类" min-width="100" align="center" :show-overflow-tooltip="true">
                    <template #default="scope">
                      {{ dict.type.material_type[scope.row.inventoryType]?.label || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="itemCode" label="物料编码" align="center" min-width="100"/>
                  <el-table-column prop="itemName" label="物料名称" width="150" :show-overflow-tooltip="true" />
                  <el-table-column prop="unit" label="单位" align="center" />
                  <el-table-column prop="stockQuantity" label="当前库存数量" align="center" width="150" />
                  <el-table-column prop="updateTime" label="最后操作时间" align="center" width="160" />
                  <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template #default="scope">
                      <el-button size="default" type="text" @click="handleDialog('view', scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination :total="total" v-model:page="searchForm.pageNum" v-model:limit="searchForm.pageSize"
                  @pagination="getList" />
              </div>
            </el-col>
          </pane>
        </splitpanes>
      </el-row>
    </div>
    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialogRef" />
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, Refresh } from '@element-plus/icons-vue'
  import { Splitpanes, Pane } from "splitpanes"
  import "splitpanes/dist/splitpanes.css"
  import addEdit from "./components/addEdit.vue"
  import { listBusLocationTreeFa, listWarehouseList } from "@/api/statistics/BusWarehouse"
  import { getBusInventoryList } from "@/api/statistics/busInventory.js"

  // 使用 Vuex 的设备状态
  const device = computed(() => store?.getters?.device || 'desktop')

  const dict = {
    type: {
      material_type: []
    }
  }

  const inboundDate = ref([])
  const loading = ref(true)
  const deptOptions = ref([])
  const tableData = ref([])
  const total = ref(0)
  const warehouseOptions = ref([])
  const treeRef = ref()
  const rawDialogRef = ref()

  const searchForm = reactive({
    beginInboundDate: "",
    endInboundDate: "",
    inventoryType: "",
    pageSize: 10,
    pageNum: 1,
    warehouseId: "",
    warehouseName: "",
  })

  const defaultProps = {
    children: "children",
    label: "warehouseName",
  }

  onMounted(() => {
    getList()
    getDeptTree()
    getWarehouseList()
  })

  const getWarehouseList = () => {
    listWarehouseList().then(res => {
      if (res.code === 200) {
        warehouseOptions.value = res.data
      }
    })
  }

  const getDeptTree = () => {
    listBusLocationTreeFa().then(response => {
      if (response.code === 200) {
        deptOptions.value = response.data
        searchForm.warehouseId = null
        getList()
      }
    })
  }

  const filterDisabledDept = (deptList) => {
    return deptList.filter(dept => {
      if (dept.children && dept.children.length) {
        dept.children = filterDisabledDept(dept.children)
      }
      return true
    })
  }

  const getList = () => {
    loading.value = true
    const param = {
      beginInboundDate: inboundDate.value[0],
      endInboundDate: inboundDate.value[1],
      inventoryType: searchForm.inventoryType,
      pageSize: searchForm.pageSize,
      pageNum: searchForm.pageNum,
      warehouseId: searchForm.warehouseId,
      warehouseName: searchForm.warehouseName,
    }
    getBusInventoryList(param).then((res) => {
      if (res.code === 200) {
        tableData.value = res.rows
        total.value = res.total
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
    })
  }

  const handleReset = () => {
    inboundDate.value = []
    Object.assign(searchForm, {
      beginInboundDate: "",
      endInboundDate: "",
      inventoryType: "",
      pageSize: 10,
      pageNum: 1,
      warehouseId: "",
      warehouseName: "",
    })
    getList()
  }

  const handleDialog = (type, row = null) => {
    if (rawDialogRef.value) {
      rawDialogRef.value.openDialog(type, row)
    }
  }

  const filterNode = (value, data) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }

  const handleNodeClick = (data) => {
    console.log(data)
    if (data.id !== 0) {
      searchForm.warehouseId = data.id
      searchForm.warehouseName = data.warehouseName
      getList()
    }
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm("确定要删除该仓库吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      delBusWarehouse(row.id).then((res) => {
        if (res.code === 200) {
          ElMessage.success("删除成功")
          getList()
        }
      })
    }).catch(() => {
      ElMessage.info("已取消删除")
    })
  }
</script>

<style lang='scss' scoped>
@import "@/styles/material.scss";

.head-container{
  height: 100vh;
}
</style>