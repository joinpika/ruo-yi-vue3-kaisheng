<template>
  <div>
    <el-dialog :title="title" v-model="showDialog" width="750px" @close="cancel" class="dialog-material">
      <el-form ref="formRef" :model="formData" label-width="110px" :rules="formRules" size="small">
        <!-- 公共字段 -->
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item :label="types ? types + '编码' : '成品编码'" prop="productCode">
              <el-input v-model="formData.productCode" placeholder="请输入编码" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="types ? types + '名称' : '成品名称'" prop="productName">
              <el-input v-model="formData.productName" placeholder="请输入名称" style="width: 100%"
                :disabled="disabledFlag" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 边窗特有字段 -->
        <div v-if="types === '边窗'">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="型号" prop="model">
                <el-input v-model="formData.model" placeholder="请输入型号" style="width: 100%" :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="规格" prop="productSpec">
                <el-input v-model="formData.productSpec" placeholder="请输入规格" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="规格面积" prop="specArea">
                <el-input v-model="formData.specArea" placeholder="请输入规格面积" style="width: 100%" :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每车套片数" prop="quantityPerSet">
                <el-input v-model="formData.quantityPerSet" type="number" placeholder="请输入每车套片数" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="产商" prop="vendorId">
               <el-select v-model="formData.vendorId" style="width: 100%" placeholder="请选择厂商" :disabled="disabledFlag">
                <el-option v-for="item in factoryList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="采购数量" prop="purchaseQuantity">
                <el-input v-model="formData.purchaseQuantity" type="number" placeholder="请输入采购数量" style="width: 100%"
                  :disabled="disabledFlag" />
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
              <el-form-item label="采购单价" prop="purchasePrice">
                <el-input v-model="formData.purchasePrice" placeholder="请输入采购单价" style="width: 100%"
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
            <!-- 入库状态已注释 -->
          </el-row>
        </div>

        <!-- 后档/天幕/前档公共字段 -->
        <div v-else>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="车型" prop="model">
                <el-input v-model="formData.model" placeholder="请输入车型" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="产品规格" prop="productSpec">
                <el-input v-model="formData.productSpec" placeholder="请输入产品规格" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="规格面积" prop="specArea">
                <el-input v-model="formData.specArea" placeholder="请输入规格面积" style="width: 100%" :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="每车套片数" prop="quantityPerSet">
                <el-input v-model="formData.quantityPerSet" type="number" placeholder="请输入每车套片数" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="切割图号" prop="cuttingDrawingNo">
                <el-input v-model="formData.cuttingDrawingNo" placeholder="请输入切割图号" style="width: 100%"
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
            <el-col :xs="24" :sm="24">
              <el-form-item label="玻璃数量" prop="glassQuantity">
                <el-input v-model="formData.glassQuantity" type="number" placeholder="请输入玻璃数量" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 单片工艺部分（后档/天幕/边窗共有） -->
        <div v-if="types !== '前档'">
          <div class="add-title"><span>单片工艺</span></div>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24">
              <el-form-item label="工艺路线" prop="innerProcessRoute">
                <el-input v-model="formData.innerProcessRoute" placeholder="请输入工艺路线" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="8">
              <el-form-item label="长度" prop="innerLength">
                <el-input v-model="formData.innerLength" placeholder="请输入长度" style="width: 100%" :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="宽度" prop="innerWidth">
                <el-input v-model="formData.innerWidth" placeholder="请输入宽度" style="width: 100%" :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="厚度" prop="innerThickness">
                <el-input v-model="formData.innerThickness" placeholder="请输入厚度" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <el-form-item label="玻璃颜色" prop="innerGlassColor">
                <el-input v-model="formData.innerGlassColor" placeholder="请输入玻璃颜色" style="width: 100%"
                    :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="精细处理" prop="innerFineProcessing">
                <el-input v-model="formData.innerFineProcessing" placeholder="请输入精细处理" style="width: 100%"
                  :disabled="disabledFlag" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 前档特有的选项卡 -->
        <div v-if="types === '前档'">
          <el-tabs v-model="activeName">
            <el-tab-pane label="内片" name="inner">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24">
                  <el-form-item label="工艺路线" prop="innerProcessRoute">
                    <el-input v-model="formData.innerProcessRoute" placeholder="请输入工艺路线" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="8">
                  <el-form-item label="长度" prop="innerLength">
                    <el-input v-model="formData.innerLength" placeholder="请输入长度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="宽度" prop="innerWidth">
                    <el-input v-model="formData.innerWidth" placeholder="请输入宽度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="厚度" prop="innerThickness">
                    <el-input v-model="formData.innerThickness" placeholder="请输入厚度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="玻璃颜色" prop="innerGlassColor">
                    <el-input v-model="formData.innerGlassColor" placeholder="请输入玻璃颜色" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="精细处理" prop="innerFineProcessing">
                    <el-input v-model="formData.innerFineProcessing" placeholder="请输入精细处理" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="合片" name="combined">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="胶体种类" prop="colloidType">
                    <el-input v-model="formData.colloidType" placeholder="请输入胶体种类" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="胶体规格" prop="colloidSpec">
                    <el-input v-model="formData.colloidSpec" placeholder="请输入胶体规格" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="胶体颜色" prop="colloidColor">
                    <el-input v-model="formData.colloidColor" placeholder="请输入胶体颜色" style="width: 100%"
                        :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="胶体含水率" prop="colloidWaterContent">
                   <el-input v-model="formData.colloidWaterContent" placeholder="请输入胶体含水率" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="胶体厂家" prop="colloidVendor">
                    <el-input v-model="formData.colloidVendor" placeholder="请输入胶体厂家" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="夹胶厚度" prop="laminatedThickness">
                   <el-input v-model="formData.laminatedThickness" placeholder="请输入夹胶厚度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24">
                  <el-form-item label="留边量" prop="edgeReserve">
                    <el-input v-model="formData.edgeReserve" placeholder="请输入留边量" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="外片" name="outer">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="24">
                  <el-form-item label="工艺路线" prop="outerProcessRoute">
                    <el-input v-model="formData.outerProcessRoute" placeholder="请输入工艺路线" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="8">
                  <el-form-item label="长度" prop="outerLength">
                    <el-input v-model="formData.outerLength" placeholder="请输入长度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="宽度" prop="outerWidth">
                    <el-input v-model="formData.outerWidth" placeholder="请输入宽度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8">
                  <el-form-item label="厚度" prop="outerThickness">
                    <el-input v-model="formData.outerThickness" placeholder="请输入厚度" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="玻璃颜色" prop="outerGlassColor">
                    <el-input v-model="formData.outerGlassColor" placeholder="请输入玻璃颜色" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="精细处理" prop="outerFineProcessing">
                    <el-input v-model="formData.outerFineProcessing" placeholder="请输入精细处理" style="width: 100%"
                      :disabled="disabledFlag" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
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
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { listPost } from "@/api/material/raw"
import { addPost, updatePost, detailList } from "@/api/material/finishedProduct"

