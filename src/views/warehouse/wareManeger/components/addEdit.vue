<template>
  <div>
    <el-dialog 
      :title="title" 
      v-model="showDialog" 
      width="800px" 
      @close="cancel" 
      class="dialog-material"
      v-loading="loading"
    >
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="上级仓库" prop="parentId">
              <treeselect
                v-model="formData.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级仓库"
                :disabled="disabledFlag"
                :searchable="true"
                :clearable="true"
                :default-expand-level="1"
                search-nested
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
              <el-input v-model="formData.warehouseName" placeholder="请输入仓库名称" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="负责人：" prop="manager">
              <el-input v-model="formData.manager" placeholder="请输入负责人" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式：" prop="contactPhone">
              <el-input v-model="formData.contactPhone" placeholder="请输入联系方式" :disabled="disabledFlag"/>
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
import { ElMessage } from 'element-plus'
import { Treeselect } from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { 
  addBusWarehouse, 
  updateBusWarehouse, 
  listBusWarehouseTreeFa 
} from '@/api/statistics/BusWarehouse'

// Emits
const emit = defineEmits(['refresh'])

// 响应式数据
const loading = ref(false)
const showDialog = ref(false)
const title = ref('新增仓库信息')
const disabledFlag = ref(false)
const deptOptions = ref([])
const formRef = ref(null)

// 查询参数
const queryParams = reactive({
  warehouseName: undefined,
  status: undefined
})

// 表单数据
const formData = reactive({
  id: null,
  parentId: null,
  warehouseName: '',
  manager: '',
  contactPhone: '',
  remark: ''
})

// 表单验证规则
const formRules = reactive({
  warehouseName: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' }
  ],
  manager: [
    { required: true, message: '请输入负责人', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ]
})

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

// 获取仓库树形结构
const getWarehouseTree = async () => {
  try {
    const response = await listBusWarehouseTreeFa()
    if (response.code === 200) {
      deptOptions.value = handleTree(response.data, 'id')
    }
  } catch (error) {
    ElMessage.error('获取仓库树失败')
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
    title.value = '新增仓库信息'
    disabledFlag.value = false
  } else if (type === 'edit') {
    title.value = '修改仓库信息'
    disabledFlag.value = false
    if (row) {
      Object.assign(formData, { ...row })
    }
  } else if (type === 'view') {
    title.value = '查看仓库'
    disabledFlag.value = true
    if (row) {
      Object.assign(formData, { ...row })
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
  formData.parentId = null
  formData.warehouseName = ''
  formData.manager = ''
  formData.contactPhone = ''
  formData.remark = ''
}

// 取消/关闭
const cancel = () => {
  showDialog.value = false
  resetFormData()
  title.value = '新增仓库信息'
  loading.value = false
  
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    // 通知父组件刷新列表
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
          const res = await updateBusWarehouse(formData)
          if (res.code === 200) {
            ElMessage.success('修改成功')
            cancel()
          } else {
            ElMessage.error(res.msg || '修改失败')
          }
        } else {
          // 新增
          const res = await addBusWarehouse(formData)
          if (res.code === 200) {
            ElMessage.success('添加仓库信息成功')
            cancel()
          } else {
            ElMessage.error(res.msg || '添加失败')
          }
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

// 树形数据处理函数
const handleTree = (data, idField = 'id', parentIdField = 'parentId', childrenField = 'children') => {
  const tree = []
  const map = {}
  
  if (!data || !Array.isArray(data)) return []
  
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

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style scoped>
:deep(.vue-treeselect__control) {
  height: 32px;
}

:deep(.vue-treeselect__placeholder) {
  line-height: 32px;
}
</style>