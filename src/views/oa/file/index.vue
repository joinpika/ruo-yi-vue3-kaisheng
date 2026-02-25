<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
    >
      <el-form-item label="目录名称" prop="catalogName">
        <el-input
          v-model="queryParams.catalogName"
          placeholder="请输入目录名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="Refresh" size="small" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:dept:add']"
          type="primary"
          plain
          :icon="Plus"
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          :icon="Sort"
          size="small"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getFileTree" />
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="catalogName" label="目录名称" />
      <el-table-column prop="remark" label="备注"  />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            v-hasPermi="['system:dept:edit']"
            size="small"
            type="primary"
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            v-hasPermi="['system:dept:add']"
            size="small"
            type="primary"
            link
            :icon="Plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            v-hasPermi="['system:dept:remove']"
            size="small"
            type="danger"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col v-if="form.parentId !== 0" :span="24">
            <el-form-item label="上级目录" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级目录"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="目录名称" prop="catalogName">
              <el-input v-model="form.catalogName" placeholder="请输入目录名称" />
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
           <el-form-item label="文件目录管理权限：" prop="hasManagePermRoleIds">
              <el-select v-model="form.hasManagePermRoleIds" style="width: 100%" multiple placeholder="请选择创建者">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件目录查看权限：" prop="hasViewPermRoleIds">
           <el-select v-model="form.hasViewPermRoleIds" style="width: 100%" multiple placeholder="请选择创建者">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="2"/>
            </el-form-item>
          </el-col>
        </el-row>
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
import { Search, Refresh, Plus, Sort, Edit, Delete } from '@element-plus/icons-vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import RightToolbar from '@/components/RightToolbar'
import { listRole } from '@/file/index.js'
import { 
  listBusFileCatalog, 
  getBusFileCatalog, 
  addBusFileCatalog, 
  updateBusFileCatalog, 
  delBusFileCatalog, 
  listBusFileTreeFa 
} from '@/file/busFileCatalog.js'

// 响应式数据
const loading = ref(true)
const showSearch = ref(true)
const deptList = ref([])
const deptOptions = ref([])
const roleList = ref([])
const title = ref('')
const open = ref(false)
const isExpandAll = ref(true)
const refreshTable = ref(true)

// 表单引用
const queryForm = ref(null)
const formRef = ref(null)

// 查询参数
const queryParams = reactive({
  catalogName: undefined,
  status: undefined,
})

// 表单参数
const form = reactive({
  id: undefined,
  parentId: undefined,
  catalogName: undefined,
  orderNum: undefined,
  leader: undefined,
  phone: undefined,
  email: undefined,
  status: "0",
  hasManagePermRoleIds: [],
  hasViewPermRoleIds: [],
  remark: undefined,
})

// 表单校验
const rules = reactive({
  parentId: [
    { required: true, message: "上级部门不能为空", trigger: "blur" },
  ],
  catalogName: [
    { required: true, message: "部门名称不能为空", trigger: "blur" },
  ],
  orderNum: [
    { required: true, message: "显示排序不能为空", trigger: "blur" },
  ],
  hasManagePermRoleIds: [
    { required: true, message: '请选择文件目录管理权限', trigger: 'blur' }
  ],
  hasViewPermRoleIds: [
    { required: true, message: '请选择文件目录查看权限', trigger: 'blur' }
  ],
})

// 获取权限列表
const getRoleList = async () => {
  try {
    const res = await listRole()
    if (res.code === 200) {
      roleList.value = res.data
      console.log('roleList', roleList.value)
    }
  } catch (error) {
    ElMessage.error('获取权限列表失败')
  }
}

// 查询三级目录结构
const getFileTree = async () => {
  loading.value = true
  try {
    const response = await listBusFileCatalog(queryParams)
    deptList.value = handleTree(response.data, "id")
    deptOptions.value = response.data
  } finally {
    loading.value = false
  }
}

// 转换部门数据结构
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children
  }
  return {
    id: node.id,
    label: node.catalogName,
    children: node.children,
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
    id: undefined,
    parentId: undefined,
    catalogName: undefined,
    orderNum: undefined,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: "0",
    hasManagePermRoleIds: [],
    hasViewPermRoleIds: [],
    remark: undefined,
  })
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 搜索按钮操作
const handleQuery = () => {
  getFileTree()
}

// 重置按钮操作
const resetQuery = () => {
  if (queryForm.value) {
    queryForm.value.resetFields()
  }
  handleQuery()
}

// 新增按钮操作
const handleAdd = async (row) => {
  reset()
  if (row != undefined) {
    form.parentId = row.id
  }
  open.value = true
  title.value = "添加目录"
  
  try {
    const response = await listBusFileTreeFa()
    deptOptions.value = handleTree(response.data, "id")
  } catch (error) {
    ElMessage.error('获取目录树失败')
  }
}

// 展开/折叠操作
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 修改按钮操作
const handleUpdate = (row) => {
  reset()
  Object.assign(form, {
    ...row,
    hasManagePermRoleIds: row.hasManagePermRoleIds || [],
    hasViewPermRoleIds: row.hasViewPermRoleIds || []
  })
  open.value = true
  title.value = "修改部门"
}

// 提交按钮
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id != undefined) {
          await updateBusFileCatalog(form)
          ElMessage.success("修改成功")
        } else {
          await addBusFileCatalog(form)
          ElMessage.success("新增成功")
        }
        open.value = false
        getFileTree()
      } catch (error) {
        ElMessage.error("操作失败")
      }
    }
  })
}

// 删除按钮操作
const handleDelete = (row) => {
  ElMessageBox.confirm(`是否确认删除名称为"${row.catalogName}"的数据项？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await delBusFileCatalog(row.id)
        getFileTree()
        ElMessage.success("删除成功")
      } catch (error) {
        ElMessage.error("删除失败")
      }
    })
    .catch(() => {})
}

// 处理树形结构（如果未在全局定义，需要实现）
const handleTree = (data, id) => {
  // 这里需要实现树形结构转换的逻辑
  // 如果项目中有现成的工具函数，可以直接使用
  return data
}

// 初始化
onMounted(() => {
  getFileTree()
  getRoleList()
})
</script>