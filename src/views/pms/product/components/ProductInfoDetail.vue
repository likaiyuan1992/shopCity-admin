<template>
  <div style="margin-top: 20px">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="productInfoForm"
      label-width="120px"
      style="width: 800px"
      size="small"
    >
      <el-form-item label="商品分类：" prop="productCategoryCode">
        <!-- <el-cascader v-model="selectProductCateValue" :options="productCateOptions">
        </el-cascader> -->
        <el-select v-model="ruleForm.productCategoryCode" placeholder="请选择">
          <el-option
            v-for="item in productCateOptions"
            :key="item.code"
            :label="item.classifyName"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="ruleForm.subTitle"></el-input>
      </el-form-item>

      <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="ruleForm.description"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input v-model="ruleForm.productSn"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="ruleForm.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input v-model="ruleForm.stock"></el-input>
      </el-form-item>
      <!-- <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item> -->
      <el-form-item label="商品重量：">
        <el-input v-model="ruleForm.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <!-- <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { fetchListWithChildren } from "@/api/productCate";
import { fetchList as fetchBrandList } from "@/api/brand";
import { getProduct } from "@/api/product";

export default {
  name: "ProductInfoDetail",
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false,
    },
    productParam: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ruleForm: {
        productCategoryCode: "",
        name: "",
        subTitle: "",
        description: "",
        productSn: "",
        price: "",
        originalPrice: "",
        stock: "",
        weight: "",
        sort: "",
      },
      hasEditCreated: false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 140, message: "长度在 2 到 140 个字符", trigger: "blur" },
        ],
        subTitle: [{ required: true, message: "请输入商品副标题", trigger: "blur" }],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        productCategoryCode: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
        brandId: [{ required: true, message: "请选择商品品牌", trigger: "blur" }],
        description: [{ required: true, message: "请输入商品介绍", trigger: "blur" }],
        requiredProp: [{ required: true, message: "该项为必填项", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getProductCateList();
    // this.getBrandList();
  },
  computed: {
    //商品的编号
    // productId() {
    //   return this.value._id;
    // },
  },
  watch: {
    productParam: {
      handler(val) {
        if (Object.keys(val).length && this.isEdit) {
          for (let key in this.ruleForm) {
            this.ruleForm[key] = val[key];
          }
        }
      },
      immediate: true,
    },
    productId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.productCategoryCode = newValue[1];
        this.value.productCategoryName = this.getCateNameById(
          this.value.productCategoryCode
        );
      } else {
        this.value.productCategoryCode = null;
        this.value.productCategoryName = null;
      }
    },
  },
  methods: {
    setOrign() {
      this.ruleForm = {
        productCategoryCode: "",
        name: "",
        subTitle: "",
        description: "",
        productSn: "",
        price: "",
        originalPrice: "",
        stock: "",
        weight: "",
        sort: "",
      };
    },
    //处理编辑逻辑
    handleEditCreated() {
      if (this.value.productCategoryCode != null) {
        this.selectProductCateValue.push(this.value.cateParentId);
        this.selectProductCateValue.push(this.value.productCategoryCode);
      }
      this.hasEditCreated = true;
    },
    getProductCateList() {
      fetchListWithChildren().then((response) => {
        this.productCateOptions = response.data;
      });
    },
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then((response) => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({ label: brandList[i].name, value: brandList[i].id });
        }
      });
    },
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.productCateOptions.length; i++) {
        for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
          if (this.productCateOptions[i].children[j].value === id) {
            name = this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("nextStep");
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    handleBrandChange(val) {
      let brandName = "";
      for (let i = 0; i < this.brandOptions.length; i++) {
        if (this.brandOptions[i].value === val) {
          brandName = this.brandOptions[i].label;
          break;
        }
      }
      this.value.brandName = brandName;
    },
  },
};
</script>

<style scoped></style>
