<template>
  <div>
    <el-dialog :title="title" v-model="showDialog" width="750px" @close="cancel" class="dialog-material" center>
      <el-form ref="formRef" :model="formData" label-width="110px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="原材料名称" prop="materialName">
              <el-input v-model="formData.materialName" placeholder="请输入原材料名称" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="原材料编码" prop="materialCode">
              <el-input v-model="formData.materialCode" placeholder="请输入原材料编码" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="规格型号" prop="specModel">
              <el-input v-model="formData.specModel" placeholder="请输入规格型号" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="formData.unit" style="width: 100%" placeholder="请选择单位" :disabled="disabledFlag">
                <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="入库状态" prop="stockStatus">
              <el-select v-model="formData.stockStatus" style="width: 100%" placeholder="请选择入库状态"
                :disabled="disabledFlag">
                <el-option value="0" label="待验收" />
                <el-option value="1" label="已入库" />
                <el-option value="3" label="在途中" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="是否镀膜" prop="isCoated">
              <el-select v-model="formData.isCoated" style="width: 100%" placeholder="请选择是否镀膜" :disabled="disabledFlag">
                <el-option :value="1" label="是" />
                <el-option :value="0" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="使用产线" prop="productArchivesId">
              <el-select v-model="formData.productArchivesId" style="width: 100%" placeholder="请选择产线"
                :disabled="disabledFlag">
                <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="厂商" prop="factoryId">
              <el-select v-model="formData.factoryId" style="width: 100%" placeholder="请选择厂商"
                :disabled="disabledFlag">
                <el-option v-for="item in factoryList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="最低库存" prop="safetyStock">
              <el-input v-model="formData.safetyStock" type="number" placeholder="请输入最低库存" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="启用时间" prop="enableTime">
              <el-date-picker v-model="formData.enableTime" placeholder="请输入启用时间" style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" placeholder="请输入备注" style="width: 100%" type="textarea" :rows="4"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" v-if="!disabledFlag" @click="submitForm" :loading="loading">保存</el-button>
          <el-button size="small" @click="cancel">{{ disabledFlag ? '关闭' : '取消' }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 选择厂商抽屉（已注释） -->
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { addPost, updatePost, detailList } from "@/api/material/raw"
import { materialMixin } from "@/materialMixin/material.js"

// 使用mixin（转换为组合式函数）
const { unitList, factoryList, lineList } = materialMixin()

// 响应式数据
const loading = ref(false)
const showDialog = ref(false)
const title = ref("新增原材料")
const disabledFlag = ref(false)

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({
  materialCode: "",
  materialName: "",
  specModel: "",
  unit: "",
  isCoated: "",
  productArchivesId: "",
  factoryId: "",
  safetyStock: "",
  createTime: null,
  enableTime: null,
  createBy: "",
  stockStatus: "",
  remark: "",
  id: null
})

// 表单验证规则
const formRules = reactive({
  materialCode: [
    { required: true, message: "请输入原材料编码", trigger: "blur" },
  ],
  materialName: [
    { required: true, message: "请输入原材料名称", trigger: "blur" },
  ],
  createBy: [
    { required: true, message: "请输入创建人", trigger: "blur" },
  ],
  createTime: [
    { required: true, message: "请选择创建时间", trigger: "change" },
  ],
})

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    materialCode: "",
    materialName: "",
    specModel: "",
    unit: "",
    isCoated: "",
    productArchivesId: "",
    factoryId: "",
    safetyStock: "",
    createTime: null,
    enableTime: null,
    createBy: "",
    stockStatus: "",
    remark: "",
    id: null
  })
}

// 打开对话框
const openDialog = (type, row = null) => {
  showDialog.value = true
  resetFormData()
  
  if (type === "add") {
    title.value = "新增原材料"
    disabledFlag.value = false
  } else if (type === "edit") {
    title.value = "修改原材料"
    disabledFlag.value = false
    if (row) {
      detailList(row.id).then((response) => {
        Object.assign(formData, response.data)
      })
    }
  } else if (type === "view") {
    title.value = "查看原材料"
    disabledFlag.value = true
    if (row) {
      detailList(row.id).then((response) => {
        Object.assign(formData, response.data)
      })
    }
  }
  
  // 清除校验（仅在非查看时需要）
  nextTick(() => {
    if (formRef.value && type !== "view") {
      formRef.value.clearValidate()
    }
  })
}

// 取消/关闭
const cancel = () => {
  showDialog.value = false
  resetFormData()
  title.value = "新增原材料"
  
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    // 触发父组件刷新列表
    const parent = getCurrentInstance()?.parent
    if (parent && parent.getList) {
      parent.getList()
    }
  })
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      if (formData.id) {
        // 编辑
        updatePost(formData).then(() => {
          cancel()
          ElMessage.success("修改成功")
          loading.value = false
        }).catch(() => {
          loading.value = false
          ElMessage.error("保存失败")
        })
      } else {
        // 新增
        addPost(formData).then(() => {
          cancel()
          ElMessage.success("添加原材料成功")
          loading.value = false
        }).catch(() => {
          loading.value = false
          ElMessage.error("保存失败")
        })
      }
    } else {
      return false
    }
  })
}

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>