// 响应式数据
const loading = ref(false)
const types = ref('')
const showDialog = ref(false)
const title = ref('新增成品')
const disabledFlag = ref(false)
const activeName = ref('inner')

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = reactive({
  productCode: "",
  productName: "",
  productType: "",
  model: "", // 型号
  productSpec: "",
  specArea: "", // 规格面积
  quantityPerSet: "", // 每车套片数
  vendorId: "", // 产商id
  purchaseQuantity: "", // 采购数量
  safetyStock: "", // 最低库存
  purchasePrice: "", // 采购单价
  enableTime: null, // 启用时间
  stockStatus: "", // 入库状态
  cuttingDrawingNo: "", // 切割图号
  unit: "", // 单位
  glassQuantity: "", // 玻璃数量
  // 前档特有的字段
  innerProcessRoute: "", // 内片工艺路线
  innerLength: "", // 内片长度
  innerWidth: "", // 内片宽度
  innerThickness: "", // 内片厚度
  innerGlassColor: "", // 内片玻璃颜色
  innerFineProcessing: "", // 内片精细处理
  colloidType: "", // 胶体种类
  colloidSpec: "", // 胶体规格
  colloidColor: "", // 胶体颜色
  colloidWaterContent: "", // 胶体含水率
  colloidVendor: "", // 胶体厂家
  laminatedThickness: "", // 夹胶厚度  
  edgeReserve: "", // 留边量
  outerProcessRoute: "", // 外片工艺路线
  outerLength: "", // 外片长度
  outerWidth: "", // 外片宽度
  outerThickness: "", // 外片厚度
  outerGlassColor: "", // 外片玻璃颜色
  outerFineProcessing: "", // 外片精细处理
  status: 1, // 状态
  id: null
})

