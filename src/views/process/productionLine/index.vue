<template>
  <div class="container">
    <!-- 用于Excel导出的组件，默认隐藏 -->
    <!-- 搜索区域 -->
    <div class="form-head mb-10">
      <el-form :inline="true" :model="searchForm" :label-width="labelWidth">
        <el-form-item label="文件等级：">
          <el-input 
            v-model="searchForm.levelDegree" 
            placeholder="请输入" 
            class="form-input" 
            @keyup.enter="getList" 
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select 
            v-model="searchForm.status" 
            filterable 
            clearable 
            placeholder="请选择" 
            class="form-input" 
            @keyup.enter="getList"
          >
            <el-option label="正常" value="1" />
            <el-option label="停用" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :icon="Search" @click="getList">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="form-function">
      <div class="header">
        <span class="text-header">产线列表</span>
        <el-button type="primary" class="form-btn form-right" plain :icon="Plus" @click="handleAdd">新建</el-button>
      </div>
      <div class="header-after">
        <el-icon style="color: #409EFF; margin: 0 8px;"><Warning /></el-icon>
        <span class="after-header">已选择<span style="color:#1890ff"> 4 </span>项目  服务调用总计：2</span>
        <el-button link type="primary" @click="handleClear">清空</el-button>
      </div>
    </div>

    <!-- 产品信息表格 -->
    <div class="form-table">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
        <el-table-column type="index" align="center" label="产品编号" width="50" />
        <el-table-column prop="levelCode" label="产线名称" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="levelDegree" label="产线类型" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="maxProductionCapacity" label="最大生产能力（片/天）" align="center" />
        <el-table-column prop="maxProductionSpecification" label="最大生产规格" align="center" />
        <el-table-column prop="minProductionSpecification" label="最小生产规格" align="center" />
        <el-table-column prop="createByName" label="异形订单" align="center" />
        <el-table-column prop="createByName" label="打孔订单" align="center" />
        <el-table-column prop="createByName" label="精磨边" align="center" />
        <el-table-column prop="createByName" label="弯钢化" align="center" />
        <el-table-column prop="createByName" label="除膜" align="center" />
        <el-table-column prop="createByName" label="印刷" align="center" />
        <el-table-column prop="createByName" label="压制成型" align="center" />
        <el-table-column prop="createByName" label="热弯成型" align="center" />
        <el-table-column prop="createByName" label="合片" align="center" />
        <el-table-column prop="createByName" label="初压线" align="center" />
        <el-table-column prop="createByName" label="底座粘连" align="center" />
        <el-table-column prop="createByName" label="滚压线" align="center" />
        <el-table-column prop="createByName" label="高压釜" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="55%" :before-close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="150px" :rules="formRules" style="padding:0 20px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="产线名称：" prop="levelCode">
              <el-input v-model="formData.levelCode" placeholder="请输入产线名称" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="产线类型：" prop="levelDegree">
              <el-input v-model="formData.levelDegree" placeholder="请输入产线类型" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="最大生产能力/天：" prop="maxProductionCapacity">
              <el-input v-model="formData.maxProductionCapacity" placeholder="请输入最大生产能力" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :xs="24" :sm="4">
            <span class="spec-label">最大生产规格</span>
          </el-col>
          <el-col :xs="24" :sm="4">
            <el-form-item class="no-margin" label="长：" label-width="50px" prop="maxLength">
              <el-input v-model="formData.maxLength" type="number" placeholder="长" min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="4">
            <el-form-item class="no-margin" label="宽：" label-width="50px" prop="maxWidth">
              <el-input v-model="formData.maxWidth" type="number" placeholder="宽" min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="4">
            <span class="spec-label" style="margin-left: 24px;">最小生产规格</span>
          </el-col>
          <el-col :xs="24" :sm="4">
            <el-form-item class="no-margin" label="长：" label-width="50px" prop="minLength">
              <el-input v-model="formData.minLength" type="number" placeholder="长" min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="4">
            <el-form-item class="no-margin" label="宽：" label-width="50px" prop="minWidth">
              <el-input v-model="formData.minWidth" type="number" placeholder="宽" min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 重复的规格行，建议删除或合并 -->
        <el-row :gutter="10" type="flex" align="bottom">
          <span class="spec-label">最大生产规格</span>
          <el-form-item class="no-margin" label="长：" prop="maxLength">
            <el-input v-model="formData.maxLength" type="number" label-width="50px" placeholder="长" min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item class="no-margin" label="宽：" prop="maxWidth">
            <el-input v-model="formData.maxWidth" type="number" label-width="50px" placeholder="宽" min="0" style="width: 100%" />
          </el-form-item>
          <span class="spec-label" style="margin-left: 24px;">最小生产规格</span>
          <el-form-item class="no-margin" label="长：" prop="minLength">
            <el-input v-model="formData.minLength" type="number" label-width="50px" placeholder="长" min="0" style="width: 100%" />
          </el-form-item>
          <el-form-item class="no-margin" label="宽：" prop="minWidth">
            <el-input v-model="formData.minWidth" type="number" label-width="50px" placeholder="宽" min="0" style="width: 100%" />
          </el-form-item>
        </el-row>

        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="异形订单：" prop="isSpecialShape">
              <el-radio-group v-model="formData.isSpecialShape">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="打孔订单：" prop="isDrilling">
              <el-radio-group v-model="formData.isDrilling">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="精磨边：" prop="isPolishing">
              <el-radio-group v-model="formData.isPolishing">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="弯钢化：" prop="isBending">
              <el-radio-group v-model="formData.isBending">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="除膜：" prop="isFilmRemoval">
              <el-radio-group v-model="formData.isFilmRemoval">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="印刷：" prop="isPrinting">
              <el-radio-group v-model="formData.isPrinting">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="压制成型：" prop="isPressing">
              <el-radio-group v-model="formData.isPressing">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="热弯成型：" prop="isHotBending">
              <el-radio-group v-model="formData.isHotBending">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="合片：" prop="isLaminating">
              <el-radio-group v-model="formData.isLaminating">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="初压线：" prop="isPrePressing">
              <el-radio-group v-model="formData.isPrePressing">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="底座粘连：" prop="isBaseAdhesion">
              <el-radio-group v-model="formData.isBaseAdhesion">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="滚压线：" prop="isRolling">
              <el-radio-group v-model="formData.isRolling">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="高压釜：" prop="isAutoclave">
              <el-radio-group v-model="formData.isAutoclave">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">启动</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用于Excel导出的组件，默认隐藏 -->
    <vue-json-excel
      v-if="showExcelExport"
      ref="excelExport"
      :data="exportData"
      :fields="excelFields"
      :name="'导入结果_' + new Date().getTime()+'.xlsx'"
      worksheet="导入结果"
      class="hidden"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Warning } from '@element-plus/icons-vue'
