<template>
  <div>
    <el-dialog 
      v-loading="loading" 
      :title="title" 
      v-model="showDialog" 
      width="800px" 
      @close="cancel" 
      class="dialog-material"
    >
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseId">
              <treeselect
                v-model="formData.warehouseId"
                :options="warehouseOptions"
                :normalizer="normalizer"
                placeholder="选择仓库"
                :disabled="disabledFlag"
                @select="handleWarehouseChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库位名称" prop="locationId">
              <el-select 
                :disabled="showLocation || disabledFlag" 
                v-model="formData.locationId" 
                placeholder="选择库位"  
                style="width: 100%;"
                clearable
                filterable
              >
                <el-option 
                  v-for="location in locationOptions" 
                  :key="location.id" 
                  :label="location.locationName" 
                  :value="location.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物料分类" prop="inventoryType">
              <el-select 
                v-model="formData.inventoryType" 
                placeholder="请选择物料分类" 
                :disabled="disabledFlag" 
                style="width: 100%;"
              >
                <el-option 
                  v-for="item in materialTypeOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料编码" prop="itemCode">
              <el-input v-model="formData.itemCode" placeholder="请输入物料编码" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="物料名称" prop="itemName">
              <el-input v-model="formData.itemName" placeholder="请输入物料名称" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型" prop="model">
              <el-input v-model="formData.model" placeholder="请输入车型" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="规格型号" prop="specModel">
              <el-input v-model="formData.specModel" placeholder="请输入规格型号（平方米）" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每车套片数" prop="quantityPerSet">
              <el-input-number 
                v-model="formData.quantityPerSet" 
                placeholder="请输入每车套片数" 
                :disabled="disabledFlag"
                :min="0"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="切割图号" prop="cuttingDrawingNo">
              <el-input v-model="formData.cuttingDrawingNo" placeholder="请输入切割图号" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="formData.unit" placeholder="请输入单位" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="当前库存数量" prop="stockQuantity">
              <el-input-number 
                v-model="formData.stockQuantity" 
                placeholder="请输入当前库存数量" 
                :disabled="disabledFlag"
                :min="0"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全库存阈值" prop="safetyStock">
              <el-input-number 
                v-model="formData.safetyStock" 
                placeholder="请输入安全库存阈值" 
                :disabled="disabledFlag"
                :min="0"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="入库日期" prop="inboundDate">
              <el-date-picker 
                style="width: 100%;" 
                v-model="formData.inboundDate" 
                type="date" 
                placeholder="选择入库日期" 
                value-format="YYYY-MM-DD" 
                :disabled="disabledFlag"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机工厂" prop="hostFactory">
              <el-input v-model="formData.hostFactory" placeholder="请输入主机工厂" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input 
                v-model="formData.remark" 
                placeholder="请输入备注" 
                type="textarea" 
                :rows="2" 
                :disabled="disabledFlag"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            :loading="loading" 
            size="small" 
            type="primary" 
            v-if="!disabledFlag" 
            @click="submitForm"
          >
            保存
          </el-button>
          <el-button :loading="loading" size="small" @click="cancel">
            {{ disabledFlag ? '关闭' : '取消' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { addBusInventory, updateBusInventory, getBusLocationList } from '@/api/statistics/busInventory'
import { listBusWarehouseTreeFa } from '@/api/statistics/BusWarehouse'

// Props
const props = defineProps({
  dicts: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['refresh'])

// 响应式数据
const loading = ref(false)
const showLocation = ref(true)
const showDialog = ref(false)
const title = ref('新增库存信息')
const disabledFlag = ref(false)
const warehouseOptions = ref([])
const locationOptions = ref([])
const formRef = ref(null)

// 物料分类选项（从字典获取）
const materialTypeOptions = ref([])

// 表单数据
const formData = reactive({
  id: null,
  warehouseId: null,
  locationId: null,
  inventoryType: '',
  itemCode: '',
  itemName: '',
  model: '',
  specModel: '',
  quantityPerSet: null,
  cuttingDrawingNo: '',
  unit: '',
  stockQuantity: null,
  safetyStock: null,
  inboundDate: '',
  hostFactory: '',
  remark: ''
})

// 表单验证规则
const formRules = reactive({
  warehouseId: [
    { required: true, message: '请选择仓库', trigger: 'change' }
  ],
  locationId: [
    { required: true, message: '请选择库位', trigger: 'change' }
  ],
  inventoryType: [
    { required: true, message: '请选择物料分类', trigger: 'change' }
  ],
  itemCode: [
    { required: true, message: '请输入物料编码', trigger: 'blur' }
  ],
  itemName: [
    { required: true, message: '请输入物料名称', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ],
  stockQuantity: [
    { required: true, message: '请输入当前库存数量', trigger: 'blur' }
  ],
  inboundDate: [
    { required: true, message: '请选择入库日期', trigger: 'change' }
  ],
  specModel: [
    { required: true, message: '请输入规格型号（平方米）', trigger: 'blur' }
  ]
})

// 转换仓库数据结构
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

// 获取仓库树形结构
const getWarehouseTree = async () => {
  try {
    const response = await listBusWarehouseTreeFa()
    warehouseOptions.value = response.data || []
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}

// 根据仓库获取库位列表
const getLocationList = async (warehouseId) => {
  if (!warehouseId) {
    locationOptions.value = []
    return
  }
  
  try {
    const res = await getBusLocationList({ warehouseId })
    if (res.code === 200) {
      locationOptions.value = res.data || []
    } else {
      ElMessage.error(res.msg || '获取库位列表失败')
    }
  } catch (error) {
    ElMessage.error('获取库位列表失败')
  }
}

// 仓库选择变化处理
const handleWarehouseChange = (selectedNode) => {
  formData.locationId = null
  formData.warehouseId = selectedNode.id
  getLocationList(selectedNode.id)
  showLocation.value = false
}

// 设置字典数据
const setDictData = (dicts) => {
  if (dicts?.material_type) {
    materialTypeOptions.value = dicts.material_type
  }
}

// 打开对话框
const openDialog = (type, row = null) => {
  showDialog.value = true
  
  // 重置表单
  resetFormData()
  
  // 获取仓库树形结构
  getWarehouseTree()
  
  if (type === 'add') {
    title.value = '新增库存信息'
    disabledFlag.value = false
  } else if (type === 'edit') {
    title.value = '修改库存信息'
    disabledFlag.value = false
    if (row) {
      Object.assign(formData, { ...row })
      if (row.warehouseId) {
        getLocationList(row.warehouseId)
      }
    }
  } else if (type === 'view') {
    title.value = '查看库存信息'
    disabledFlag.value = true
    if (row) {
      Object.assign(formData, { ...row })
      if (row.warehouseId) {
        getLocationList(row.warehouseId)
      }
    }
  }
  
  // 清除校验（仅在非查看时需要）
  nextTick(() => {
    if (formRef.value && type !== 'view') {
      formRef.value.clearValidate()
    }
  })
}

// 重置表单数据
const resetFormData = () => {
  formData.id = null
  formData.warehouseId = null
  formData.locationId = null
  formData.inventoryType = ''
  formData.itemCode = ''
  formData.itemName = ''
  formData.model = ''
  formData.specModel = ''
  formData.quantityPerSet = null
  formData.cuttingDrawingNo = ''
  formData.unit = ''
  formData.stockQuantity = null
  formData.safetyStock = null
  formData.inboundDate = ''
  formData.hostFactory = ''
  formData.remark = ''
}

// 取消
const cancel = () => {
  showDialog.value = false
  resetFormData()
  title.value = '新增库存信息'
  warehouseOptions.value = []
  locationOptions.value = []
  
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    emit('refresh')
  })
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        if (formData.id) {
          // 编辑
          const res = await updateBusInventory(formData)
          if (res.code === 200) {
            ElMessage.success('修改成功')
            cancel()
          } else {
            ElMessage.error(res.msg || '修改失败')
          }
        } else {
          // 新增
          const res = await addBusInventory(formData)
          if (res.code === 200) {
            ElMessage.success('添加成功')
            cancel()
          } else {
            ElMessage.error(res.msg || '添加失败')
          }
        }
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  // 如果有传入字典数据，设置物料分类选项
  if (props.dicts?.material_type) {
    materialTypeOptions.value = props.dicts.material_type
  }
})

// 暴露方法给父组件
defineExpose({
  openDialog,
  setDictData
})
</script>

<style scoped>
:deep(.vue-treeselect__control) {
  height: 32px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>