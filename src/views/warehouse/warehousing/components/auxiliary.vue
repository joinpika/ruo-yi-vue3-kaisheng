<!-- api 结算明细列表 -->
<template>
  <div class="first-text">
    <el-table 
      :data="productList" 
      style="width: 100%; margin-top:10px;"
      :header-cell-style="{ backgroundColor: '#f5f7fa' }"
    >
      <el-table-column prop="warehouseId" label="仓库信息" align="center" width="180">
        <template #default="scope">
          <treeselect
            v-model="scope.row.warehouseId"
            :options="warehouseOptions"
            :normalizer="normalizer"
            placeholder="请选择仓库名称"
            :disabled="mode || disabledFlag"
            :append-to-body="true"
            :z-index="9999"
            style="width: 100%;"
            @select="(val) => handleWarehouseSelect(val, scope.row)"
            :searchable="true"
            :clearable="true"
            :default-expand-level="1"
            search-nested
          />
        </template>
      </el-table-column>
      
      <el-table-column prop="locationId" label="库位" align="center" width="150">
        <template #default="scope">
          <el-select 
            v-model="scope.row.locationId" 
            placeholder="请选择库位" 
            clearable 
            filterable 
            :disabled="!scope.row.warehouseId || mode || disabledFlag"
            style="width: 100%;"
          >
            <el-option 
              v-for="item in scope.row.locationOptions" 
              :key="item.id" 
              :label="item.locationName" 
              :value="item.id" 
            />
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column prop="itemCode" label="物料编码" align="center" width="150">
        <template #default="scope">
          <el-select 
            v-model="scope.row.itemCode" 
            placeholder="请选择物料编码" 
            clearable 
            filterable 
            @change="getSelectByCode(scope.row)" 
            :disabled="mode || disabledFlag"
            style="width: 100%;"
          >
            <el-option 
              v-for="item in scope.row.productCodeOptions" 
              :key="item.productCode" 
              :label="item.productCode" 
              :value="item.productCode" 
            />
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column prop="itemName" label="物料名称" align="center" width="150">
        <template #default="scope">
          <el-input v-model="scope.row.itemName" disabled size="small" />
        </template>
      </el-table-column>
      
      <el-table-column prop="specification" label="规格型号" align="center" width="150">
        <template #default="scope">
          <el-input v-model="scope.row.specification" disabled size="small" />
        </template>
      </el-table-column>
      
      <el-table-column prop="quantity" label="入库数量" align="center" width="120">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.quantity"
            :min="0"
            :precision="0"
            controls-position="right"
            size="small"
            :disabled="mode || disabledFlag"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="80" fixed="right" align="center">
        <template #default="scope">
          <el-button 
            type="danger" 
            link 
            size="small" 
            :disabled="mode || disabledFlag" 
            @click="handleDeleteForm(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="first-text" style="margin-top: 10px;">
      <el-button 
        type="primary" 
        size="small" 
        :icon="Plus" 
        :disabled="mode || disabledFlag" 
        plain 
        @click="onAdd"
      >
        新增一项
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { Treeselect } from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { listBusWarehouseTreeFa } from '@/api/statistics/BusWarehouse'
import { listBusWarehouseLocation } from '@/api/statistics/BusWarehouseLocation'
import { listSelectByCategory } from '@/api/statistics/busFinishedProduct'

// Props
const props = defineProps({
  categoryId: {
    type: [Number, String],
    default: null
  },
  disabledFlag: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:productList', 'change'])

// 响应式数据
const warehouseOptions = ref([])
const mode = ref(false)
const productList = ref([])

// 转换树形数据结构
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children
  }
  return {
    id: node.id,
    label: node.warehouseName,
    children: node.children
  }
}