// 厂商列表
const factoryList = ref([])

// 单位列表
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

// 选项数据
const glassColorOptions = ref([
  { value: 1, label: "玻璃颜色1" },
  { value: 2, label: "玻璃颜色2" },
])

const cutOptions = ref([
  { value: 1, label: "切割1" },
  { value: 2, label: "切割2" },
])

const specificationsOptions = ref([
  { value: 1, label: "规格1" },
  { value: 2, label: "规格2" },
])

// 表单验证规则
const formRules = reactive({
  productCode: [
    { required: true, message: "请输入编码", trigger: "blur" },
  ],
  productName: [
    { required: true, message: "请输入名称", trigger: "blur" },
  ],
  model: [{ required: true, message: "请输入型号", trigger: "blur" }],
  productSpec: [
    { required: true, message: "请输入规格", trigger: "blur" },
  ],
  specArea: [{ required: true, message: "请输入规格面积", trigger: "blur" }],
  quantityPerSet: [
    { required: true, message: "请输入每车套片数", trigger: "blur" },
  ],
  vendorId: [
    { required: true, message: "请选择产商", trigger: "change" },
  ],
  purchaseQuantity: [
    { required: true, message: "请输入采购数量", trigger: "blur" },
    {
      pattern: /^\d+$/,
      message: "采购数量必须为正整数",
      trigger: "blur",
    },
  ],
  safetyStock: [
    { required: true, message: "请输入最低库存", trigger: "blur" },
    {
      pattern: /^\d+$/,
      message: "最低库存必须为正整数",
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
  enableTime: [
    { required: true, message: "请选择启用时间", trigger: "change" },
  ],
  stockStatus: [
    { required: true, message: "请选择入库状态", trigger: "change" },
  ],
  cuttingDrawingNo: [
    { required: true, message: "请输入切割图号", trigger: "blur" },
  ],
  unit: [{ required: true, message: "请选择单位", trigger: "change" }],
  glassQuantity: [
    { required: true, message: "请输入玻璃数量", trigger: "blur" },
  ],
  // 前档特有的验证规则 
  innerProcessRoute: [
    { required: true, message: "请输入工艺路线", trigger: "blur" },
  ],
  innerLength: [{ required: true, message: "请输入长度", trigger: "blur" }],
  innerWidth: [{ required: true, message: "请输入宽度", trigger: "blur" }],
  innerThickness: [{ required: true, message: "请输入厚度", trigger: "blur" }],
  innerGlassColor: [
    { required: true, message: "请输入玻璃颜色", trigger: "blur" },
  ],
  innerFineProcessing: [
    { required: true, message: "请输入精细处理", trigger: "blur" },
  ],
  colloidType: [{ required: true, message: "请输入胶体种类", trigger: "blur" }],
  colloidSpec: [{ required: true, message: "请输入胶体规格", trigger: "blur" }],
  colloidColor: [{ required: true, message: "请输入胶体颜色", trigger: "blur" }],
  colloidWaterContent: [
    { required: true, message: "请输入胶体含水率", trigger: "blur" },
  ],
  colloidVendor: [{ required: true, message: "请输入胶体厂家", trigger: "blur" }],
  laminatedThickness: [
    { required: true, message: "请输入夹胶厚度", trigger: "blur" },
  ],
  edgeReserve: [
    { required: true, message: "请输入留边量", trigger: "blur" },
  ],
  outerProcessRoute: [
    { required: true, message: "请输入外片工艺路线", trigger: "blur" },
  ],
  outerLength: [{ required: true, message: "请输入外片长度", trigger: "blur" }],
  outerWidth: [{ required: true, message: "请输入外片宽度", trigger: "blur" }],
  outerThickness: [{ required: true, message: "请输入外片厚度", trigger: "blur" }],
  outerGlassColor: [
    { required: true, message: "请输入外片玻璃颜色", trigger: "blur" },
  ],
  outerFineProcessing: [
    { required: true, message: "请输入外片精细处理", trigger: "blur" },
  ],
})

// 获取厂商列表
const factoryOptions = async () => {
  try {
    const res = await listPost()
    if (res.code === 200) {
      factoryList.value = res.rows.map((item) => ({
        label: item.factoryName,
        value: item.id,
      }))
    }
  } catch (error) {
    ElMessage.error("获取厂商列表失败")
  }
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    productCode: "",
    productName: "",
    productType: "",
    model: "",
    productSpec: "",
    specArea: "",
    quantityPerSet: "",
    vendorId: "",
    purchaseQuantity: "",
    safetyStock: "",
    purchasePrice: "",
    enableTime: null,
    stockStatus: "",
    cuttingDrawingNo: "",
    unit: "",
    glassQuantity: "",
    innerProcessRoute: "",
    innerLength: "",
    innerWidth: "",
    innerThickness: "",
    innerGlassColor: "",
    innerFineProcessing: "",
    colloidType: "",
    colloidSpec: "",
    colloidColor: "",
    colloidWaterContent: "",
    colloidVendor: "",
    laminatedThickness: "",
    edgeReserve: "",
    outerProcessRoute: "",
    outerLength: "",
    outerWidth: "",
    outerThickness: "",
    outerGlassColor: "",
    outerFineProcessing: "",
    status: 1,
    id: null
  })
}