import { listBusFileLevel, addBusFileLevel, delBusFileLevel, updateBusFileLevel } from '@/file/BusFileLevel.js'
import { listFile, listRole } from '@/file/index.js'
import { listProduct, addProduct, updateProduct, delProduct, importProduct } from '@/api/bus/product.js'
import { listSteelMill } from '@/api/bus/steelMill.js'
import VueJsonExcel from 'vue-json-excel'
import { getToken } from '@/utils/auth'
import { download } from '@/utils/request'
import Pagination from '@/components/Pagination'
import moment from 'moment'

// 组件注册
defineOptions({
  name: 'ProductLine'
})

// 常量
const labelWidth = '120px'

// 响应式数据
const isReadOnly = ref(true)
const searchForm = reactive({
  levelDegree: '',
  status: '',
  pageSize: 10,
  pageNum: 1
})
const total = ref(0)
const tableData = ref([])
const steelMillOptions = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('手动新增单位')
const currentProduct = ref(null)
const uploadLoading = ref(false)
const userList = ref([])
const roleList = ref([])
const fileList = ref([])
const showExcelExport = ref(false)
const exportData = ref([])
const currentTime = ref(moment().format('YYYYMMDDHHmmss'))

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({
  categoryCode: '',
  categoryName: '',
  createBy: '',
  createTime: null,
  viewRoleIds: [],
  modifyRoleIds: [],
  status: 1,
  remark: '',
  // 新增字段
  levelCode: '',
  levelDegree: '',
  maxProductionCapacity: '',
  maxLength: '',
  maxWidth: '',
  minLength: '',
  minWidth: '',
  isSpecialShape: 0,
  isDrilling: 0,
  isPolishing: 0,
  isBending: 0,
  isFilmRemoval: 0,
  isPrinting: 0,
  isPressing: 0,
  isHotBending: 0,
  isLaminating: 0,
  isPrePressing: 0,
  isBaseAdhesion: 0,
  isRolling: 0,
  isAutoclave: 0
})

