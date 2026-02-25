<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="form-head mb-10">
      <el-form :inline="true" :model="searchForm" :label-width="labelWidth">
        <el-form-item label="文件名称：">
          <el-input v-model="searchForm.fileTypeName" placeholder="请输入" class="form-input" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="保密程度：">
          <el-select v-model="searchForm.fileLevel" filterable clearable placeholder="请选择" class="form-input" @keyup.enter="getList">
            <el-option v-for="item in secretOptions" :key="item.levelId" :label="item.levelDegree" :value="item.levelId" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件原始层级：">
          <el-input v-model="searchForm.fileCatalogName" placeholder="请输入" class="form-input" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :icon="Search" @click="getList">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 产品信息表格 -->
    <div class="form-table">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
        <el-table-column type="selection" align="center" label="" width="50" />
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="fileCode" label="文件编码" align="center" min-width="130" :show-overflow-tooltip="true" />
        <el-table-column prop="fileName" label="文件名称" align="center" min-width="130" :show-overflow-tooltip="true" />
        <el-table-column prop="fileTypeName" label="文件类别" align="center" min-width="130" :show-overflow-tooltip="true" />
        <el-table-column prop="fileLevelName" label="保密程度" align="center" min-width="130" :show-overflow-tooltip="true" />
        <el-table-column prop="fileCatalogName" label="文件原始层级" align="center" min-width="130" :show-overflow-tooltip="true" />
        <el-table-column prop="startTime" label="开始时间" align="center" min-width="150"/>
        <el-table-column prop="endTime" label="结束时间" align="center" min-width="150"/>
        <el-table-column prop="expireDays" label="离过期还有/天" align="center" min-width="150"/>
        <el-table-column label="操作" width="250" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="primary" link @click="handleRecover(scope.row)">恢复</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right mt-10">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-model:page-size="searchForm.pageSize"
          v-model:current-page="searchForm.pageNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 查看文件对话框 -->
    <el-dialog title="查看文件" v-model="viewDialogVisible" width="50%" :before-close="handleViewClose">
      <el-form label-width="100px" style="padding:0 10px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <el-form-item label="类别：">
              <span>{{ getCategoryName(viewFormData.fileTypeId) }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="内容文档">
              <span>{{ viewFormData.contentType === 0 ? '文档' : '链接' }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="文件级别">
              <span>{{ getFileLevelName(viewFormData.fileLevel) }}</span>
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
          <el-col :xs="24" :sm="16">
            <el-form-item label="链接地址：">
              <a v-if="viewFormData.linkAddress" :href="viewFormData.linkAddress" target="_blank">{{ viewFormData.linkAddress }}</a>
              <span v-else>无</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="结束时间：">
              <span>{{ viewFormData.endTime }}</span>
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
                  <a :href="file.filePath" class="file-link" target="_blank">{{ file.filePath }}</a>
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
import { Search, Refresh, View } from '@element-plus/icons-vue'
import VueJsonExcel from 'vue-json-excel'
import { getToken } from '@/utils/auth'
import { listBusFileLevel } from '@/file/BusFileLevel.js'
import { listBusFile, recoverBusFile, delBusFile } from '@/file/busFile.js'
import { listCategory } from '@/file/category.js'
import { previewFileWithKKFileView } from '@/utils/filePreview.js'

// 响应式数据
const tableData = ref([])
const labelWidth = ref('120px')
const total = ref(0)
const secretOptions = ref([])
const categoryOptions = ref([])
const viewDialogVisible = ref(false)
const viewFormData = reactive({})
const showExcelExport = ref(false)
const exportData = ref([])
const excelExport = ref(null)

// 搜索表单
const searchForm = reactive({
  fileTypeName: '',
  fileLevel: '',
  fileCatalogName: '',
  status: 1,
  pageSize: 10,
  pageNum: 1
})

// 导出字段配置
const excelFields = {
  '材质': 'material',
  '规格': 'specification',
  '产品编码': 'productCode',
  '品种': 'productType',
  '米数': 'length',
  '件重(吨/件)': 'pieceWeight',
  '钢厂': 'steelMillName',
  '导入结果': 'importMsg'
}

// 文件上传头部
const headersObj = {
  Authorization: 'Bearer ' + getToken()
}

// 获取保密程度列表
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

// 获取文件类别列表
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

// 根据文件级别ID获取级别名称
const getFileLevelName = (levelId) => {
  if (!secretOptions.value || !Array.isArray(secretOptions.value)) {
    return ''
  }
  const level = secretOptions.value.find(item => item.levelId === levelId)
  return level ? level.levelDegree : ''
}

// 根据类别ID获取类别名称
const getCategoryName = (categoryId) => {
  if (!categoryOptions.value || !Array.isArray(categoryOptions.value)) {
    return ''
  }
  const category = categoryOptions.value.find(item => item.categoryId === categoryId)
  return category ? category.categoryName : ''
}

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

// 重置搜索
const handleReset = () => {
  searchForm.fileTypeName = ''
  searchForm.fileLevel = ''
  searchForm.fileCatalogName = ''
  searchForm.pageSize = 10
  searchForm.pageNum = 1
  getList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  searchForm.pageSize = val
  getList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  searchForm.pageNum = val
  getList()
}

// 查看文件
const handleView = (row) => {
  Object.assign(viewFormData, row)
  viewDialogVisible.value = true
}

// 关闭查看对话框
const handleViewClose = () => {
  viewDialogVisible.value = false
}

// 恢复文件
const handleRecover = (row) => {
  ElMessageBox.confirm('确定要恢复该文件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(async () => {
    try {
      const res = await recoverBusFile(row.fileId)
      if (res.code === 200) {
        ElMessage.success('恢复成功')
        getList()
      }
    } catch (error) {
      ElMessage.error('恢复失败')
    }
  }).catch(() => {
    ElMessage.info('已取消恢复')
  })
}

// 删除文件
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该文件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await delBusFile(row.fileId)
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

// 文件预览
const handlePreview = (file) => {
  previewFileWithKKFileView(file)
}

// 导出功能
const handleExport = () => {
  download('bus/product/export', {
    ...searchForm
  }, `产品_${new Date().getTime()}.xlsx`)
}

// 导入模板下载
const handleImportTemplate = () => {
  download('bus/product/importTemplate', {}, `产品导入模板_${new Date().getTime()}.xlsx`)
}

// 生成随机字符串（简化版）
const generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase()
}

// 初始化
onMounted(() => {
  getList()
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