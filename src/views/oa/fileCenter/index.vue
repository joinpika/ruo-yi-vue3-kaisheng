<template>
  <div class="app-container">
    <el-row :gutter="20">
      <splitpanes :horizontal="store.getters.device === 'mobile'" class="default-theme">
        <pane size="16">
          <el-col>
            <div class="head-container">
              <el-input 
                v-model="threeData" 
                placeholder="请输入目录名称" 
                clearable 
                size="small" 
                :prefix-icon="Search" 
                style="margin-bottom: 20px" 
                @keyup.enter="getFileTree"
              />
            </div>
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
        <!-- 搜索区域 -->
        <pane size="84">
          <el-col>
            <el-form :inline="true" :model="searchForm" :label-width="labelWidth">
              <el-form-item label="文件名称：">
                <el-input v-model="searchForm.fileName" placeholder="请输入" class="form-input" @keyup.enter="getList" />
              </el-form-item>
              <el-form-item label="保密等级：">
                <el-select v-model="searchForm.fileLevel" filterable clearable placeholder="请选择" class="form-input" @keyup.enter="getList">
                  <el-option v-for="item in secretOptions" :key="item.levelId" :label="item.levelDegree" :value="item.levelId" />
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" :icon="Search" @click="getList">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
            <!-- 操作按钮区域 -->
            <div class="form-function">
              <el-button type="primary" class="form-btn" size="small" plain :icon="Plus" @click="handleAdd">新建</el-button>
              <el-button class="form-btn" type="primary" size="small" plain style="margin-right: 18px;" :icon="Download" @click="handleExport">下载</el-button>
            </div>
            <!-- 产品信息表格 -->
            <div class="form-table">
              <el-table 
                :data="tableData" 
                style="width: 100%" 
                :header-cell-style="{ backgroundColor: '#f5f7fa' }" 
                @selection-change="handleOwnedSelectionChange"
              >
                <el-table-column type="selection" align="center" label="" width="50" />
                <el-table-column type="index" align="center" label="序号" width="50" />
                <el-table-column prop="fileCode" label="文件编码" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="fileName" label="文件名称" align="center" min-width="130" :show-overflow-tooltip="true" />
                <el-table-column prop="fileTypeName" label="文件类别" align="center" />
                <el-table-column prop="fileLevelName" label="保密等级" align="center" />
                <el-table-column prop="startTime" label="创建时间" align="center" width="130" />
                <el-table-column prop="status" label="状态" align="center">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
                      {{ scope.row.status === 0 ? '正常' : '已下架' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="250" fixed="right" align="center">
                  <template #default="scope">
                    <el-button size="small" type="primary" link @click="handleView(scope.row)">查看</el-button>
                    <el-button size="small" type="primary" link @click="handleEdit(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" link @click="handleDelete(scope.row)">下架</el-button>
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
    
    <!-- 编辑/新增对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="900px" :before-close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules" style="padding:0 10px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="类别：" prop="fileTypeId">
              <el-select v-model="formData.fileTypeId" style="width: 100%" placeholder="请选择类别">
                <el-option v-for="item in categoryOptions" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="内容文档" prop="contentType">
              <el-radio v-model="formData.contentType" :label="0">文档</el-radio>
              <el-radio v-model="formData.contentType" :label="1">链接</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="保密等级" prop="fileLevel">
              <el-select v-model="formData.fileLevel" style="width: 100%" placeholder="请选择保密等级">
                <el-option v-for="item in secretOptions" :key="item.levelId" :label="item.levelDegree" :value="item.levelId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="文件名称：" prop="fileName" style="width: 100%;">
              <el-input v-model="formData.fileName" placeholder="请输入文件名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="文件编码：" prop="fileCode" style="width: 100%;">
              <el-input v-model="formData.fileCode" placeholder="请输入文件编码" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="创建时间：" prop="startTime">
              <el-date-picker v-model="formData.startTime" placeholder="请输入创建时间" style="width: 100%" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24">
            <el-form-item label="链接地址：" prop="linkAddress" style="width: 100%;">
              <el-input v-model="formData.linkAddress" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24">
            <el-form-item label="简介：" prop="fileIntro" style="width: 100%;">
              <el-input v-model="formData.fileIntro" type="textarea" :rows="2" placeholder="请输入简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24">
            <el-form-item label="附件" prop="attachmentUrl">
              <multiple-upload v-model="formData.attachmentUrl" @change="handleAttachChange" />
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

    <!-- 查看文件对话框 -->
    <el-dialog title="查看文件" v-model="viewDialogVisible" width="50%" :before-close="handleViewClose">
      <el-form label-width="100px" style="padding:0 10px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="类别：">
              <span>{{ viewFormData.fileTypeName || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="内容文档">
              <span>{{ viewFormData.contentType === 0 ? '文档' : '链接' }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="文件级别">
              <span>{{ viewFormData.fileLevelName || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="文件名称：">
              <span>{{ viewFormData.fileName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="文件编码：">
              <span>{{ viewFormData.fileCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="创建时间：">
              <span>{{ viewFormData.startTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24">
            <el-form-item label="链接地址：">
              <a v-if="viewFormData.linkAddress" :href="viewFormData.linkAddress" target="_blank">{{ viewFormData.linkAddress }}</a>
              <span v-else>无</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="简介：">
              <span>{{ viewFormData.fileIntro }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24">
            <el-form-item label="附件:">
              <div class="file-list">
                <div v-for="(file, index) in viewFormData.fileAttachmentList" :key="index" class="file-item">
                  <a :href="file.filePath" class="file-link" target="_blank" :download="file.filePath || 'file'">{{ file.fileName }}</a>
                  <el-button
                    type="primary"
                    link
                    :icon="View"
                    style="color:#ff6600;"
                    @click="handlePreview(file.filePath)"
                  />
                </div>
                <div v-if="!viewFormData.fileAttachmentList || viewFormData.fileAttachmentList.length === 0">无</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Download, View } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import moment from 'moment'
import MultipleUpload from '@/components/upload/multipleUpload.vue'
import { listCategory } from '@/file/category.js'
import { listBusFileLevel } from '@/file/BusFileLevel.js'
import { listBusFileCatalog } from '@/file/busFileCatalog.js'
import { listBusFile, addBusFile, updateBusFile, getBusFileDownload } from '@/file/busFile.js'
import { getProcesser } from '@/file/index.js'
import { getToken } from '@/utils/auth'
import { previewFileWithKKFileView } from '@/utils/filePreview.js'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

// Vuex store
const store = useStore()

// 响应式数据
const threeData = ref('')
const deptOptions = ref([])
const treeRef = ref(null)
const labelWidth = ref('120px')
const total = ref(0)
const tableData = ref([])
const secretOptions = ref([])
const categoryOptions = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增文件')
const viewDialogVisible = ref(false)
const viewFormData = reactive({})
const currentFile = ref(null)
const selectedOwnedRows = ref([])
const formRef = ref(null)

// 树形组件属性
const defaultProps = {
  children: 'children',
  label: 'catalogName'
}

// 搜索表单
const searchForm = reactive({
  fileName: '',
  fileLevel: '',
  fileCatalogId: '',
  status: 0,
  pageSize: 10,
  pageNum: 1
})

// 表单数据
const formData = reactive({
  fileCode: '',
  fileName: '',
  fileLevel: '',
  startTime: new Date(),
  fileIntro: '',
  attachmentUrl: [],
  fileTypeId: null,
  contentType: 0,
  linkAddress: ''
})

// 表单验证规则
const formRules = reactive({
  fileCode: [
    { required: true, message: '请输入文件编码', trigger: 'blur' }
  ],
  fileName: [
    { required: true, message: '请输入文件名称', trigger: 'blur' }
  ],
  fileLevel: [
    { required: true, message: '请选择文件级别', trigger: 'change' }
  ],
  fileTypeId: [
    { required: true, message: '请选择文件类别', trigger: 'change' }
  ],
  contentType: [
    { required: true, message: '请选择内容类型', trigger: 'change' }
  ],
  startTime: [
    { required: true, message: '请选择创建时间', trigger: 'change' }
  ],
  linkAddress: [
    { 
      validator: (rule, value, callback) => {
        if (formData.contentType == 1 && !value) {
          callback(new Error('请输入链接地址'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  attachmentUrl: [
    { 
      validator: (rule, value, callback) => {
        if (formData.contentType == 0 && (!value || value.length === 0)) {
          callback(new Error('请上传附件'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ]
})

// 文件上传头部
const headersObj = {
  Authorization: 'Bearer ' + getToken()
}

// 附件变更处理
const handleAttachChange = () => {
  nextTick(() => {
    if (formRef.value) {
      formRef.value.validateField('attachmentUrl')
    }
  })
}

// 表格选中变更
const handleOwnedSelectionChange = (selection) => {
  selectedOwnedRows.value = selection || []
}

// 文件预览
const handlePreview = (file) => {
  previewFileWithKKFileView(file)
}

// 获取文件类别
const getFileCategory = async () => {
  try {
    const res = await listCategory()
    if (res.code === 200) {
      categoryOptions.value = res.rows
    }
  } catch (error) {
    ElMessage.error('获取文件类别失败')
  }
}

// 获取保密程度
const getSecretLevel = async () => {
  try {
    const res = await listBusFileLevel()
    if (res.code === 200) {
      secretOptions.value = res.rows
    }
  } catch (error) {
    ElMessage.error('获取保密程度失败')
  }
}

// 查询三级目录结构
const getFileTree = async () => {
  try {
    const res = await listBusFileCatalog({ catalogName: threeData.value || '' })
    deptOptions.value = res.data
    if (res.data && res.data.length > 0) {
      searchForm.fileCatalogId = res.data[0].id
      getList()
    }
  } catch (error) {
    ElMessage.error('获取目录树失败')
  }
}

// 节点单击事件
const handleNodeClick = (data) => {
  searchForm.fileCatalogId = data.id
  getList()
}

// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

// 监听搜索条件变化
watch(threeData, (val) => {
  if (treeRef.value) {
    treeRef.value.filter(val)
  }
})

// 获取列表数据
const getList = async () => {
  try {
    const res = await listBusFile(searchForm)
    if (res.code === 200) {
      tableData.value = res.rows
      total.value = res.total
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  }
}

// 重置搜索条件
const handleReset = () => {
  searchForm.fileName = ''
  searchForm.fileLevel = ''
  searchForm.fileCatalogId = ''
  searchForm.pageSize = 10
  searchForm.pageNum = 1
  getList()
}

// 生成随机编码
const generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase()
}

// 新增文件
const handleAdd = () => {
  dialogTitle.value = '新增文件'
  Object.assign(formData, {
    fileCode: '',
    fileName: '',
    fileLevel: '',
    startTime: new Date(),
    fileIntro: '',
    attachmentUrl: [],
    fileTypeId: null,
    contentType: 0,
    linkAddress: ''
  })
  currentFile.value = null
  dialogVisible.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 编辑文件
const handleEdit = (row) => {
  dialogTitle.value = '编辑文件'
  Object.assign(formData, {
    ...row,
    attachmentUrl: row.fileAttachmentList?.map(file => file.filePath) || []
  })
  currentFile.value = row
  dialogVisible.value = true
}

// 查看文件
const handleView = (row) => {
  Object.assign(viewFormData, row)
  viewDialogVisible.value = true
}

// 删除文件（下架）
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要下架该文件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await getProcesser(row.fileId)
      if (res.code === 200) {
        ElMessage.success('已发起下架审核')
        getList()
      } else {
        ElMessage.error('发起下架审核失败')
      }
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }).catch(() => {
    ElMessage.info('已取消下架')
  })
}

// 导出文件
const handleExport = async () => {
  if (!selectedOwnedRows.value || selectedOwnedRows.value.length === 0) {
    ElMessage.warning('请先选择要下载的文件')
    return
  }
  try {
    const params = selectedOwnedRows.value.map(item => item.fileId)
    const res = await getBusFileDownload(params)
    downloadZipFile(res)
  } catch (e) {
    console.error(e)
    ElMessage.error('导出失败')
  }
}

// 下载ZIP文件
const downloadZipFile = (axiosRes) => {
  const blob = axiosRes.data || axiosRes
  const fileName = `文件中心_${new Date().getTime()}.zip`
  const zipBlob = new Blob([blob], { type: 'application/zip' })
  
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(zipBlob, fileName)
  } else {
    const url = window.URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
  ElMessage.success('导出成功')
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 关闭查看对话框
const handleViewClose = () => {
  viewDialogVisible.value = false
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = {
        busFile: {
          fileCode: formData.fileCode,
          fileName: formData.fileName,
          fileLevel: formData.fileLevel,
          startTime: moment(formData.startTime).format('YYYY-MM-DD HH:mm:ss'),
          fileIntro: formData.fileIntro,
          fileTypeId: formData.fileTypeId,
          contentType: formData.contentType,
          fileCatalogId: searchForm.fileCatalogId,
          linkAddress: formData.linkAddress
        },
        busFileAttachment: formData.attachmentUrl.map(file => ({
          fileName: file.name || '附件',
          filePath: file,
          fileSize: file.size || 0,
          attachmentType: 'other',
          effectiveDate: new Date(),
          expirationDate: new Date(Date.now() + 365 * 24 * 3600 * 1000)
        }))
      }
      
      try {
        if (currentFile.value) {
          params.busFile.fileId = currentFile.value.fileId
          await updateBusFile(params)
          ElMessage.success('编辑成功')
        } else {
          await addBusFile(params)
          ElMessage.success('新增成功')
        }
        getList()
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

// 初始化
onMounted(() => {
  getFileTree()
  getSecretLevel()
  getFileCategory()
})
</script>

<style scoped>
.file-link {
  color: #409eff;
  text-decoration: none;
}

.file-item {
  display: flex;
  gap: 5px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
</style>