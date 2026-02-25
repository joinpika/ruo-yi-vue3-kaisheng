<template>
  <div class="first-text">
    <el-table :data="productList" style="width: 100%; margin-top: 10px;" :header-cell-style="{ backgroundColor: '#f5f7fa' }">
      <el-table-column prop="itemCode" label="物料编码" align="center">
        <template #default="scope">
          <el-select v-model="scope.row.itemCode" placeholder="请查询" clearable filterable @change="getSelectByCode(scope.row)" :disabled="mode">
            <el-option v-for="item in scope.row.productCodeOptions" :key="item.productCode" :label="item.productCode" :value="item.productCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="itemName" label="物料名称" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.itemName" disabled size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="specification" label="规格型号" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.specification" disabled size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" align="center">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.quantity"
            :min="0"
            :precision="0"
            controls-position="right"
            size="small"
            :disabled="mode"
            @focus="clearZero(scope.row, 'quantity')"
            @blur="fillZero(scope.row, 'quantity')"
          />
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.specification" disabled size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
        <template #default="scope">
          <el-input v-model="scope.row.remark" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button size="small" type="text" :disabled="mode" @click="handleDeleteForm(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="first-text">
      <el-button type="primary" size="small" icon="Plus" :disabled="mode" plain @click="onAdd">新增一项</el-button>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, watch } from 'vue'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { Plus } from '@element-plus/icons-vue'
  import { listWarehouseList } from "@/api/statistics/BusWarehouse";
  import { listBusWarehouseLocation } from "@/api/statistics/BusWarehouseLocation";
  import { listSelectByCategory } from "@/api/statistics/busFinishedProduct";
  import { listBusWarehouseTreeFa } from "@/api/statistics/BusWarehouse";
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    categoryId: {
      type: [Number, String],
      default: null
    },
    disabledFlag: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits()

  const warehouseOptions = ref([])
  const locationOptions = ref([])
  const productCodeOptions = ref([])
  const productNameOptions = ref([])
  const mode = ref(false)
  const productList = ref([])
  const infoTableData = ref([])
  const searchForm = reactive({
    categoryId: props.categoryId,
    pageNum: 1,
    pageSize: 100
  })

  onMounted(() => {
    console.log('props.disabledFlag :>> ', props.disabledFlag)
    console.log('props.categoryId :>> ', props.categoryId)
    getWarehouseList()
  })

  watch(() => props.categoryId, (newVal) => {
    searchForm.categoryId = newVal
  })

  watch(() => props.disabledFlag, (newVal) => {
    mode.value = newVal
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

  const getSelectByCategory = (row) => {
    if (!searchForm.categoryId) return
    listSelectByCategory({ categoryId: searchForm.categoryId }).then((res) => {
      if (res.code === 200) {
        if (row) {
          row.productCodeOptions = res.data
        }
      }
    })
  }

  const getSelectByCode = (row) => {
    if (!row.itemCode) {
      row.itemName = ''
      row.specification = ''
      return
    }
    listSelectByCategory({ productCode: row.itemCode, categoryId: searchForm.categoryId }).then((res) => {
      if (res.code === 200) {
        row.productNameOptions = res.data
        if (res.data && res.data.length > 0) {
          console.log("res.data", res.data)
          row.itemName = res.data[0].productName
          row.quantity = 0
          row.specification = res.data[0].specification
        }
      }
    })
  }

  const getLocationByProduct = (row) => {
    console.log('row :>> ', row)
    if (!row.warehouseId) {
      row.locationId = ''
      row.locationOptions = []
      return
    }
    listBusWarehouseLocation({ warehouseId: row.warehouseId }).then((res) => {
      if (res.code === 200) {
        row.locationOptions = res.rows
      }
    })
    getSelectByCategory(row)
  }

  const getWarehouseList = () => {
    listBusWarehouseTreeFa().then((response) => {
      if (response.code === 200) {
        warehouseOptions.value = handleTree(response.data, "id")
        console.log('warehouseOptions :>> ', warehouseOptions.value)
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

  const clearZero = (row, key) => {
    if (Number(row[key]) === 0) row[key] = ''
  }

  const fillZero = (row, key) => {
    if (row[key] === '' || row[key] == null) row[key] = 0
    const val = Number(row[key])
    if (val < 0) row[key] = 0
  }

  const onAdd = () => {
    if (!searchForm.categoryId) {
      ElMessage.warning("请先选择物料分类")
      return
    }
    const newRow = {
      warehouseId: null,
      locationId: '',
      itemCode: '',
      itemName: '',
      quantity: 0,
      specification: '',
      unit: 0,
      warehouseOptions: [],
      locationOptions: [],
      productCodeOptions: [],
      productNameOptions: [],
    }
    productList.value.push(newRow)
    getSelectByCategory(newRow)
  }

  const handleDeleteForm = (row) => {
    const index = productList.value.indexOf(row)
    if (index !== -1) {
      productList.value.splice(index, 1)
    }
  }

  const initData = (list, modeType) => {
    console.log('list :>> ', list)
    if (!list || list.length === 0) {
      productList.value = []
      return
    }
    if (modeType === "view") {
      mode.value = true
    }
    productList.value = list.map(item => {
      const row = {
        ...item,
        specification: item.spec,
        warehouseOptions: [],
        locationOptions: [],
        productCodeOptions: [],
        productNameOptions: [],
      }
      getLocationByProduct(row)
      getSelectByCategory(row)
      console.log('row :>> ', row)
      return row
    })
  }

  defineExpose({
    initData
  })
</script>

<style scoped>
.first-text {
  margin: 5px 0;
}
.vue-treeselect__control {
  height: 32px !important;
  line-height: 32px !important;
}
</style>