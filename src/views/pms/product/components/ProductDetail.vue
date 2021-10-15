<template>
   
  <el-card class="form-container" shadow="never">
    <!-- <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps> -->
    <b>商品基本信息</b>
    <product-info-detail ref="productInfo" :productParam="productParam" :is-edit="isEdit">
    </product-info-detail>
    <b>商品详情</b>
    <product-attr-detail
      ref="productAttr"
      :productParam="productParam"
      @save="saveInput"
      :is-edit="isEdit"
    />
  </el-card>
</template>
<script>
import ProductInfoDetail from "./ProductInfoDetail";
import ProductSaleDetail from "./ProductSaleDetail";
import ProductAttrDetail from "./ProductAttrDetail";
import ProductRelationDetail from "./ProductRelationDetail";
import { createProduct, getProduct, upDateProduct } from "@/api/product";

const defaultProductParam = {};
export default {
  name: "ProductDetail",
  components: {
    ProductInfoDetail,
    ProductSaleDetail,
    ProductAttrDetail,
    ProductRelationDetail,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false, false],
    };
  },
  created() {
    if (this.isEdit) {
      getProduct(this.$route.query.id).then((response) => {
        this.productParam = response.data;
      });
    }
  },
  methods: {
    saveInput(parm) {
      let productInfo = this.$refs.productInfo;
      let productAttr = this.$refs.productAttr;

      let [infoVali, attrVali] = [null, null];
      productInfo.$refs["productInfoForm"].validate((valid) => {
        infoVali = valid;
      });
      productAttr.$refs["productAttrForm"].validate((valid) => {
        attrVali = valid;
      });
      if (infoVali && attrVali) {
        let copyInfo = JSON.parse(JSON.stringify(productInfo.ruleForm));
        let params = Object.assign(copyInfo, productAttr.ruleForm);
        if (!this.isEdit) {
          // 新建商品
          createProduct(params).then((res) => {
            this.$message({
              message: res.message,
              type: "success",
            });
            productInfo.setOrign();
            productAttr.setOrign();
            productInfo.$refs.productInfoForm.resetFields();
            productAttr.$refs.productAttrForm.resetFields();
          });
        } else {
          // 修改商品
          params._id = this.$route.query.id;
          upDateProduct(params).then((res) => {
            this.$message({
              message: res.message,
              type: "success",
            });
          });
        }
      }
    },
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit(isEdit) {
      this.$confirm("是否要提交该产品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (isEdit) {
          updateProduct(this.$route.query.id, this.productParam).then((response) => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000,
            });
            this.$router.back();
          });
        } else {
          createProduct(this.productParam).then((response) => {
            this.$message({
              type: "success",
              message: "提交成功",
              duration: 1000,
            });
            location.reload();
          });
        }
      });
    },
  },
};
</script>
<style>
.form-container {
  width: 1000px;
}
</style>
