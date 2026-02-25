<template>
  <div class="container">
    <div class="wrap-content">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="入库日期">
            <el-date-picker 
              v-model="inboundDate" 
              type="daterange" 
              range-separator="至" 
              start-placeholder="开始日期"
              end-placeholder="结束日期" 
              value-format="YYYY-MM-DD" 
            />
          </el-form-item>
          <el-form-item label="物料分类">
            <el-select v-model="searchForm.inventoryType" placeholder="请选择">
              <el-option 
                v-for="item in materialTypeOptions" 
                :key="item.value" 
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="search-btns">
          <el-button type="primary" :icon="Search" size="small" @click="getList">搜索</el-button>
          <el-button :icon="Refresh" size="small" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="box-line"></div>

      <!-- 列表相关 -->
      <el-row :gutter="20" style="margin-top: 16px;">
        <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
          <pane size="16">
            <el-col>
              <div class="head-container">
                <el-tree 
                  ref="treeRef" 
                  :data="deptOptions" 
                  :props="defaultProps" 
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode" 
                  node-key="id" 
                  default-expand-all 
                  highlight-current
                  @node-click="handleNodeClick" 
                />
              </div>
            </el-col>
          </pane>
          <pane size="84">
            <el-col>
              <div>
                <el-table 
                  v-loading="loading" 
                  :data="tableData" 
                  style="width: 100%" 
                  :header-cell-style="{ backgroundColor: '#f5f7fa' }"  
                  height="550px"
                >
                  <el-table-column type="index" align="center" label="序号" width="50" />
                  <el-table-column prop="warehouseName" label="仓库名称" align="center" min-width="100" />
                  <el-table-column prop="locationName" label="库位名称" align="center" min-width="100"/>
                  <el-table-column prop="inventoryType" label="物料分类" min-width="100" align="center" :show-overflow-tooltip="true" >
                    <template #default="scope">
                      {{ getMaterialTypeLabel(scope.row.inventoryType) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="itemCode" label="物料编码" align="center" min-width="100"/>
                  <el-table-column prop="itemName" label="物料名称" width="150" :show-overflow-tooltip="true" />
                  <el-table-column prop="unit" label="单位" align="center" />
                  <el-table-column prop="stockQuantity" label="当前库存数量" align="center" width="150" />
                  <el-table-column prop="updateTime" label="最后操作时间" align="center" width="160" />
                  <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template #default="scope">
                      <el-button size="small" type="primary" link @click="handleDialog('view', scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination 
                  v-model:page="searchForm.pageNum" 
                  v-model:limit="searchForm.pageSize"
                  :total="total" 
                  @pagination="getList" 
                />
              </div>
            </el-col>
          </pane>
        </splitpanes>
      </el-row>
    </div>
    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialogRef"></add-edit>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import useAppStore from '@/store/modules/app'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import addEdit from './components/addEdit.vue'
import { listBusWarehouseTreeFa, listBusLocationTreeFa, listWarehouseList } from '@/api/statistics/BusWarehouse'
import { getBusInventoryList } from '@/api/statistics/busInventory.js'

// Pinia store
const appStore = useAppStore()

// 响应式数据
const loading = ref(true)
const type = ref('')
const inboundDate = ref([])
const total = ref(0)
const tableData = ref([])
const warehouseOptions = ref([])
const deptOptions = ref([])
const treeRef = ref(null)
const rawDialogRef = ref(null)

// 物料分类选项
const materialTypeOptions = ref([])

// 搜索表单
const searchForm = reactive({
  beginInboundDate: '',
  endInboundDate: '',
  inventoryType: '',
  pageSize: 10,
  pageNum: 1,
  warehouseId: null,
  warehouseName: ''
})

// 树形组件属性
const defaultProps = {
  children: 'children',
  label: 'warehouseName'
}

// 获取物料分类标签
const getMaterialTypeLabel = (value) => {
  const item = materialTypeOptions.value.find(item => item.value === value)
  return item ? item.label : value
}

// 获取仓库信息
const getWarehouseList = async () => {
  try {
    const res = await listWarehouseList()
    if (res.code === 200) {
      warehouseOptions.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}

// 查询部门下拉树结构
const getDeptTree = async () => {
  try {
    const response = await listBusLocationTreeFa()
    deptOptions.value = response.data || []
    searchForm.warehouseId = null
    getList()
  } catch (error) {
    ElMessage.error('获取仓库树失败')
  }
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  
  // 设置日期范围
  if (inboundDate.value && inboundDate.value.length === 2) {
    searchForm.beginInboundDate = inboundDate.value[0]
    searchForm.endInboundDate = inboundDate.value[1]
  } else {
    searchForm.beginInboundDate = ''
    searchForm.endInboundDate = ''
  }
  
  try {
    const res = await getBusInventoryList({
      ...searchForm
    })
    
    if (res.code === 200) {
      tableData.value = res.rows || []
      total.value = res.total || 0
    } else {
      ElMessage.error(res.msg || '获取列表失败')
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

// 重置搜索
const handleReset = () => {
  inboundDate.value = []
  searchForm.beginInboundDate = ''
  searchForm.endInboundDate = ''
  searchForm.inventoryType = ''
  searchForm.warehouseId = null
  searchForm.warehouseName = ''
  searchForm.pageNum = 1
  getList()
}

// 打开弹窗
const handleDialog = (type, row = null) => {
  if (rawDialogRef.value) {
    rawDialogRef.value.openDialog(type, row)
  }
}

// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

// 节点单击事件
const handleNodeClick = (data) => {
  console.log('节点点击:', data)
  if (data.id !== 0) {
    searchForm.warehouseId = data.id
    searchForm.warehouseName = data.warehouseName
    getList()
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该仓库吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await delBusWarehouse(row.id)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          getList()
        }
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 设置字典数据
const setDictData = (dicts) => {
  if (dicts?.material_type) {
    materialTypeOptions.value = dicts.material_type
  }
}

// 初始化
onMounted(() => {
  getList()
  getDeptTree()
  getWarehouseList()
})

// 暴露方法给父组件
defineExpose({
  setDictData
})
</script>

<style lang="scss" scoped>
@import "@/styles/material.scss";

.head-container {
  height: 100vh;
  overflow-y: auto;
}

:deep(.vue-treeselect__control) {
  height: 32px;
}
</style>