// 打开对话框
const openDialog = (type, row = null, productType) => {
  showDialog.value = true
  types.value = productType
  resetFormData()
  formData.productType = productType
  
  if (type === "add") {
    title.value = productType ? `新增${productType}` : "新增成品"
    disabledFlag.value = false
  } else if (type === "edit") {
    title.value = productType ? `修改${productType}` : "修改成品"
    disabledFlag.value = false
    if (row) {
      detailList(row.id).then((response) => {
        Object.assign(formData, response.data)
      })
    }
  } else if (type === "view") {
    title.value = productType ? `查看${productType}` : "查看成品"
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
  title.value = "新增成品"
  activeName.value = "inner"
  
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    // 触发父组件刷新列表
    const instance = getCurrentInstance()
    if (instance?.parent?.exposed?.getList) {
      instance.parent.exposed.getList()
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
          ElMessage.success("修改成功")
          cancel()
          loading.value = false
        }).catch(() => {
          loading.value = false
          ElMessage.error("保存失败")
        })
      } else {
        // 新增
        addPost(formData).then(() => {
          ElMessage.success("添加成功")
          cancel()
          loading.value = false
        }).catch(() => {
          loading.value = false
          ElMessage.error("保存失败")
        })
      }
    }
  })
}

// 初始化
onMounted(() => {
  factoryOptions()
})

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style scoped>
.add-title {
  font-size: 16px;
  font-weight: bold;
  margin: 18px 0;
  padding-left: 40px;
}
</style>