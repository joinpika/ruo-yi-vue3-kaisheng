<template>
  <div>
    <el-dialog 
      v-loading="showLoading" 
      :title="title" 
      v-model="showDialog" 
      width="1200px" 
      @close="cancel"
      class="dialog-material"
    >
      <el-form ref="formRef" :model="formData" label-width="110px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="出库单号" prop="busOutboundMain.outboundNo">
              <div v-if="disabledFlag && formData.busOutboundMain.outboundNo">{{ formData.busOutboundMain.outboundNo }}</div>
              <el-input 
                v-else 
                v-model="formData.busOutboundMain.outboundNo" 
                placeholder="请输入出库单号" 
                style="width: 200px;"
                :disabled="disabledFlag" 
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料分类" prop="busOutboundMain.inventoryType">
              <el-select 
                v-if="materialTypeOptions.length && !disabledFlag"
                v-model="formData.busOutboundMain.inventoryType" 
                placeholder="请选择物料分类" 
                style="width: 200px;"
              >
                <el-option 
                  v-for="item in materialTypeOptions" 
                  :key="item.value" 
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span v-if="materialTypeOptions.length && disabledFlag && formData.busOutboundMain.inventoryType !== ''">
                {{ getMaterialTypeLabel(formData.busOutboundMain.inventoryType) || '-' }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <div class="tableBox">
        <div class="tit">
          <div>仓库名称</div>
          <div>库位</div>
          <div>物料编码</div>
          <div>商品名称</div>
          <div>规格型号</div>
          <div>计量单位</div>
          <div>出库数量</div>
          <div>操作</div>
        </div>

        <div class="boxBody">
          <div v-for="(item, index) in formData.busOutboundDetailList" :key="index" class="row">
            <div class="col">
              <treeselect 
                v-model="item.warehouseId" 
                :options="warehouseOptions" 
                :normalizer="normalizer"
                placeholder="选择仓库" 
                :disabled="disabledFlag" 
                @select="(val) => handleWarehouseChange(val, index)"
                :appendToBody="true" 
                :zIndex="9999" 
                style="font-size: 12px;" 
                :searchable="true"
                :clearable="true"
                :default-expand-level="1"
                search-nested
              />
            </div>
            <div class="col">
              <div v-if="disabledFlag && item.locationName">{{ item.locationName }}</div>
              <el-select 
                v-else
                clearable 
                filterable 
                :disabled="disabledFlag"
                @change="(value) => handleLocationChange(value, index)" 
                v-model="item.locationId" 
                placeholder="选择库位"
                style="width: 100%;"
              >
                <el-option 
                  v-for="location in locationOptions" 
                  :key="location.id" 
                  :label="location.locationName"
                  :value="location.id"
                />
              </el-select>
            </div>
            <div class="col">
              <el-select 
                clearable 
                filterable 
                @change="(value) => itemCodeChange(value, index)" 
                v-model="item.itemCode" 
                placeholder="请选择物料编码"
                style="width: 100%" 
                :disabled="disabledFlag"
              >
                <el-option 
                  v-for="inventory in inventoryOptions" 
                  :key="inventory.id" 
                  :label="inventory.itemCode"
                  :value="inventory.itemCode"
                />
              </el-select>
            </div>
            <div class="col">
              <el-input :disabled="true" v-model="item.itemName" placeholder="请输入商品名称" style="width: 100%" />
            </div>
            <div class="col">
              <el-input v-model="item.spec" placeholder="请输入规格型号" style="width: 100%" :disabled="true" />
            </div>
            <div class="col">
              <el-input v-model="item.unit" placeholder="请输入计量单位" style="width: 100%" :disabled="true" />
            </div>
            <div class="col">
              <el-input v-model="item.quantity" placeholder="请输入出库数量" style="width: 100%" :disabled="disabledFlag" />
            </div>
            <div class="col">
              <el-button type="danger" :icon="Delete" size="small" @click="deleteRow(index)">删除</el-button>
            </div>
          </div>
        </div>
        <div style="margin-top: 16px; text-align: left;">
          <el-button type="primary" link size="default" @click="addRow" v-if="!disabledFlag">
            <el-icon><Plus /></el-icon> 增加一行
          </el-button>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" v-if="!disabledFlag" @click="submitForm" :loading="loading">保存</el-button>
          <el-button size="small" @click="cancel">{{ disabledFlag ? '关闭' : '取消' }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { addBusOutbound, updateBusOutbound, getBusLocationList, getBusInventoryAllList, getBusOutboundDetailList } from '@/api/statistics/busInventory'
import { listBusWarehouseTreeFa } from '@/api/statistics/BusWarehouse'

// Props
const props = defineProps({
  dicts: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['refreshData'])

// 响应式数据
const loading = ref(false)
const showLoading = ref(false)
const showDialog = ref(false)
const title = ref('新增出库单')
const disabledFlag = ref(false)
const formRef = ref(null)

// 物料分类选项（从字典获取）
const materialTypeOptions = ref([])

// 表单数据
const formData = reactive({
  id: null,
  busOutboundMain: {
    outboundNo: '',
    inventoryType: ''
  },
  busOutboundDetailList: [
    {
      warehouseId: null,
      locationId: null,
      itemCode: '',
      itemName: '',
      spec: '',
      unit: '',
      quantity: '',
      type: 2,
      locationName: ''
    }
  ]
})

// 表单验证规则
const formRules = reactive({
  'busOutboundMain.outboundNo': [
    { required: true, message: '请输入出库单号', trigger: 'blur' }
  ],
  'busOutboundMain.inventoryType': [
    { required: true, message: '请选择物料分类', trigger: 'blur' }
  ]
})

// 仓库、库位、库存选项
const warehouseOptions = ref([])
const locationOptions = ref([])
const inventoryOptions = ref([])
const showLocation = ref(true)

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

// 获取物料分类标签
const getMaterialTypeLabel = (value) => {
  const item = materialTypeOptions.value.find(item => item.value === value)
  return item ? item.label : ''
}

// 获取仓库树形结构
const getWarehouseTree = async () => {
  try {
    const response = await listBusWarehouseTreeFa()
    if (response.code === 200) {
      warehouseOptions.value = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取仓库列表失败')
  }
}

// 根据仓库获取库位列表
const getLocationList = async (warehouseId) => {
  if (warehouseId) {
    try {
      const res = await getBusLocationList({ warehouseId })
      if (res.code === 200) {
        locationOptions.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    } catch (error) {
      ElMessage.error('获取库位列表失败')
    }
  } else {
    locationOptions.value = []
    ElMessage.warning('请选择仓库')
  }
}

// 打开对话框
const openDialog = (type, row = null) => {
  showDialog.value = true
  
  // 重置表单数据
  resetFormData()
  
  if (type === 'add') {
    title.value = '新增出库单'
    disabledFlag.value = false
  } else if (type === 'edit') {
    title.value = '修改出库单'
    disabledFlag.value = false
    if (row) {
      Object.assign(formData, { ...row })
    }
  } else if (type === 'view') {
    title.value = '查看出库单'
    disabledFlag.value = true
    if (row?.id) {
      showLoading.value = true
      getBusOutboundDetailList({ outboundId: row.id }).then(res => {
        if (res.code === 200) {
          if (res.rows.length) {
            formData.busOutboundMain = {
              outboundNo: res.rows[0].outboundNo,
              inventoryType: res.rows[0].inventoryType
            }
            formData.busOutboundDetailList = res.rows.map(val => ({
              warehouseId: val.warehouseId,
              locationId: val.locationId,
              itemCode: val.itemCode,
              itemName: val.itemName,
              spec: val.spec,
              unit: val.unit,
              quantity: val.quantity,
              type: 2,
              locationName: val.locationName
            }))
          }
        } else {
          ElMessage.error(res.msg)
        }
        showLoading.value = false
      }).catch(() => {
        showLoading.value = false
        ElMessage.error('获取详情失败')
      })
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
  formData.busOutboundMain = {
    outboundNo: '',
    inventoryType: ''
  }
  formData.busOutboundDetailList = [
    {
      warehouseId: null,
      locationId: null,
      itemCode: '',
      itemName: '',
      spec: '',
      unit: '',
      quantity: '',
      type: 2,
      locationName: ''
    }
  ]
}

// 取消/关闭
const cancel = () => {
  showDialog.value = false
  resetFormData()
  title.value = '新增出库单'
  loading.value = false
  
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  })
  
  // 通知父组件刷新数据
  emit('refreshData')
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      if (formData.id) {
        // 编辑
        updateBusOutbound(formData).then(res => {
          if (res.code === 200) {
            ElMessage.success('修改成功')
            cancel()
          } else {
            ElMessage.error(res.msg)
          }
        }).catch(() => {
          ElMessage.error('保存失败')
        })
      } else {
        loading.value = true
        // 新增
        addBusOutbound(formData).then(res => {
          if (res.code === 200) {
            ElMessage.success('添加成功')
            cancel()
            // 触发父组件刷新列表
            const parent = getCurrentInstance()?.parent
            if (parent?.exposed?.getList) {
              parent.exposed.getList()
            }
          } else {
            ElMessage.error(res.msg)
          }
          loading.value = false
        }).catch((error) => {
          console.error('保存失败:', error)
          loading.value = false
          ElMessage.error('保存失败')
        })
      }
    }
  })
}

// 增加行
const addRow = () => {
  formData.busOutboundDetailList.push({
    warehouseId: null,
    locationId: null,
    itemCode: '',
    itemName: '',
    spec: '',
    unit: '',
    quantity: '',
    type: 2,
    locationName: ''
  })
}

// 删除行
const deleteRow = (index) => {
  if (formData.busOutboundDetailList.length > 1) {
    formData.busOutboundDetailList.splice(index, 1)
  } else {
    ElMessage.warning('至少保留一行数据')
  }
}

// 仓库变化处理
const handleWarehouseChange = (val, index) => {
  if (val?.id) {
    showLocation.value = false
    formData.busOutboundDetailList[index].warehouseId = val.id
    getLocationList(val.id)
  } else {
    showLocation.value = true
    locationOptions.value = []
  }
}

// 库位变化处理
const handleLocationChange = (value, index) => {
  inventoryOptions.value = []
  getBusInventoryAllList({
    inventoryType: formData.busOutboundMain.inventoryType,
    warehouseId: formData.busOutboundDetailList[index].warehouseId,
    locationId: formData.busOutboundDetailList[index].locationId
  }).then((response) => {
    if (response.code === 200) {
      inventoryOptions.value = response.data
    } else {
      ElMessage.error(response.msg)
    }
  }).catch(() => {
    ElMessage.error('获取库存列表失败')
  })
}

// 物料编码变化处理
const itemCodeChange = (value, index) => {
  const item = inventoryOptions.value.find(val => val.itemCode === value)
  if (item) {
    formData.busOutboundDetailList[index].itemName = item.itemName
    formData.busOutboundDetailList[index].spec = item.specModel
    formData.busOutboundDetailList[index].unit = item.unit
  }
}

// 设置字典数据（由父组件传入）
const setDictData = (dicts) => {
  if (dicts?.material_type) {
    materialTypeOptions.value = dicts.material_type
  }
}

// 初始化
onMounted(() => {
  getWarehouseTree()
})

// 暴露方法给父组件
defineExpose({
  openDialog,
  setDictData
})
</script>

<style scoped lang="scss">
.tableBox {
  width: 100%;

  .tit {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #F5F5F5;
    display: flex;
    margin-bottom: 10px;

    >div {
      width: 16%;
      padding-left: 10px;
    }
  }

  .boxBody {
    width: 100%;

    .row {
      width: 100%;
      height: 51px;
      display: flex;
      border-bottom: 1px solid #E4E7ED;
      padding-left: 10px;
    }

    .col {
      width: 16%;
      height: 45px;
      display: flex;
      align-items: center;
      margin-right: 5px;
    }
  }
}
</style>

<style>
/* 直接覆盖treeselect组件的默认字体大小 */
.vue-treeselect {
  font-size: 12px !important;
}
.vue-treeselect__placeholder {
  font-size: 12px !important;
}
.vue-treeselect__value-container {
  font-size: 12px !important;
}
.vue-treeselect__menu {
  font-size: 12px !important;
}
.vue-treeselect__input {
  font-size: 12px !important;
}
.vue-treeselect__tag {
  font-size: 12px !important;
}
</style>