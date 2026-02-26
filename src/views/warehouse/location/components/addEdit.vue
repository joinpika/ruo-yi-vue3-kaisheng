<template>
  <div>
    <el-dialog :title="title" v-model="showDialog" width="800px" @close="cancel" class="dialog-material">
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules" size="small">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="仓库名称" prop="warehouseId">
              <treeselect
                v-model="formData.warehouseId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="请选择仓库名称"
                :disabled="disabledFlag"
                :searchable="true"
                :clearable="true"
                :default-expand-level="1"
                search-nested
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位名称" prop="locationName">
              <el-input v-model="formData.locationName" placeholder="请输入仓库名称" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库位编码" prop="locationCode">
              <el-input v-model="formData.locationCode" placeholder="请输入库位编码" :disabled="disabledFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :rows="2" :disabled="disabledFlag"/>
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
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Treeselect } from 'vue3-treeselect'
  import 'vue3-treeselect/dist/vue3-treeselect.css'
  import { listBusWarehouseTreeFa } from "@/api/statistics/BusWarehouse"
  import { addBusWarehouseLocation, updateBusWarehouseLocation } from "@/api/statistics/BusWarehouseLocation"

  const showDialog = ref(false)
  const title = ref("新增原材料")
  const disabledFlag = ref(false)
  const loading = ref(false)
  const deptOptions = ref([])
  const formRef = ref()
  const loadingFlag = ref(false)

  const formData = reactive({
    locationName: "",
    locationCode: "",
    warehouseId: undefined,
    remark: "",
  })

  const formRules = reactive({
    warehouseId: [
      { required: true, message: "仓库不能为空", trigger: "change" },
    ],
    locationName: [
      { required: true, message: "请输入库位名称", trigger: "blur" },
    ],
    locationCode: [
      { required: true, message: "请输入库位编码", trigger: "blur" },
    ],
  })

  onMounted(() => {
    getWarehouseTree()
  })

  const normalizer = (node) => {
    if (node.children && !node.children.length) {
      delete node.children
    }
    return {
      id: node.id,
      label: node.warehouseName,
      children: node.children,
    }
  }

  const getWarehouseTree = () => {
    listBusWarehouseTreeFa().then((response) => {
      if (response.code === 200) {
        deptOptions.value = handleTree(response.data, "id")
      }
    })
  }

  const handleTree = (data, idKey) => {
    const map = {}
    const result = []
    data.forEach(item => {
      map[item[idKey]] = { ...item, children: [] }
    })
    data.forEach(item => {
      const parent = map[item.parentId]
      if (parent) {
        parent.children.push(map[item[idKey]])
      } else {
        result.push(map[item[idKey]])
      }
    })
    return result
  }

  const openDialog = (type, row = null) => {
    showDialog.value = true
    Object.assign(formData, {
      locationName: "",
      warehouseId: undefined,
      remark: "",
    })

    if (type === "add") {
      title.value = "新增库位信息"
      disabledFlag.value = false
    } else if (type === "edit") {
      title.value = "修改库位信息"
      disabledFlag.value = false
      if (row) {
        Object.assign(formData, { ...row })
      }
    } else if (type === "view") {
      title.value = "查看库位"
      disabledFlag.value = true
      if (row) {
        Object.assign(formData, { ...row })
      }
    }

    nextTick(() => {
      if (formRef.value && type !== "view") {
        formRef.value.clearValidate()
      }
    })
  }

  const cancel = () => {
    showDialog.value = false
    Object.assign(formData, {
      locationName: "",
      locationCode: "",
      warehouseId: "",
      remark: "",
    })
    title.value = "新增仓库信息"
    loading.value = false
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  const submitForm = () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
      if (valid) {
        loading.value = true
        if (formData.id) {
          // 编辑
          updateBusWarehouseLocation(formData).then(res => {
            if (res.code === 200) {
              cancel()
              ElMessage.success("修改成功")
              loadingFlag.value = false
            }
          }).catch((error) => {
            console.error("保存失败:", error)
            loading.value = false
            ElMessage.error("保存失败")
          })
        } else {
          // 新增
          addBusWarehouseLocation(formData).then(res => {
            if (res.code === 200) {
              cancel()
              ElMessage.success("添加仓库信息成功")
              loadingFlag.value = false
            }
          }).catch((error) => {
            console.error("保存失败:", error)
            loading.value = false
            ElMessage.error("保存失败")
          })
        }
      } else {
        return false
      }
    })
  }

  defineExpose({
    openDialog
  })
</script>