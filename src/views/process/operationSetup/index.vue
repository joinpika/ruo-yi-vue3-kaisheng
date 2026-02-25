<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="form-head mb-10">
      <el-form :inline="true" :model="searchForm" label-width="120px">
        <el-form-item label="文件等级：">
          <el-input v-model="searchForm.levelDegree" placeholder="请输入" class="form-input" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="searchForm.status" filterable clearable placeholder="请选择" class="form-input" @keyup.enter="getList">
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
        <span class="text-header">文件等级</span>
        <el-button type="primary" class="form-btn form-right" size="small" plain :icon="Plus" @click="handleAdd">新建</el-button>
      </div>
      <div class="header-after">
        <i class="el-icon-warning-outline" style="color: #409EFF; margin: 0 8px;"></i>
        <span class="after-header">已选择<span style="color:#1890ff"> 4 </span>项目  服务调用总计：2</span>
        <el-button type="text" @click="handleClear">清空</el-button>
      </div>
    </div>

    <!-- 产品信息表格 -->
    <div class="form-table">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="levelCode" label="文件等级编码" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="levelDegree" label="文件等级" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="createByName" label="创建者" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="45%" :before-close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="150px" :rules="formRules" style="padding:0 20px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="文件等级编码：" prop="levelCode">
              <el-input v-model="formData.levelCode" disabled placeholder="请输入文件类别编码" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="文件等级：" prop="levelDegree">
              <el-input v-model="formData.levelDegree" placeholder="请输入文件类别名称" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="创建者：" prop="createBy">
              <el-select v-model="formData.createBy" style="width: 100%" placeholder="请选择创建者">
                <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker v-model="formData.createTime" placeholder="请输入创建时间" style="width: 100%" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="查看文件等级权限：" prop="viewRoleIds">
              <el-select v-model="formData.viewRoleIds" style="width: 100%" multiple placeholder="请选择权限">
                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="修改文件等级权限：" prop="modifyRoleIds">
              <el-select v-model="formData.modifyRoleIds" style="width: 100%" multiple placeholder="请选择权限">
                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态：" prop="status">
              <el-switch
                v-model="formData.status"
                :active-value="1"
                :inactive-value="2"
                active-text="正常"
                inactive-text="停用"
                :disabled="isReadOnly"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark" style="width: 100%;">
              <el-input v-model="formData.remark" type="textarea" :rows="4" placeholder="请输入备注" class="form-input-all" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
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
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { listBusFileLevel, addBusFileLevel, delBusFileLevel, updateBusFileLevel } from '@/file/BusFileLevel.js'
import { listFile, listRole } from '@/file/index.js'
import VueJsonExcel from 'vue-json-excel3'
import { getToken } from '@/utils/auth'
import pagination from '@/components/Pagination'
import moment from 'moment'

// 状态定义
const isReadOnly = ref(true)
const labelWidth = ref('120px')
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
const formRef = ref(null)
const excelExport = ref(null)

// 搜索表单
const searchForm = reactive({
  levelDegree: '',
  status: '',
  pageSize: 10,
  pageNum: 1
})

// 表单数据
const formData = reactive({
  levelCode: '',
  levelDegree: '',
  createBy: '',
  createTime: null,
  viewRoleIds: [],
  modifyRoleIds: [],
  status: 1,
  remark: ''
})

// 表单验证规则
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

// 导出配置
const headersObj = reactive({
  Authorization: 'Bearer ' + getToken()
})

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

// 方法定义
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
    console.error('获取创建人列表失败', error)
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
    console.error('获取角色列表失败', error)
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

// 生成随机字符串（辅助函数）
const generateRandomString3 = () => {
  return Math.random().toString(36).substring(2, 5).toUpperCase()
}

const generateRandomString5 = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase()
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
    console.error('获取钢厂列表失败', error)
  }
}

const handleImportTemplate = () => {
  download('bus/product/importTemplate', {}, `产品导入模板_${new Date().getTime()}.xlsx`)
}

// 重置搜索条件
const handleReset = () => {
  searchForm.levelDegree = ''
  searchForm.status = ''
  searchForm.pageNum = 1
  searchForm.pageSize = 10
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
  const formData = new FormData()
  formData.append('file', file.file)
  
  if (file.file) {
    console.log('formData', formData)
    try {
      const res = await importProduct(formData)
      await getList()

      // 导入成功后将返回的数据导出到Excel
      if (res.data && Array.isArray(res.data)) {
        ElMessage.error(res.msg || '导入数据失败')
        exportData.value = res.data
        showExcelExport.value = true
        await nextTick()
        // 触发导出按钮的点击事件
        if (excelExport.value) {
          excelExport.value.$el.click()
        }
        // 重置导出状态
        setTimeout(() => {
          showExcelExport.value = false
          exportData.value = []
        }, 1000)
      } else {
        ElMessage.success('导入数据成功！')
      }
    } catch (error) {
      console.error('导入失败', error)
      ElMessage.error('导入失败: ' + (error.message || '未知错误'))
    } finally {
      uploadLoading.value = false
    }
  } else {
    ElMessage.error('导入失败')
    uploadLoading.value = false
  }
}

const handleSizeChange = (val) => {
  searchForm.pageSize = val
  getList()
}

const handleCurrentChange = (val) => {
  searchForm.pageNum = val
  getList()
}

// 新增产品
const handleAdd = () => {
  dialogTitle.value = '手动新增单位'
  // 重置表单数据
  Object.assign(formData, {
    levelCode: 'WJWD' + generateRandomString3(),
    levelDegree: '',
    createBy: '',
    createTime: new Date(),
    viewRoleIds: [],
    modifyRoleIds: [],
    status: 1,
    remark: ''
  })
  isReadOnly.value = true
  currentProduct.value = null
  dialogVisible.value = true
  
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 编辑产品
const handleEdit = (row) => {
  console.log('row :>> ', row)
  dialogTitle.value = '手动编辑单位'
  isReadOnly.value = false
  
  Object.assign(formData, {
    ...row,
    createBy: Number(row.createBy)
  })
  
  currentProduct.value = row
  dialogVisible.value = true
}

// 删除产品
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
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
      console.error('删除失败', error)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 标记功能
const handleExport = () => {
  download('bus/product/export', {
    ...searchForm
  }, `产品_${new Date().getTime()}.xlsx`)
}

// 导入功能
const handleImport = () => {
  ElMessage.info('导入功能待实现')
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
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
            await getList()
          }
        } else {
          // 新增模式
          const res = await addBusFileLevel(params)
          if (res.code === 200) {
            ElMessage.success('新增成功')
            await getList()
          }
        }
        dialogVisible.value = false
      } catch (error) {
        console.error('提交失败', error)
        ElMessage.error('提交失败')
      }
    } else {
      console.log('表单验证失败', fields)
      return false
    }
  })
}

// 初始化
onMounted(() => {
  getList()
  getUserList()
  getRoleList()
})
</script>

<style scoped>
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
</style>