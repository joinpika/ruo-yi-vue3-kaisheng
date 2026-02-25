<template>
  <div class="container">
    <div class="wrap-content">
      <div class="header-tit">原材料</div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="原材料名称">
            <el-input v-model="searchForm.materialName" placeholder="请输入原材料名称" style="width: 100%" />
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input v-model="searchForm.specModel" placeholder="请输入规格型号" style="width: 100%" />
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
      <!-- 表格 -->
      <div class="box-table">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
          <el-table-column type="index" align="center" label="序号" width="50" />
          <el-table-column prop="materialCode" label="原材料编码" align="center" width="100" />
          <el-table-column prop="materialName" label="原材料名称" align="center" width="100" />
          <el-table-column prop="specModel" label="规格型号 (mm)" align="center" width="120" :show-overflow-tooltip="true" />
          <el-table-column prop="unit" label="单位" align="center" />
          <el-table-column prop="isCoated" label="是否镀膜" align="center">
            <template #default="scope">
              <span :style="coatedStyle(scope.row.isCoated)">{{ scope.row.isCoated == 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productionLine" label="使用产线" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="factoryName" label="厂商" align="center" />
          <el-table-column prop="stockQuantity" label="库存数量" align="center" />
          <el-table-column prop="safetyStock" label="最低库存" align="center" />
          <el-table-column prop="stockStatus" label="入库状态" align="center">
            <template #default="scope">
              <span :style="statusStyle(scope.row.stockStatus)">{{ statusText(scope.row.stockStatus) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="createBy" label="创建者" align="center" /> -->
          <el-table-column prop="createTime" label="创建时间" align="center" width="160" />
          <el-table-column prop="enableTime" label="启用时间" align="center" width="160" />
          <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="操作" fixed="right" align="center" width="180">
            <template #default="scope">
              <el-button size="small" type="text" @click="handleDialog('view', scope.row)">查看</el-button>
              <el-button size="small" type="text" @click="handleDialog('edit', scope.row)">修改</el-button>
              <el-button size="small" type="text" @click="handleDelete(scope.row)" class="button-del">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-model:page="searchForm.pageNum" v-model:limit="searchForm.pageSize"
          :total="total" @pagination="getList" />
      </div>

    </div>
    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialog"></add-edit>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addEdit from "./components/addEdit.vue";
import { rawList, delPost } from "@/api/material/raw";

const loading = ref(true)
const searchForm = reactive({
  materialName: "",
  specModel: "",
  pageSize: 10,
  pageNum: 1,
})
// 计量单位虚拟数据
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
total = ref(0)
tableData = ref([])

const rawDialog = ref(null)

const coatedStyle = (coated) => {
  if(coated == 1){
    return { color: "#409EFF" };
  } else {
    return { color: "#F56C6C " };
  }
}

const statusStyle = (status) => {
  switch (status) {
    case "0":
      return { color: "#F20000" };
    case "1":
      return { color: "#10C700" };
    default:
      return { color: "#EF9E00 " };
  }
}

const statusText = (status) => {
  switch (status) {
    case "0":
      return '待验收';
    case "1":
      return '已入库';
    default:
      return '在途中';
  }
}

// 搜索
const getList = () => {
  loading.value = true;
  rawList(searchForm).then((res) => {
    if (res.code === 200) {
      tableData.value = res.rows;
      total.value = res.total;
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  });
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    materialName: "",
    specModel: "",
    pageSize: 10,
    pageNum: 1,
  });
  getList();
}

// 新增/修改/查看
const handleDialog = (type, row = null) => {
  rawDialog.value?.openDialog(type, row);
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除该原材料吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delPost(row.id).then((res) => {
        if (res.code === 200) {
          ElMessage.success("删除成功");
          getList();
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
}

// 组件挂载时执行
onMounted(() => {
  getList();
});
</script>


<style lang='scss' scoped>
@import "@/styles/material.scss";
</style>
