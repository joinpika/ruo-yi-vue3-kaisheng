<template>
  <div>
    <el-dialog :title="title" v-model="showDialog" width="750px" @close="cancel" class="dialog-material">
      <el-form ref="formRef" :model="formData" label-width="110px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="辅料名称" prop="auxName">
              <el-input v-model="formData.auxName" placeholder="请输入辅料名称" style="width: 100%" :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="辅料编码" prop="auxCode">
              <el-input v-model="formData.auxCode" placeholder="请输入辅料编码" style="width: 100%" :disabled="disabledFlag" />
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
            <!-- 预留字段 -->
          </el-col>
          <el-col :xs="24" :sm="12">
            <!-- 预留字段 -->
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="厂商" prop="vendorId">
              <el-select v-model="formData.vendorId" style="width: 100%" placeholder="请选择厂商" :disabled="disabledFlag">
                <el-option v-for="item in factoryList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="最低库存" prop="safetyStock">
              <el-input v-model="formData.safetyStock" type="number" placeholder="请输入最低库存" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="启用时间" prop="enableTime">
              <el-date-picker v-model="formData.enableTime" placeholder="请输入启用时间" style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <!-- 预留字段 -->
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
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="!disabledFlag" @click="submitForm" :loading="loadingFlag">保存</el-button>
        <el-button size="small" @click="cancel">{{ disabledFlag ? '关闭' : '取消' }}</el-button>
      </div>
    </el-dialog>
    <!-- 选择厂商抽屉（已注释） -->
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { addPost, updatePost, detailList } from "@/api/material/auxiliary"
import { materialMixin } from "@/materialMixin/material.js"

// 使用mixin（在Vue3中可以通过组合式函数来实现）
// 这里假设materialMixin导出的是可用的组合式函数
const { unitList, factoryList, lineList } = materialMixin()

// 响应式数据
const showDialog = ref(false)
const title = ref("新增汽玻物料")
const disabledFlag = ref(false)
const loadingFlag = ref(false)

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({
  auxCode: "",
  auxName: "",
  specModel: "",
  unit: "",
  isCoated: "",
  productionLineId: "",
  vendorId: "",
  safetyStock: "",
  purchaseQuantity: "",
  purchasePrice: "",
  enableTime: null,
  stockStatus: "",
  remark: "",
  id: null
})

// 表单验证规则
const formRules = reactive({
  auxCode: [
    { required: true, message: "请输入辅料编码", trigger: "blur" },
  ],
  auxName: [
    { required: true, message: "请输入辅料名称", trigger: "blur" },
  ],
  productionLineId: [
    { required: true, message: "请选择使用产线", trigger: "change" },
  ],
  vendorId: [
    { required: true, message: "请选择厂商", trigger: "change" },
  ],
  purchaseQuantity: [
    { required: true, message: "请输入采购数量", trigger: "blur" },
    {
      pattern: /^\d+$/,
      message: "采购数量必须为正整数",
      trigger: "blur",
    },
  ],
  purchasePrice: [
    { required: true, message: "请输入采购单价", trigger: "blur" },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: "采购单价必须为正数，且最多两位小数",
      trigger: "blur",
    },
  ],
})

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    auxCode: "",
    auxName: "",
    specModel: "",
    unit: "",
    isCoated: "",
    productionLineId: "",
    vendorId: "",
    safetyStock: "",
    purchaseQuantity: "",
    purchasePrice: "",
    enableTime: null,
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
    title.value = "新增汽玻物料"
    disabledFlag.value = false
  } else if (type === "edit") {
    title.value = "修改汽玻物料"
    disabledFlag.value = false
    if (row) {
      detailList(row.id).then((response) => {
        Object.assign(formData, response.data)
      })
    }
  } else if (type === "view") {
    title.value = "查看汽玻物料"
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
  title.value = "新增汽玻物料"
  if (formRef.value) {
    formRef.value.resetFields()
  }
  nextTick(() => {
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
      loadingFlag.value = true
      
      if (formData.id) {
        // 编辑
        updatePost(formData).then(() => {
          cancel()
          ElMessage.success("修改成功")
          loadingFlag.value = false
        }).catch((error) => {
          loadingFlag.value = false
          ElMessage.error("保存失败")
        })
      } else {
        // 新增
        addPost(formData).then(() => {
          cancel()
          ElMessage.success("添加汽玻物料成功")
          loadingFlag.value = false
        }).catch((error) => {
          loadingFlag.value = false
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