<template>
  <div class="container">
    <div class="wrap-content">
      <div class="header-tit">成品{{type ? '('+type+')' : ''}}</div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="成品名称">
            <el-input v-model="searchForm.productName" placeholder="请输入成品名称" @keyup.enter="getList" />
          </el-form-item>
          <el-form-item label="成品编码">
            <el-input v-model="searchForm.productCode" placeholder="请输入成品编码" @keyup.enter="getList" />
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
        <el-button type="primary" icon="Plus" size="small" @click="handleDialog('add')" :disabled="addFlag">新增</el-button>
        <!-- <el-button size="small" mini plain icon="Plus" @click="handleAddProduct">产品档案新增</el-button> -->
      </div>

      <!-- 列表相关 -->
      <el-row :gutter="20">
        <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
          <pane size="16">
            <el-col>
              <div class="head-container">
                <el-tree ref="tree" :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                  :filter-node-method="filterNode" node-key="id" default-expand-all highlight-current
                  @node-click="handleNodeClick" />
              </div>
            </el-col>
          </pane>
          <pane size="84">
            <el-col>
              <div>
                <el-table v-loading="loading" :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
                  <el-table-column type="index" align="center" label="序号" width="50" />
                  <el-table-column prop="productCode" label="成品编码" align="center" :show-overflow-tooltip="true" />
                  <el-table-column prop="productName" label="成品名称" align="center" />
                  <el-table-column prop="model" label="车型" align="center" />
                  <el-table-column prop="specArea" label="规格型号（平方米）" align="center" width="150" />
                  <el-table-column prop="quantityPerSet" label="每车套片数" align="center" width="90" />
                  <el-table-column prop="cuttingDrawingNo" label="切割图号" align="center" />
                  <el-table-column prop="unit" label="计量单位" align="center" />
                  <!-- <el-table-column prop="createBy" label="创建者" align="center" /> -->
                  <el-table-column prop="createTime" label="创建时间" align="center" width="160" />
                  <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template #default="scope">
                      <el-button size="small" type="text" @click="handleDialog('view', scope.row)">查看</el-button>
                      <el-button size="small" type="text" @click="handleDialog('edit', scope.row)">修改</el-button>
                      <el-button size="small" type="text" @click="handleDelete(scope.row)"
                        class="button-del">下架</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination v-model:page="searchForm.pageNum" v-model:limit="searchForm.pageSize"
                  :total="total" @pagination="getList" />
              </div>
            </el-col>
          </pane>
        </splitpanes>
      </el-row>

    </div>
    <!-- (新增/修改/查看)弹窗 -->
    <add-edit ref="rawDialog"></add-edit>
    <!-- 产品分类档案 -->
    <!-- <el-dialog :title="titleOpen" v-model="open" width="500px" append-to-body>
      <el-form ref="formOpen" :model="formOpenData" :rules="rulesOpen" label-width="80px" size="small">
        <el-form-item label="分类名称" prop="postName">
          <el-input v-model="formOpenData.postName" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" size="small">确 定</el-button>
          <el-button @click="cancel" size="small">取 消</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useAppStore from '@/store/modules/app'
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
// import { listBusFileLog } from "@/file/busFileLog.js";
import addEdit from "./components/addEdit.vue";
import { finishedProductList,delPost } from "@/api/material/finishedProduct";

const appStore = useAppStore()

const loading = ref(true)
const type = ref("")
const searchForm = reactive({
  productName:"",
  productCode:"",
  pageSize: 10,
  pageNum: 1,
  status: 1,
})
const addFlag = ref(true)
const deptOptions = ref([])
const defaultProps = reactive({
  children: "children",
  label: "catalogName",
})
const threeData = ref("")
const total = ref(0)
const tableData = ref([])
const open = ref(false)
const titleOpen = ref("新增产品档案分类")
const formOpenData = reactive({
  postName: "",
})
const rulesOpen = reactive({
  postName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
})

const tree = ref(null)
const rawDialog = ref(null)
const formOpen = ref(null)

// 搜索
const getList = () => {
  loading.value = true;
  finishedProductList(searchForm).then((res) => {
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
    productName:"",
    productCode:"",
    pageSize: 10,
    pageNum: 1,
    status: 1,
  });
  getList();
}

//新增/修改/查看
const handleDialog = (type, row = null) => {
  rawDialog.value?.openDialog(type, row, type.value);
}

/** 查询产品档案 */
const getFileTree = () => {
  // listBusFileLog({ catalogName: threeData.value || "" }).then((res) => {
  //   deptOptions.value = [
  //     {
  //       id: 0,
  //       catalogName: "产品档案分类",
  //       children: res.rows.map((item) => ({
  //         id: item.id,
  //         catalogName: item.fileName,
  //       })),
  //     },
  //   ];
  //   searchForm.fileCatalogId = res.rows[0].id;
  //   getList();
  // });
  deptOptions.value = [
    {
      id: 0,
      catalogName: "产品档案分类",
      children: [
        { id: 1, catalogName: "边窗" },
        { id: 2, catalogName: "前档" },
        { id: 3, catalogName: "后档" },
        { id: 4, catalogName: "天幕" },
      ],
    },
  ];
}

// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

// 节点单击事件
const handleNodeClick = (data) => {
  if (data.id !== 0) {
    addFlag.value = false;
    // searchForm.fileCatalogId = data.id;
    searchForm.productType = data.catalogName;
    type.value = data.catalogName;
    getList();
  }
}

// 下架
const handleDelete = (row) => {
  ElMessageBox.confirm(
    "您确认要下架" +
      "“" +
      row.productName +
      "”" +
      "产品吗？ 下架后该产品将不再在前端展示，但历史订单和数据会被保留",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
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
  getFileTree();
});
</script>


<style lang='scss' scoped>
@import "@/styles/material.scss";
</style>