// 表单校验规则
const formRules = reactive({
  levelDegree: [
    { required: true, message: '请输入文件等级程度', trigger: 'blur' }
  ],
  createBy: [
    { required: true, message: '请选择创建者', trigger: 'blur' }
  ],
  createTime: [
    { required: true, message: '请输入创建时间', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ],
  viewRoleIds: [
    { required: true, message: '请选择查看文件等级权限', trigger: 'blur' }
  ],
  modifyRoleIds: [
    { required: true, message: '请选择修改文件等级权限', trigger: 'blur' }
  ],
  remark: [
    { required: true, message: '请输入备注', trigger: 'blur' }
  ]
})

// Excel 导出字段配置
const excelFields = reactive({
  '材质': 'material',
  '规格': 'specification',
  '产品编码': 'productCode',
  '品种': 'productType',
  '米数': 'length',
  '件重(吨/件)': 'pieceWeight',
  '钢厂': 'steelMillName',
  '导入结果': 'importMsg'
})

// Headers 配置
const headersObj = reactive({
  Authorization: 'Bearer ' + getToken()
})

// 方法
const handleClear = () => {
  console.log('清空')
}

// 获取创建人
const getUserList = async () => {
  try {
    const res = await listFile()
    if (res.code === 200) {
      console.log('res :>> ', res)
      userList.value = res.rows
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
  }
}

// 获取权限
const getRoleList = async () => {
  try {
    const res = await listRole()
    if (res.code === 200) {
      console.log('res创建人 :>> ', res)
      roleList.value = res.data
    }
  } catch (error) {
    console.error('获取权限列表失败', error)
  }
}

// 搜索功能
const getList = async () => {
  try {
    const res = await listBusFileLevel(searchForm)
    if (res.code === 200) {
      console.log('res.rows :>> ', res.rows)
      tableData.value = res.rows
      total.value = res.total
    }
  } catch (error) {
    console.error('获取列表失败', error)
  }
}

// 获取新增流水号
const getSerialNo = () => {
  formData.productCode = 'YHLB' + generateRandomString5()
}

// 生成随机字符串（5位）
const generateRandomString5 = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase()
}

// 生成随机字符串（3位）
const generateRandomString3 = () => {
  return Math.random().toString(36).substring(2, 5).toUpperCase()
}

// 下拉单选数据转换
const getSteelMillLabel = (value) => {
  const item = steelMillOptions.value.find(o => o.id === value)
  return item ? item.supplierName : ''
}

// 查询钢厂全部信息
const getSteel = async () => {
  try {
    const res = await listSteelMill()
    if (res.code === 200) {
      console.log('钢厂数据 :>> ', res.rows)
      steelMillOptions.value = res.rows
    }
  } catch (error) {
    console.error('获取钢厂数据失败', error)
  }
}

const handleImportTemplate = () => {
  download('bus/product/importTemplate', {}, `产品导入模板_${new Date().getTime()}.xlsx`)
}

// 重置搜索条件
const handleReset = () => {
  Object.assign(searchForm, {
    levelDegree: '',
    status: '',
    pageSize: 10,
    pageNum: 1
  })
  getList()
}

const beforeUpload = (file) => {
  uploadLoading.value = true

  if (file.size >= 10971520) {
    ElMessage.warning('文件大小不超过10M')
    uploadLoading.value = false
    return false
  }
  
  const typeList = ['xls', 'xlsx']
  if (!typeList.includes(file.name.split('.').pop())) {
    ElMessage.warning('请检查上传的文件格式')
    uploadLoading.value = false
    return false
  }
  
  return true
}

const upLoadExcel = async (file) => {
  console.log('upLoadExcel 方法被调用', file)
  const formDataUpload = new FormData()
  formDataUpload.append('file', file.file)
  
  if (file.file) {
    console.log('formData', formDataUpload)
    
    const uploadPromise = importProduct(formDataUpload)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('请求超时')), 180000)
    )
    
    try {
      const res = await Promise.race([uploadPromise, timeoutPromise])
      
      if (res !== undefined) {
        getList()

        // 导入成功后将返回的数据导出到Excel
        if (res.data && Array.isArray(res.data)) {
          ElMessage.error(res.msg || '导入数据失败')
          exportData.value = res.data
          showExcelExport.value = true
          
          nextTick(() => {
            // 触发导出按钮的点击事件
            if (excelExport.value) {
              excelExport.value.$el.click()
            }
            // 重置导出状态
            setTimeout(() => {
              showExcelExport.value = false
              exportData.value = []
            }, 1000)
          })
        } else {
          ElMessage.success('导入数据成功！')
        }
        
        uploadLoading.value = false
      }
    } catch (error) {
      uploadLoading.value = false
      if (error.message === '请求超时') {
        ElMessage.error('导入数据超时，请稍后重试。')
      } else {
        ElMessage.error('导入失败')
      }
    }
  } else {
    ElMessage.error('导入失败')
  }
}