// 获取仓库列表（树形结构）
const getWarehouseList = async () => {
  try {
    const response = await listBusWarehouseTreeFa()
    if (response.code === 200) {
      warehouseOptions.value = handleTree(response.data, 'id')
      console.log('仓库选项:', warehouseOptions.value)
    }
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}

// 根据分类查询产品列表
const getSelectByCategory = async (row) => {
  if (!props.categoryId) return
  
  try {
    const res = await listSelectByCategory({ categoryId: props.categoryId })
    if (res.code === 200 && row) {
      row.productCodeOptions = res.data || []
    }
  } catch (error) {
    ElMessage.error('获取产品列表失败')
  }
}

// 根据产品编码查询详情
const getSelectByCode = async (row) => {
  if (!row.itemCode) {
    row.itemName = ''
    row.specification = ''
    return
  }
  
  try {
    const res = await listSelectByCategory({ 
      productCode: row.itemCode, 
      categoryId: props.categoryId 
    })
    
    if (res.code === 200 && res.data && res.data.length > 0) {
      row.productNameOptions = res.data
      row.itemName = res.data[0].productName
      row.quantity = 0
      row.specification = res.data[0].specification
      row.unit = res.data[0].unit
    }
  } catch (error) {
    ElMessage.error('获取产品详情失败')
  }
}

// 根据仓库获取库位列表
const getLocationByProduct = async (row) => {
  if (!row.warehouseId) {
    row.locationId = ''
    row.locationOptions = []
    return
  }
  
  try {
    const res = await listBusWarehouseLocation({ warehouseId: row.warehouseId })
    if (res.code === 200) {
      row.locationOptions = res.rows || []
    }
  } catch (error) {
    ElMessage.error('获取库位列表失败')
  }
  
  // 重新获取产品列表
  await getSelectByCategory(row)
}

// 仓库选择处理
const handleWarehouseSelect = (selectedNode, row) => {
  row.warehouseId = selectedNode.id
  getLocationByProduct(row)
}

// 新增一行
const onAdd = () => {
  if (!props.categoryId) {
    ElMessage.warning('请先选择物料分类')
    return
  }
  
  const newRow = reactive({
    warehouseId: null,
    locationId: '',
    itemCode: '',
    itemName: '',
    quantity: 0,
    specification: '',
    unit: '',
    locationOptions: [],
    productCodeOptions: [],
    productNameOptions: []
  })
  
  productList.value.push(newRow)
  
  // 为新行加载产品列表
  getSelectByCategory(newRow)
  
  // 触发变更事件
  emit('update:productList', productList.value)
  emit('change', productList.value)
}

// 删除行
const handleDeleteForm = (index) => {
  if (productList.value.length > 1) {
    productList.value.splice(index, 1)
    // 触发变更事件
    emit('update:productList', productList.value)
    emit('change', productList.value)
  } else {
    ElMessage.warning('至少保留一行数据')
  }
}

// 初始化数据（用于修改回显）
const initData = (list, viewMode = false) => {
  console.log('初始化数据:', list)
  
  if (!list || list.length === 0) {
    productList.value = []
    return
  }
  
  mode.value = viewMode
  
  productList.value = list.map(item => {
    const row = reactive({
      ...item,
      specification: item.spec || item.specification,
      quantity: item.quantity || 0,
      locationOptions: [],
      productCodeOptions: [],
      productNameOptions: []
    })
    
    // 异步加载联动数据
    getLocationByProduct(row)
    getSelectByCategory(row)
    
    return row
  })
}

// 树形数据处理函数
const handleTree = (data, idField = 'id', parentIdField = 'parentId', childrenField = 'children') => {
  const tree = []
  const map = {}
  
  data.forEach(item => {
    map[item[idField]] = { ...item, [childrenField]: [] }
  })
  
  data.forEach(item => {
    const parent = map[item[parentIdField]]
    if (parent) {
      parent[childrenField].push(map[item[idField]])
    } else {
      tree.push(map[item[idField]])
    }
  })
  
  return tree
}

// 监听分类ID变化
watch(() => props.categoryId, (newVal) => {
  if (newVal) {
    // 清空现有列表
    productList.value = []
  }
})

// 初始化
onMounted(() => {
  getWarehouseList()
})

// 暴露方法给父组件
defineExpose({
  initData,
  productList
})
</script>

<style scoped>
.first-text {
  margin: 5px 0;
}

/* 解决在 table 中可能出现的高度塌陷 */
:deep(.vue-treeselect__control) {
  height: 32px !important;
  line-height: 32px !important;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

:deep(.el-select) {
  width: 100%;
}
</style>