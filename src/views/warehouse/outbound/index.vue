<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-form :inline="true" :model="searchForm" size="small" ref="outBoundFormRef">
        <el-form-item label="出库日期" prop="dateRange">
          <el-date-picker 
            v-model="dateRange" 
            value-format="YYYY-MM-DD" 
            type="daterange" 
            range-separator="-"
            start-placeholder="开始日期" 
            end-placeholder="结束日期" 
            class="form-input"
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
        <el-form-item>
          <el-button type="primary" :icon="Search" size="small" @click="getList">搜索</el-button>
          <el-button :icon="Refresh" size="small" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 列表相关 -->
    <div class="box-table">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" :icon="Plus" size="small" @click="handleDialog('add')">新增出库单</el-button>
        </el-col>
      </el-row>
      
      <el-table 
        :data="tableData" 
        style="width: 100%; margin-top: 16px;"
        height="550px"
        v-loading="loading"
        :header-cell-style="{ backgroundColor: '#f5f7fa' }"
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="出库单号" align="center" prop="outboundNo" />
        <el-table-column label="出库日期" align="center" prop="outboundDate" />
        <el-table-column label="出库总数量" align="center" prop="totalQuantity" />
        <el-table-column label="物料分类" align="center" prop="inventoryType">
          <template #default="scope">
            {{ getMaterialTypeLabel(scope.row.inventoryType) }}
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
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

    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialogRef" @refreshData="getList" />

    <!-- 导入对话框（暂时注释，保留以备后用） -->
    <!-- <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload 
        ref="uploadRef" 
        :limit="1" 
        accept=".xlsx, .xls" 
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" 
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" 
        :on-success="handleFileSuccess" 
        :auto-upload="false" 
        drag
      >
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">
              下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm" size="small">确 定</el-button>
          <el-button @click="upload.open = false" size="small">取 消</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Upload } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import addEdit from './components/addEdit.vue'
import { getBusOutboundList, delBusOutbound } from '@/api/statistics/busInventory.js'

// 字典数据（由父组件传入或从store获取）
const materialTypeOptions = ref([])

// 响应式数据
const loading = ref(false)
const dateRange = ref([])
const tableData = ref([])
const total = ref(0)
const outBoundFormRef = ref(null)
const rawDialogRef = ref(null)
const uploadRef = ref(null)

// 搜索表单
const searchForm = reactive({
  beginInboundDate: '',
  endInboundDate: '',
  inventoryType: '',
  pageSize: 10,
  pageNum: 1
})

// 导入参数（暂时保留以备后用）
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  updateSupport: 0,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData'
})

// 获取物料分类标签
const getMaterialTypeLabel = (value) => {
  const item = materialTypeOptions.value.find(item => item.value === value)
  return item ? item.label : value
}

// 重置搜索
const handleReset = () => {
  dateRange.value = []
  searchForm.beginInboundDate = ''
  searchForm.endInboundDate = ''
  searchForm.inventoryType = ''
  searchForm.pageNum = 1
  
  // 重置表单
  if (outBoundFormRef.value) {
    outBoundFormRef.value.resetFields()
  }
  
  getList()
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  
  // 设置日期范围
  if (dateRange.value && dateRange.value.length === 2) {
    searchForm.beginInboundDate = dateRange.value[0]
    searchForm.endInboundDate = dateRange.value[1]
  } else {
    searchForm.beginInboundDate = ''
    searchForm.endInboundDate = ''
  }
  
  try {
    const res = await getBusOutboundList(searchForm)
    if (res.code === 200) {
      tableData.value = res.rows || []
      total.value = res.total || 0
    } else {
      tableData.value = []
      total.value = 0
      ElMessage.error(res.msg || '获取列表失败')
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// 打开弹窗
const handleDialog = (type, row = null) => {
  if (rawDialogRef.value) {
    rawDialogRef.value.openDialog(type, row)
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该出库单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await delBusOutbound(row.id)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          getList()
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 导入功能（暂时保留以备后用）
const handleImport = () => {
  upload.title = '出库导入'
  upload.open = true
}

// 下载模板（暂时保留以备后用）
const importTemplate = () => {
  download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`)
}

// 文件上传中处理（暂时保留以备后用）
const handleFileUploadProgress = () => {
  upload.isUploading = true
}

// 文件上传成功处理（暂时保留以备后用）
const handleFileSuccess = (response) => {
  upload.open = false
  upload.isUploading = false
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  ElMessageBox.alert(
    `<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>${response.msg}</div>`,
    '导入结果',
    { dangerouslyUseHTMLString: true }
  )
  getList()
}

// 提交上传文件（暂时保留以备后用）
const submitFileForm = () => {
  if (uploadRef.value) {
    uploadRef.value.submit()
  }
}

// 导出功能（暂时保留以备后用）
const handleExport = () => {
  download('system/user/export', { ...searchForm }, `user_${new Date().getTime()}.xlsx`)
}

// 通用下载方法
const download = (url, params, filename) => {
  // 这里需要根据实际项目的下载方法实现
  console.log('download', url, params, filename)
  ElMessage.info('导出功能开发中')
}

// 设置字典数据（由父组件调用）
const setDictData = (dicts) => {
  if (dicts?.material_type) {
    materialTypeOptions.value = dicts.material_type
  }
}

// 初始化
onMounted(() => {
  getList()
})

// 暴露方法给父组件
defineExpose({
  setDictData
})
</script>

<style lang="scss" scoped>
@import "@/styles/warehouse.scss";
</style>