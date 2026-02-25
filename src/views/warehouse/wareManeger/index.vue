<template>
  <div class="container">
    <div class="wrap-content">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="仓库名称">
            <el-select v-model="searchForm.warehouseName" placeholder="请选择仓库名称" filterable clearable>
              <el-option v-for="item in warehouseOptions" :key="item.id" :label="item.warehouseName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search-btns">
          <el-button type="primary" icon="Search" size="small" @click="getList">搜索</el-button>
          <el-button icon="Refresh" size="small" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="box-line"></div>
      <!-- 操作按钮区域 -->
      <div class="operation-btns">
        <el-button type="primary" icon="Plus" size="small" @click="handleDialog('add')">新增</el-button>
      </div>

      <!-- 列表相关 -->
      <el-row :gutter="20">
        <el-col>
          <div>
            <el-table v-loading="loading" :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }" height="550px">
              <el-table-column type="index" align="center" label="序号" width="50" />
              <el-table-column prop="warehouseName" label="仓库名称" align="center" :show-overflow-tooltip="true" />
              <el-table-column prop="parentName" label="上级仓库" align="center" />
              <el-table-column prop="manager" label="负责人" align="center" />
              <el-table-column prop="contactPhone" label="联系方式" align="center" width="150" />
              <el-table-column prop="remark" label="备注" align="center" width="90" />
              <el-table-column prop="createBy" label="创建者" align="center" />
              <el-table-column prop="createTime" label="创建时间" align="center" width="160" />
              <el-table-column label="操作" width="180" fixed="right" align="center">
                <template #default="scope">
                  <el-button size="small" type="text" @click="handleDialog('view', scope.row)">查看</el-button>
                  <el-button size="small" type="text" @click="handleDialog('edit', scope.row)">修改</el-button>
                  <el-button size="small" type="text" @click="handleDelete(scope.row)" class="button-del">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination :total="total" v-model:page="searchForm.pageNum" v-model:limit="searchForm.pageSize" @pagination="getList" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialogRef" />
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, Refresh, Plus } from '@element-plus/icons-vue'
  import addEdit from "./components/addEdit.vue"
  import { listBusWarehouse, delBusWarehouse, listWarehouseList } from "@/api/statistics/BusWarehouse"

  const loading = ref(true)
  const warehouseOptions = ref([])
  const tableData = ref([])
  const total = ref(0)
  const rawDialogRef = ref()

  const searchForm = reactive({
    warehouseName: "",
    pageSize: 10,
    pageNum: 1,
  })

  onMounted(() => {
    getList()
    getWarehouseList()
  })

  const getWarehouseList = () => {
    listWarehouseList().then(res => {
      if(res.code === 200){
        warehouseOptions.value = res.data
      }
    })
  }

  const getList = () => {
    loading.value = true
    const param = {
      id: searchForm.warehouseName,
      pageSize: searchForm.pageSize,
      pageNum: searchForm.pageNum,
    }
    listBusWarehouse(param).then((res) => {
      if (res.code === 200) {
        tableData.value = res.rows
        total.value = res.total
        setTimeout(() => {
          loading.value = false
        }, 200)
      }
    })
  }

  const handleReset = () => {
    Object.assign(searchForm, {
      warehouseName: "",
      pageSize: 10,
      pageNum: 1,
    })
    getList()
  }

  const handleDialog = (type, row = null) => {
    if (rawDialogRef.value) {
      rawDialogRef.value.openDialog(type, row)
    }
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm("确定要删除该仓库吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      delBusWarehouse(row.id).then((res) => {
        if (res.code === 200) {
          ElMessage.success("删除成功")
          getList()
        }
      })
    }).catch(() => {
      ElMessage.info("已取消删除")
    })
  }
</script>

<style lang='scss' scoped>
@import "@/styles/material.scss";
</style>