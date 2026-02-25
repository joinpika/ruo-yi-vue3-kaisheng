<template>
  <div class="container">
    <!-- 用于Excel导出的组件，默认隐藏 -->
    <!-- 搜索区域 -->
    <div class="form-head mb-10">
      <el-form :inline="true" :model="searchForm" :label-width="labelWidth">
        <el-form-item label="文件等级：">
          <el-input v-model="searchForm.levelDegree" placeholder="请输入" class="form-input" @keyup.enter="getList" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="searchForm.status" filterable clearable placeholder="请选择" class="form-input" @keyup.enter="getList">
            <el-option label="正常" value="1" />
            <el-option label="停用" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="Search" @click="getList">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="form-function">
      <div class="header">
        <span class="text-header">文件等级</span>
        <el-button type="primary" class="form-btn form-right" size="small" plain icon="Plus" @click="handleAdd">新建</el-button>
      </div>
      <div class="header-after">
          <el-icon style="color: #409EFF; margin: 0 8px;"><Warning /></el-icon>
        <span class="after-header">已选择<span style="color:#1890ff"> 4 </span>项目  服务调用总计：2</span>
        <el-button type="text" @click="handleClear">清空</el-button>
      </div>
    </div>

    <!-- 产品信息表格 -->
    <div class="form-table">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column prop="levelCode" label="文件等级编码" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="levelDegree" label="文件等级" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="createByName" label="创建者" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="status" label="状态" align="center" >
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
         <pagination
        :total="total"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="45%" :before-close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="150px" :rules="formRules" style="padding:0 20px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="文件等级编码：" prop="levelCode">
              <el-input v-model="formData.levelCode" disabled placeholder="请输入文件类别编码" style="width: 100%"  />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="文件等级：" prop="levelDegree">
              <el-input v-model="formData.levelDegree" placeholder="请输入文件类别名称" style="width: 100%"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
           <el-form-item label="创建者：" prop="createBy">
              <el-select v-model="formData.createBy" style="width: 100%"  placeholder="请选择创建者">
              <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
          </el-select>
          </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker v-model="formData.createTime" placeholder="请输入创建时间" style="width: 100%" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
               <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
           <el-form-item label="查看文件等级权限：" prop="viewRoleIds">
              <el-select v-model="formData.viewRoleIds" style="width: 100%" multiple placeholder="请选择创建者">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
          </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="修改文件等级权限：" prop="modifyRoleIds">
           <el-select v-model="formData.modifyRoleIds" style="width: 100%" multiple placeholder="请选择创建者">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态：" prop="status">
              <el-switch
                v-model="formData.status"
                :active-value="1"     
                :inactive-value="2"   
                active-text="正常"
                inactive-text="停用"
                :disabled="isReadOnly"
                />
            </el-form-item>
            </el-col>
         </el-row>
            <el-row>
              <el-col :span="24">
            <el-form-item label="备注：" prop="remark" style="width: 100%;">
              <el-input v-model="formData.remark" type="textarea" :rows="4" placeholder="请输入备注" class="form-input-all" />
            </el-form-item>
            </el-col>
            </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
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
  import { Search, Refresh, Plus, Warning } from '@element-plus/icons-vue'
  import { listBusFileLevel, addBusFileLevel, delBusFileLevel, updateBusFileLevel } from '@/file/BusFileLevel.js'
  import { listFile, listRole } from '@/file/index.js'
  import VueJsonExcel from 'vue-json-excel'
  import { getToken } from '@/utils/auth'
  import moment from 'moment'

  const labelWidth = '120px'
  const isReadOnly = ref(true)
  const searchForm = reactive({
    levelDegree: '',
    status: '',
    pageSize: 10,
    pageNum: 1
  })
  const total = ref(0)
  const tableData = ref([])
  const dialogVisible = ref(false)
  const dialogTitle = ref('手动新增单位')
  const formData = reactive({
    levelCode: '',
    levelDegree: '',
    createBy: '',
    createTime: null,
    viewRoleIds: [],
    modifyRoleIds: [],
    status: 1,
    remark: ''
  })
  const formRules = reactive({
    levelDegree: [
      { required: true, message: '请输入文件等级程度', trigger: 'blur' }
    ],
    createBy: [
      { required: true, message: '请选择创建者', trigger: 'blur' }
    ],
    createTime: [
      { required: true, message: '请输入创建时间', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    viewRoleIds: [
      { required: true, message: '请选择查看文件等级权限', trigger: 'blur' }
    ],
    modifyRoleIds: [
      { required: true, message: '请选择修改文件等级权限', trigger: 'blur' }
    ],
    remark: [
      { required: true, message: '请输入备注', trigger: 'blur' }
    ]
  })
  const currentProduct = ref(null)
  const userList = ref([])
  const roleList = ref([])
  const showExcelExport = ref(false)
  const exportData = ref([])
  const formRef = ref()
  const excelExport = ref()

  const currentTime = moment().format('YYYYMMDDHHmmss')
  const excelFields = reactive({
    '材质': 'material',
    '规格': 'specification',
    '产品编码': 'productCode',
    '品种': 'productType',
    '米数': 'length',
    '件重(吨/件)': 'pieceWeight',
    '钢厂': 'steelMillName',
    '导入结果': 'importMsg'
  })

  onMounted(() => {
    getList()
    getUserList()
    getRoleList()
  })

  const handleClear = () => {
    console.log('清空')
  }

  const getUserList = () => {
    listFile().then(res => {
      if (res.code === 200) {
        console.log('res :>> ', res)
        userList.value = res.rows
      }
    })
  }

  const getRoleList = () => {
    listRole().then(res => {
      if (res.code === 200) {
        console.log('res创建人 :>> ', res)
        roleList.value = res.data
      }
    })
  }

  const getList = () => {
    listBusFileLevel(searchForm).then(res => {
      if (res.code === 200) {
        console.log('res.rows :>> ', res.rows)
        tableData.value = res.rows
        total.value = res.total
      }
    })
  }

  const generateRandomString3 = () => {
    return Math.random().toString(36).substring(2, 5).toUpperCase()
  }

  const handleReset = () => {
    Object.assign(searchForm, {
      levelDegree: '',
      status: '',
      pageSize: 10,
      pageNum: 1
    })
    getList()
  }

  const handleAdd = () => {
    dialogTitle.value = '手动新增单位'
    getSerialNo()
    nextTick(() => {
      if (formRef.value) {
        formRef.value.clearValidate()
      }
    })
    isReadOnly.value = true
    Object.assign(formData, {
      levelCode: 'WJWD' + generateRandomString3(),
      levelDegree: '',
      createBy: '',
      createTime: new Date(),
      status: 1,
      remark: '',
      viewRoleIds: [],
      modifyRoleIds: []
    })
    currentProduct.value = null
    dialogVisible.value = true
  }

  const getSerialNo = () => {
    formData.levelCode = 'WJWD' + generateRandomString3()
  }

  const handleEdit = (row) => {
    console.log('row :>> ', row)
    dialogTitle.value = '手动编辑单位'
    isReadOnly.value = false
    Object.assign(formData, {
      ...row,
      createBy: Number(row.createBy)
    })
    currentProduct.value = row
    dialogVisible.value = true
  }

  const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delBusFileLevel(row.levelId).then(res => {
        if (res.code === 200) {
          ElMessage.success('删除成功')
          getList()
        }
      })
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }

  const handleClose = () => {
    dialogVisible.value = false
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  const submitForm = () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
      const params = {
        levelCode: formData.levelCode,
        levelDegree: formData.levelDegree,
        createBy: formData.createBy,
        createTime: moment(formData.createTime).format('YYYY-MM-DD HH:mm:ss'),
        status: formData.status,
        remark: formData.remark,
        viewRoleIds: formData.viewRoleIds,
        modifyRoleIds: formData.modifyRoleIds
      }
      if (valid) {
        if (currentProduct.value) {
          params.levelId = currentProduct.value.levelId
          updateBusFileLevel(params).then(res => {
            if (res.code === 200) {
              ElMessage.success('编辑成功')
              getList()
            }
          })
        } else {
          addBusFileLevel(params).then(res => {
            if (res.code === 200) {
              ElMessage.success('新增成功')
              getList()
            }
          })
        }
        dialogVisible.value = false
      } else {
        console.log('表单验证失败')
        return false
      }
    })
  }
</script>

<style scoped>
  .form-input-all {
    width: 100%;
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
  .form-input {
    width: 220px;
  }
  .el-button {
    margin-right: 10px;
  }
</style>