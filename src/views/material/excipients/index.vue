<template>
  <div class="container">
    <div class="wrap-content">
      <div class="header-tit">辅料</div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="辅料名称">
            <el-input v-model="searchForm.auxName" placeholder="请输入辅料名称" style="width: 100%" />
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input v-model="searchForm.specModel" placeholder="请输入规格型号" style="width: 100%" />
          </el-form-item>
        </el-form>
        <div class="search-btns">
          <el-button type="primary" :icon="Search" size="small" @click="getList">搜索</el-button>
          <el-button :icon="Refresh" size="small" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="box-line"></div>
      <!-- 操作按钮区域 -->
      <div class="operation-btns">
        <el-button type="primary" :icon="Plus" size="small" @click="handleDialog('add')">新增</el-button>
      </div>
      <!-- 表格 -->
      <div class="box-table">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
          <el-table-column type="index" align="center" label="序号" width="50" />
          <el-table-column prop="auxCode" label="辅料编码" align="center" width="100" />
          <el-table-column prop="auxName" label="辅料名称" align="center" width="100" />
          <el-table-column prop="specModel" label="规格型号 (mm)" align="center" width="120"
            :show-overflow-tooltip="true" />
          <el-table-column prop="unit" label="单位" align="center" />
          <el-table-column prop="isCoated" label="是否镀膜" align="center">
            <template #default="scope">
              <span :style="coatedStyle(scope.row.isCoated)">{{ scope.row.isCoated == 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productionLineName" label="使用产线" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="vendorName" label="厂商" align="center" />
          <el-table-column prop="stockQuantity" label="库存数量" align="center" />
          <el-table-column prop="safetyStock" label="最低库存" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" width="160" />
          <el-table-column prop="enableTime" label="启用时间" align="center" width="160" />
          <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" link @click="handleDialog('view', scope.row)">查看</el-button>
              <el-button size="small" type="primary" link @click="handleDialog('edit', scope.row)">修改</el-button>
              <el-button size="small" type="danger" link @click="handleDelete(scope.row)" class="button-del">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" v-model:page="searchForm.pageNum" v-model:limit="searchForm.pageSize"
          @pagination="getList" />
      </div>
    </div>
    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialog" @success="getList"></add-edit>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import addEdit from "./components/addEdit.vue"
import { auxiliaryList, delPost } from "@/api/material/auxiliary"
import Pagination from "@/components/Pagination"

// 响应式数据
const loading = ref(true)
const total = ref(0)
const tableData = ref([])
const rawDialog = ref(null)

// 搜索表单
const searchForm = reactive({
  auxName: "",
  specModel: "",
  pageSize: 10,
  pageNum: 1,
})

// 计量单位虚拟数据（如果需要可以在模板中使用）
const unitList = ref([
  { value: "件", label: "件" },
  { value: "套", label: "套" },
  { value: "个", label: "个" },
  { value: "台", label: "台" },
  { value: "千克", label: "千克" },
  { value: "吨", label: "吨" },
  { value: "米", label: "米" },
  { value: "平方米", label: "平方米" },
  { value: "立方米", label: "立方米" },
])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await auxiliaryList(searchForm)
    if (res.code === 200) {
      tableData.value = res.rows
      total.value = res.total
    }
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

// 重置搜索
const handleReset = () => {
  searchForm.auxName = ""
  searchForm.specModel = ""
  searchForm.pageNum = 1
  searchForm.pageSize = 10
  getList()
}

// 处理弹窗
const handleDialog = (type, row = null) => {
  if (rawDialog.value) {
    rawDialog.value.openDialog(type, row)
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该辅料吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const res = await delPost(row.id)
        if (res.code === 200) {
          ElMessage.success("删除成功")
          getList()
        }
      } catch (error) {
        ElMessage.error("删除失败")
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除")
    })
}

// 镀膜样式
const coatedStyle = (coated) => {
  if (coated == 1) {
    return { color: "#409EFF" }
  } else {
    return { color: "#F56C6C" }
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@import "@/styles/material.scss";
</style>