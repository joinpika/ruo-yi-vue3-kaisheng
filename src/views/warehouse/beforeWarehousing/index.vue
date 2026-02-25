<template>
  <div class="container">
    <!-- 列表相关 -->
    <div class="box-table" style="margin-top: -2px;">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" :icon="Plus" size="small" @click="handleDialog('add')">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" plain :icon="Upload" size="small" @click="handleImport">导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain :icon="Download" size="small" @click="handleExport">导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button :icon="Refresh" type="primary" plain size="small" @click="handleConvert">转为入库单</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button :icon="Printer" type="info" plain size="small" @click="handlePrint">打印</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button :icon="Printer" type="info" plain size="small" @click="handleBatchPrint">批量打印</el-button>
        </el-col>
      </el-row>
      
      <el-table 
        ref="mainTableRef" 
        :data="mainList" 
        style="width: 100%; margin-top: 16px;" 
        row-key="id" 
        @row-click="handleRowClick"
        v-loading="loading"
        :header-cell-style="{ backgroundColor: '#f5f7fa' }"
        height="550px"
      >
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.items" size="mini" style="margin-left: 50px; width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
              <el-table-column label="物料编码" prop="code" align="center"></el-table-column>
              <el-table-column label="物料名称" prop="name" align="center"></el-table-column>
              <el-table-column label="规格" prop="spec" align="center"></el-table-column>
              <el-table-column label="数量" prop="num" align="center"></el-table-column>
              <el-table-column label="单位" prop="unit" align="center"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="入库信息" min-width="300">
          <template #default="scope">
            <div style="display: flex; gap: 20px;">
              <span>{{ scope.row.orderNo }}</span>
              <span style="color: #E6A23C; font-weight: bold;">{{ scope.row.type }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="total > 0" 
        v-model:page="searchForm.pageNum" 
        v-model:limit="searchForm.pageSize"
        :total="total" 
        @pagination="getList" 
      />
    </div>

    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialogRef" @refresh="getList"></add-edit>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
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
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, Refresh, Printer } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import addEdit from './components/addEdit.vue'
import { listBusInboundMain, getBusInboundMainExport, delBusInboundMain } from '@/api/statistics/BusInboundMain'

// 响应式数据
const loading = ref(true)
const total = ref(0)
const mainList = ref([])
const inboundDate = ref([])
const rawDialogRef = ref(null)
const mainTableRef = ref(null)
const uploadRef = ref(null)

// 搜索表单
const searchForm = reactive({
  inventoryType: '',
  pageSize: 10,
  pageNum: 1
})

// 供应商选项（模拟数据）
const supplierOpt = ref([
  { label: '供应商1', value: 1 },
  { label: '供应商2', value: 2 },
  { label: '供应商3', value: 3 }
])

// 仓库选项（模拟数据）
const warehouseOpt = ref([
  { label: '仓库1', value: 1 },
  { label: '仓库2', value: 2 },
  { label: '仓库3', value: 3 }
])

// 导入参数
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  updateSupport: 0,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData'
})

// 行点击事件（展开/折叠）
const handleRowClick = (row) => {
  if (mainTableRef.value) {
    mainTableRef.value.toggleRowExpansion(row)
  }
}

// 转为入库单
const handleConvert = () => {
  ElMessageBox.confirm('是否确认把待入库单转为入库单，转入后不得恢复待入库单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.info('功能开发中')
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

// 打印
const handlePrint = () => {
  ElMessage.info('功能开发中')
}

// 批量打印
const handleBatchPrint = () => {
  ElMessage.info('功能开发中')
}

// 重置
const handleReset = () => {
  inboundDate.value = []
  searchForm.inventoryType = ''
  searchForm.pageSize = 10
  searchForm.pageNum = 1
  getList()
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      beginInboundDate: inboundDate.value?.[0] || '',
      endInboundDate: inboundDate.value?.[1] || ''
    }
    const res = await listBusInboundMain(params)
    if (res.code === 200) {
      // 模拟数据转换（实际开发中替换为真实数据）
      mainList.value = res.rows || []
      total.value = res.total || 0
      
      // 如果后端返回的是标准格式，可能需要转换为主列表格式
      // mainList.value = res.rows.map(item => ({
      //   id: item.id,
      //   orderNo: item.inboundNo,
      //   type: item.inventoryType === 0 ? '采购入库' : '其他入库',
      //   items: item.details || []
      // }))
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 200)
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
  ElMessageBox.confirm('确定要删除该入库单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await delBusInboundMain(row.id)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          getList()
        }
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 导入
const handleImport = () => {
  upload.title = '入库导入'
  upload.open = true
}

// 下载模板
const importTemplate = () => {
  download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`)
}

// 文件上传中处理
const handleFileUploadProgress = () => {
  upload.isUploading = true
}

// 文件上传成功处理
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

// 提交上传文件
const submitFileForm = () => {
  if (uploadRef.value) {
    uploadRef.value.submit()
  }
}

// 导出
const handleExport = async () => {
  try {
    const params = {
      ...searchForm,
      beginInboundDate: inboundDate.value?.[0] || '',
      endInboundDate: inboundDate.value?.[1] || ''
    }
    const res = await getBusInboundMainExport(params)
    downloadFile(res)
  } catch (e) {
    console.error(e)
    ElMessage.error('导出失败')
  }
}

// 下载文件
const downloadFile = (axiosRes) => {
  const blob = axiosRes.data || axiosRes
  const fileName = `入库明细_${new Date().getTime()}.xlsx`
  
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const url = window.URL.createObjectURL(blob)
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

// 通用下载方法（如果项目中已定义）
const download = (url, params, filename) => {
  // 这里需要根据实际项目的下载方法实现
  console.log('download', url, params, filename)
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@import '@/styles/warehouse.scss';
</style>