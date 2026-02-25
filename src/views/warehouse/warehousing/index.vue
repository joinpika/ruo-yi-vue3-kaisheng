<template>
  <div class="container">
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-form :inline="true" :model="searchForm" size="small" ref="warehousingFormRef">
        <el-form-item label="物流分类" prop="inventoryType">
          <el-select v-model="searchForm.inventoryType" placeholder="请选择物料分类" style="width: 100%">
            <el-option label="成品" :value="0"></el-option>
            <el-option label="半成品" :value="1"></el-option>
            <el-option label="原料" :value="2"></el-option>
            <el-option label="辅料" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库日期" prop="inboundDate">
          <el-date-picker v-model="inboundDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
            start-placeholder="开始日期" end-placeholder="结束日期" class="form-input"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" size="small" @click="getList">搜索</el-button>
          <el-button icon="Refresh" size="small" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表相关 -->
    <div class="box-table">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus" size="small" @click="handleDialog('add')">新增入库单</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" size="small" @click="handleExport">导出</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-top: 16px;"
        :header-cell-style="{ backgroundColor: '#f5f7fa' }" height="550px">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" align="center" />
        <el-table-column label="入库单号" align="center" prop="inboundNo" :show-overflow-tooltip="true" />
        <el-table-column label="批次号" align="center" prop="batchNo" :show-overflow-tooltip="true" />
        <el-table-column label="入库日期" align="center" prop="inboundDate" :show-overflow-tooltip="true" />
        <el-table-column label="物料分类" align="center" prop="inventoryType" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="scope.row.inventoryType==0">成品</span>
            <span v-else-if="scope.row.inventoryType==1">半成品</span>
            <span v-else-if="scope.row.inventoryType==2">原料</span>
            <span v-else-if="scope.row.inventoryType==3">辅料</span>
          </template>
        </el-table-column>
        <el-table-column label="入库总数量" align="center" prop="totalQuantity" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" type="text" @click="handleDialog('view', scope.row)">查看</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)" class="button-del">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0" 
        :total="total" 
        v-model:page="searchForm.pageNum" 
        v-model:limit="searchForm.pageSize"
        @pagination="getList" />
    </div>

    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialogRef" @refresh="getList"></add-edit>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate">下载模板</el-link>
        </div>
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
  import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
  import { Search, Refresh, Plus, Download, UploadFilled } from '@element-plus/icons-vue'
  import addEdit from "./components/addEdit.vue"
  import { getToken } from "@/utils/auth"
  import { listBusInboundMain, getBusInboundMainExport, delBusInboundMain } from "@/api/statistics/BusInboundMain"

  const loading = ref(true)
  const inboundDate = ref([])
  const warehousingFormRef = ref()
  const uploadRef = ref()
  const rawDialogRef = ref()

  const searchForm = reactive({
    inventoryType: "",
    pageSize: 10,
    pageNum: 1,
  })

  const tableData = ref([
    {
      warehouseId: 1,
      locationId: 1,
      itemCode: "RKD20230601001",
      itemName: "不锈钢板入库单",
      quantity: 10,
      specification: "1000 * 1000 * 1000",
      unit: 1,
      id: 1,
      materialName: "RKD20230601001",
      locationName: "不锈钢板入库单",
      inventoryType: "不锈钢板",
      inboundDate: "PO20230601001",
      inboundNo: "待验收",
    },
  ])

  const total = ref(0)

  const upload = reactive({
    open: false,
    title: "",
    isUploading: false,
    updateSupport: 0,
    headers: { Authorization: "Bearer " + getToken() },
    url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData",
  })

  onMounted(() => {
    getList()
  })

  const handleReset = () => {
    inboundDate.value = []
    Object.assign(searchForm, {
      inventoryType: "",
      pageSize: 10,
      pageNum: 1,
    })
    getList()
  }

  const getList = () => {
    loading.value = true
    const params = {
      ...searchForm,
      beginInboundDate: inboundDate.value[0],
      endInboundDate: inboundDate.value[1]
    }
    listBusInboundMain(params).then((res) => {
      if(res.code === 200){
        tableData.value = res.rows
        total.value = res.total
        setTimeout(() => {
          loading.value = false
        }, 200)
      }
    })
  }

  const handleDialog = (type, row = null) => {
    if (rawDialogRef.value) {
      rawDialogRef.value.openDialog(type, row)
    }
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm("确定要删除该入库单吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      delBusInboundMain(row.id).then(res => {
        if (res.code === 200) {
          ElMessage.success("删除成功")
          getList()
        }
      })
    }).catch(() => {
      ElMessage.info("已取消删除")
    })
  }

  const handleImport = () => {
    upload.title = "入库导入"
    upload.open = true
  }

  const importTemplate = () => {
    download(
      "system/user/importTemplate",
      {},
      `user_template_${new Date().getTime()}.xlsx`
    )
  }

  const handleFileUploadProgress = (event, file, fileList) => {
    upload.isUploading = true
  }

  const handleFileSuccess = (response, file, fileList) => {
    upload.open = false
    upload.isUploading = false
    if (uploadRef.value) {
      uploadRef.value.clearFiles()
    }
    ElNotification({
      title: '导入结果',
      message: response.msg,
      type: 'success',
      duration: 5000
    })
    getList()
  }

  const submitFileForm = () => {
    if (uploadRef.value) {
      uploadRef.value.submit()
    }
  }

  const handleExport = async () => {
    const params = {
      ...searchForm,
      beginInboundDate: inboundDate.value[0],
      endInboundDate: inboundDate.value[1]
    }
    try {
      const res = await getBusInboundMainExport(params)
      downloadFile(res)
    } catch (e) {
      console.error(e)
      ElMessage.error('导出失败')
    }
  }

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
</script>

<style lang='scss' scoped>
@import "@/styles/warehouse.scss";
</style>