// 新增产品
const handleAdd = () => {
  dialogTitle.value = '手动新增单位'
  getSerialNo()
  
  nextTick(() => {
    formRef.value?.clearValidate()
  })
  
  isReadOnly.value = true
  
  Object.assign(formData, {
    levelCode: 'WJWD' + generateRandomString3(),
    levelDegree: '',
    createBy: '',
    createTime: new Date(),
    status: 1,
    remark: '',
    maxProductionCapacity: '',
    maxLength: '',
    maxWidth: '',
    minLength: '',
    minWidth: '',
    isSpecialShape: 0,
    isDrilling: 0,
    isPolishing: 0,
    isBending: 0,
    isFilmRemoval: 0,
    isPrinting: 0,
    isPressing: 0,
    isHotBending: 0,
    isLaminating: 0,
    isPrePressing: 0,
    isBaseAdhesion: 0,
    isRolling: 0,
    isAutoclave: 0
  })
  
  currentProduct.value = null
  dialogVisible.value = true
}

// 编辑产品
const handleEdit = (row) => {
  console.log('row :>> ', row)
  dialogTitle.value = '手动编辑单位'
  isReadOnly.value = false
  
  Object.assign(formData, {
    ...row,
    createBy: Number(row.createBy),
  })
  
  currentProduct.value = row
  dialogVisible.value = true
}

// 删除产品
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除该产品吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await delBusFileLevel(row.levelId)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 导出功能
const handleExport = () => {
  download('bus/product/export', { ...searchForm }, `产品_${new Date().getTime()}.xlsx`)
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  const valid = await formRef.value.validate().catch(() => false)
  
  if (valid) {
    const params = {
      levelCode: formData.levelCode,
      levelDegree: formData.levelDegree,
      createBy: formData.createBy,
      createTime: moment(formData.createTime).format('YYYY-MM-DD HH:mm:ss'),
      status: formData.status,
      remark: formData.remark,
      viewRoleIds: formData.viewRoleIds,
      modifyRoleIds: formData.modifyRoleIds
    }
    
    try {
      if (currentProduct.value) {
        params.levelId = currentProduct.value.levelId
        // 编辑模式
        const res = await updateBusFileLevel(params)
        if (res.code === 200) {
          ElMessage.success('编辑成功')
          getList()
        }
      } else {
        // 新增模式
        const res = await addBusFileLevel(params)
        if (res.code === 200) {
          ElMessage.success('新增成功')
          getList()
        }
      }
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error('操作失败')
    }
  } else {
    console.log('表单验证失败')
  }
}

// Excel 导出组件引用
const excelExport = ref(null)

// 初始化
onMounted(() => {
  getList()
  getUserList()
  getRoleList()
})
</script>

<style scoped>
/* 去掉表单项默认下边距，让文字和输入框真正在同一行 */
.no-margin {
  margin-bottom: 0;
}

/* 让文字垂直居中，和输入框对齐 */
.spec-label {
  line-height: 40px;
  margin-right: 8px;
  white-space: nowrap;
}

.form-input-all {
  width: 100%;
}

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

.hidden {
  display: none;
}
</style>