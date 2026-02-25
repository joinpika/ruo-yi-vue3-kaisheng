<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类名称" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" size="small" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="Plus"
          size="small"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          :icon="Edit"
          size="small"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="Delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          :icon="Download"
          size="small"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="ownTable" v-loading="loading" :data="postList" @selection-change="handleSelectionChange" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分类名称" align="center" prop="postId" />
      <el-table-column label="创建者" align="center" prop="postSort" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
          <el-button
            size="small"
            type="danger"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete, Download } from '@element-plus/icons-vue'
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post"
import Pagination from "@/components/Pagination"
import RightToolbar from "@/components/RightToolbar"

// 权限指令（需要全局注册）
// v-hasPermi 指令需要在 main.js 中全局注册

// 响应式数据
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const postList = ref([])
const title = ref("")
const open = ref(false)
const selectedRow = ref([])

// 表格引用
const ownTable = ref(null)
const queryForm = ref(null)
const formRef = ref(null)

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  postCode: undefined,
  postName: undefined,
  status: undefined
})

// 表单参数
const form = reactive({
  postId: undefined,
  postCode: undefined,
  postName: undefined,
  postSort: 0,
  status: "0",
  remark: undefined
})

// 表单校验
const rules = reactive({
  postName: [
    { required: true, message: "岗位名称不能为空", trigger: "blur" }
  ],
  postCode: [
    { required: true, message: "岗位编码不能为空", trigger: "blur" }
  ],
  postSort: [
    { required: true, message: "岗位顺序不能为空", trigger: "blur" }
  ]
})

// 行点击事件
const handleRowClick = (row, event, column) => {
  if (ownTable.value) {
    ownTable.value.toggleRowSelection(row)
  }
}

// 查询岗位列表
const getList = async () => {
  loading.value = true
  try {
    const response = await listPost(queryParams)
    postList.value = response.rows
    total.value = response.total
  } finally {
    loading.value = false
  }
}

// 取消按钮
const cancel = () => {
  open.value = false
  reset()
}

// 表单重置
const reset = () => {
  Object.assign(form, {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: "0",
    remark: undefined
  })
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置按钮操作
const resetQuery = () => {
  if (queryForm.value) {
    queryForm.value.resetFields()
  }
  handleQuery()
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  selectedRow.value = selection
  ids.value = selection.map(item => item.postId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 获取当前选中行（供父组件调用）
const getSelectedRow = () => {
  return selectedRow.value
}

// 新增按钮操作
const handleAdd = () => {
  reset()
  open.value = true
  title.value = "新增产品档案分类"
}

// 修改按钮操作
const handleUpdate = async (row) => {
  reset()
  const postId = row?.postId || ids.value[0]
  try {
    const response = await getPost(postId)
    Object.assign(form, response.data)
    open.value = true
    title.value = "修改产品档案分类"
  } catch (error) {
    ElMessage.error("获取数据失败")
  }
}

// 提交按钮
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.postId != undefined) {
          await updatePost(form)
          ElMessage.success("修改成功")
        } else {
          await addPost(form)
          ElMessage.success("新增成功")
        }
        open.value = false
        getList()
      } catch (error) {
        ElMessage.error("操作失败")
      }
    }
  })
}

// 删除按钮操作
const handleDelete = async (row) => {
  const postIds = row?.postId || ids.value
  try {
    await ElMessageBox.confirm(`是否确认删除岗位编号为"${postIds}"的数据项？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    await delPost(postIds)
    getList()
    ElMessage.success("删除成功")
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error("删除失败")
    }
  }
}

// 导出按钮操作
const handleExport = async () => {
  try {
    await download('system/post/export', {
      ...queryParams
    }, `post_${new Date().getTime()}.xlsx`)
  } catch (error) {
    ElMessage.error("导出失败")
  }
}

// 初始化
onMounted(() => {
  getList()
})

// 暴露方法给父组件
defineExpose({
  getSelectedRow
})
</script>