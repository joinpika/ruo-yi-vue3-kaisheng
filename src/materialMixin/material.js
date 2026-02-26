import { productionList } from '@/api/busProduction/productionLine'
import { listPost } from "@/api/material/raw";

export const materialMixin = {
  data () {
    return {
      formData: {
        unit: "", // 单位
        specModel: "", // 规格型号
        isCoated: 1, // 是否镀膜 1-是 0-否
        // productionLine: "", // 使用产线
        productArchivesId: "", // 使用产线id
        // factoryName: "", // 厂商
        factoryId: "", // 厂商id
        safetyStock: "", // 最低库存
        enableTime: null, // 启用时间
        stockStatus: 0, // 入库状态
        remark: "", // 备注
      },
      unitList: [
        { value: "件", label: "件" },
        { value: "套", label: "套" },
        { value: "个", label: "个" },
        { value: "台", label: "台" },
        { value: "千克", label: "千克" },
        { value: "吨", label: "吨" },
        { value: "米", label: "米" },
        { value: "平方米", label: "平方米" },
        { value: "立方米", label: "立方米" },
      ],
      // 使用产线
      lineList: [],
      // 厂商
      factoryList: [],
      formRules: {
        unit: [{ required: true, message: "请选择单位", trigger: "change" }],
        specModel: [
          { required: true, message: "请输入规格型号", trigger: "blur" },
        ],
        isCoated: [
          { required: true, message: "请选择是否镀膜", trigger: "change" },
        ],
        // productionLine: [
        //   { required: true, message: "请选择使用产线", trigger: "change" },
        // ],
        productArchivesId: [
          { required: true, message: "请选择使用产线", trigger: "change" },
        ],
        // factoryName: [
        //   { required: true, message: "请选择厂商", trigger: "change" },
        // ],
        factoryId: [
          { required: true, message: "请选择厂商", trigger: "change" },
        ],
        safetyStock: [
          { required: true, message: "请输入最低库存", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "最低库存必须为正整数",
            trigger: "blur",
          },
        ],
        stockStatus: [
          { required: true, message: "请选择入库状态", trigger: "change" },
        ],
        enableTime: [
          { required: true, message: "请选择启用时间", trigger: "blur" },
        ],
      },
      // venterDrawer: {
      //   visible: false,
      //   title: "请选择厂商",
      // },
    }
  },
  methods: {
    lineOptions () {
      productionList().then((res) => {
        if (res.code === 200) {
          this.lineList = res.rows.map((item) => ({
            label: item.lineName,
            value: item.id,
          }));
        }
      });
    },
    factoryOptions () {
      listPost().then((res) => {
        if (res.code === 200) {
          this.factoryList = res.rows.map((item) => ({
            label: item.factoryName,
            value: item.id,
          }));
        }
      });
    },
    // openManuDialog () {
    //   this.venterDrawer.visible = true;
    // },
    // handleVenterDrawerClose () {
    //   this.venterDrawer.visible = false;
    // },
    // // 选择厂商 提交
    // selectManufacturer () {
    //   const row = this.$refs.venter.getSelectedRow();
    //   if (!row) {
    //     this.$message.warning("请先选择厂商");
    //     return;
    //   }
    //   // this.formData.factoryId = row.map((item) => item.id).join(",");
    //   this.formData.factoryName = row.map((item) => item.factoryName).join(",");
    //   this.$nextTick(() => {
    //     this.$refs.formRef.clearValidate(["factoryName"]); // 先清错误
    //     this.$refs.formRef.validateField("factoryName"); // 再重新校验
    //   });
    //   this.venterDrawer.visible = false;
    // },
  },
  created () {
    this.lineOptions();
    this.factoryOptions();
  }
}