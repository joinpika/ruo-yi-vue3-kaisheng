<template>
  <div>
    <el-dialog 
      :title="title" 
      v-model="showDialog" 
      width="1200px" 
      @close="cancel" 
      class="dialog-material"
      v-loading="showLoading"
    >
      <el-form ref="formRef" :model="formData" label-width="130px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="物料分类" prop="inventoryType">
              <el-select 
                v-model="formData.inventoryType" 
                placeholder="请选择物料分类" 
                style="width: 100%"
                :disabled="disabledFlag"
                @change="handleCategoryChange"
              >
                <el-option label="成品" :value="0"></el-option>
                <el-option label="半成品" :value="1"></el-option>
                <el-option label="原料" :value="2"></el-option>
                <el-option label="辅料" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="入库单据" prop="aaa">
              <el-select 
                v-model="formData.aaa" 
                placeholder="请选择入库单据" 
                style="width: 100%"
                :disabled="disabledFlag"
              >
                <el-option 
                  v-for="item in inboundTypeOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型" prop="bbb">
              <el-select 
                v-model="formData.bbb" 
                placeholder="请选择入库类型" 
                style="width: 100%"
                :disabled="disabledFlag"
              >
                <el-option 
                  v-for="item in inboundTypeOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input 
                v-model="formData.remark" 
                type="textarea" 
                :rows="2" 
                placeholder="请输入备注" 
                :disabled="disabledFlag"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 入库明细表格 -->
        <div class="first-text">
          <el-table 
            :data="productList" 
            style="width: 100%; margin-top:10px;"
            :header-cell-style="{ backgroundColor: '#f5f7fa' }"
          >
            <el-table-column prop="itemCode" label="物料编码" align="center" width="150">
              <template #default="scope">
                <el-select 
                  v-model="scope.row.itemCode" 
                  placeholder="请选择" 
                  clearable 
                  filterable 
                  @change="getSelectByCode(scope.row)" 
                  :disabled="disabledFlag"
                  style="width: 100%"
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
            
            <el-table-column prop="quantity" label="数量" align="center" width="120">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  :min="0"
                  :precision="0"
                  controls-position="right"
                  size="small"
                  :disabled="disabledFlag"
                  style="width: 100%"
                />
              </template>
            </el-table-column>
            
            <el-table-column prop="unit" label="单位" align="center" width="100">
              <template #default="scope">
                <el-input v-model="scope.row.unit" disabled size="small" />
              </template>
            </el-table-column>
            
            <el-table-column prop="remark" label="备注" align="center" min-width="150">
              <template #default="scope">
                <el-input v-model="scope.row.remark" size="small" :disabled="disabledFlag" />
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="100" fixed="right" align="center">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  :disabled="disabledFlag" 
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
              :disabled="disabledFlag" 
              plain 
              @click="onAdd"
            >
              新增一项
            </el-button>
          </div>
        </div>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            size="small" 
            type="primary" 
            v-if="!disabledFlag" 
            @click="submitForm" 
            :loading="loading"
          >
            保存
          </el-button>
          <el-button size="small" @click="cancel">
            {{ disabledFlag ? '关闭' : '取消' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listBusWarehouseLocation } from '@/api/statistics/BusWarehouseLocation'
import { listSelectByCategory } from '@/api/statistics/busFinishedProduct'
import { listBusWarehouseTreeFa } from '@/api/statistics/BusWarehouse'
import { listBusWarehouse } from '@/api/statistics/BusWarehouse'
import { addBusInboundMainadd } from '@/api/statistics/BusInboundMain'
import { listBusInboundDetail } from '@/api/statistics/BusInboundDetail'

// Emits
const emit = defineEmits(['refresh'])

// 响应式数据
const loading = ref(false)
const showLoading = ref(false)
const showDialog = ref(false)
const title = ref('新增入库')
const disabledFlag = ref(false)
const formRef = ref(null)

// 表单数据
const formData = reactive({
  inventoryType: null,
  aaa: '',
  bbb: '',
  remark: '',
  inboundNo: '',
  id: null
})

// 表单验证规则
const formRules = reactive({
  aaa: [
    { required: true, message: '请选择入库单据', trigger: 'change' }
  ],
  bbb: [
    { required: true, message: '请选择入库类型', trigger: 'change' }
  ],
  inventoryType: [
    { required: true, message: '请选择物料分类', trigger: 'change' }
  ]
})

// 选项数据
const inboundTypeOptions = ref([
  { value: 'purchase', label: '采购入库' },
  { value: 'return', label: '退货入库' },
  { value: 'transfer', label: '调拨入库' },
  { value: 'other', label: '其他入库' }
])

const warehouseOptions = ref([])
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
const getWarehouseTree = async () => {
  try {
    const response = await listBusWarehouseTreeFa()
    if (response.code === 200) {
      warehouseOptions.value = handleTree(response.data, 'id')
    }
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}

// 获取仓库列表（普通列表）
const getWarehouseList = async () => {
  try {
    const res = await listBusWarehouse()
    if (res.code === 200) {
      // 处理仓库数据
    }
    await getWarehouseTree()
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}

// 根据分类查询产品列表
const getSelectByCategory = async (row) => {
  if (!formData.inventoryType) return
  
  try {
    const res = await listSelectByCategory({ categoryId: formData.inventoryType })
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
    row.unit = ''
    return
  }
  
  try {
    const res = await listSelectByCategory({ 
      productCode: row.itemCode, 
      categoryId: formData.inventoryType 
    })
    
    if (res.code === 200 && res.data && res.data.length > 0) {
      row.productNameOptions = res.data
      row.itemName = res.data[0].productName
      row.specification = res.data[0].specification
      row.unit = res.data[0].unit
    }
  } catch (error) {
    ElMessage.error('获取产品详情失败')
  }
}

// 物料分类变化
const handleCategoryChange = () => {
  // 清空明细列表
  productList.value = []
}

// 新增一行
const onAdd = () => {
  if (!formData.inventoryType) {
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
    remark: '',
    productCodeOptions: [],
    productNameOptions: []
  })
  
  productList.value.push(newRow)
  getSelectByCategory(newRow)
}

// 删除行
const handleDeleteForm = (index) => {
  if (productList.value.length > 1) {
    productList.value.splice(index, 1)
  } else {
    ElMessage.warning('至少保留一行数据')
  }
}

// 初始化明细列表（用于编辑/查看回显）
const initProductList = (list, mode) => {
  if (!list || list.length === 0) {
    productList.value = []
    return
  }
  
  productList.value = list.map(item => {
    const row = reactive({
      ...item,
      specification: item.spec,
      quantity: item.quantity || 0,
      productCodeOptions: [],
      productNameOptions: []
    })
    
    // 异步加载联动数据
    getSelectByCategory(row)
    if (row.itemCode) {
      getSelectByCode(row)
    }
    
    return row
  })
}

// 获取详情数据
const getDetailList = async (id, mode) => {
  try {
    showLoading.value = true
    const res = await listBusInboundDetail({ inboundId: id })
    if (res.code === 200) {
      initProductList(res.rows || [], mode)
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  } finally {
    showLoading.value = false
  }
}

// 打开对话框
const openDialog = (type, row = null) => {
  showDialog.value = true
  disabledFlag.value = type === 'view'
  
  // 重置表单
  formData.inventoryType = null
  formData.aaa = ''
  formData.bbb = ''
  formData.remark = ''
  formData.inboundNo = ''
  formData.id = null
  productList.value = []
  
  if (type === 'add') {
    title.value = '新增入库'
    // 添加默认一行
    onAdd()
  } else if (type === 'edit') {
    title.value = '修改入库'
    if (row) {
      formData.id = row.id
      formData.inboundNo = row.inboundNo
      formData.inventoryType = row.inventoryType
      getDetailList(row.id, type)
    }
  } else if (type === 'view') {
    title.value = '查看入库'
    if (row) {
      formData.id = row.id
      formData.inboundNo = row.inboundNo
      formData.inventoryType = row.inventoryType
      getDetailList(row.id, type)
    }
  }
  
  // 清除校验
  nextTick(() => {
    if (formRef.value && type !== 'view') {
      formRef.value.clearValidate()
    }
  })
}

// 取消
const cancel = () => {
  showDialog.value = false
  loading.value = false
  productList.value = []
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 校验明细数据
      if (!productList.value || productList.value.length === 0) {
        return ElMessage.warning('请至少新增一项入库明细')
      }
      
      for (let item of productList.value) {
        if (!item.itemCode || !item.itemName || !item.quantity) {
          return ElMessage.warning('请完善入库明细信息')
        }
        if (item.quantity <= 0) {
          return ElMessage.warning('数量必须大于0')
        }
      }
      
      // 构建提交参数
      const params = {
        busInboundMain: {
          inboundNo: formData.inboundNo,
          inventoryType: formData.inventoryType
        },
        busInboundDetailList: productList.value.map(item => ({
          warehouseId: item.warehouseId,
          locationId: item.locationId,
          itemCode: item.itemCode,
          itemName: item.itemName,
          spec: item.specification,
          unit: item.unit,
          quantity: item.quantity,
          remark: item.remark
        }))
      }
      
      // 如果有ID，添加ID
      if (formData.id) {
        params.busInboundMain.id = formData.id
      }
      
      loading.value = true
      
      try {
        const res = await addBusInboundMainadd(params)
        if (res.code === 200) {
          ElMessage.success('保存成功')
          cancel()
          emit('refresh')
        } else {
          ElMessage.error(res.msg || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 树形数据处理函数（如果全局没有，需要实现）
const handleTree = (data, id) => {
  // 简单的树形结构处理
  const tree = []
  const map = {}
  
  data.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })
  
  data.forEach(item => {
    const parent = map[item.parentId]
    if (parent) {
      parent.children.push(map[item.id])
    } else {
      tree.push(map[item.id])
    }
  })
  
  return tree
}

// 初始化
onMounted(() => {
  getWarehouseList()
})

// 暴露方法给父组件
defineExpose({
  openDialog
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
</style>