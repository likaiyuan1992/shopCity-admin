<template>
  <div style="margin-top: 20px">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="productAttrForm"
      label-width="120px"
      style="width: 800px"
      size="small"
    >
      <el-form-item label="商品规格：" prop="colorAttr">
        <el-card shadow="never" class="cardBg">
          颜色：
          <div>
            <el-radio
              v-model="ruleForm.colorAttr"
              v-for="colorItem in colorList"
              :label="colorItem"
              :key="colorItem"
              >{{ colorItem }}</el-radio
            >
          </div>
          <div class="addItem">
            <el-input v-model="addColor"></el-input>
            <el-button @click="addColorItem(addColor)">新增</el-button>
          </div>
          尺寸：
          <div>
            <el-radio
              v-model="ruleForm.sizeAttr"
              v-for="sizeItem in sizeList"
              :label="sizeItem"
              :key="sizeItem"
              >{{ sizeItem }}</el-radio
            >
          </div>
          <div class="addItem">
            <el-input v-model="addSize"></el-input>
            <el-button @click="addSizeItem(addSize)">新增</el-button>
          </div>
        </el-card>
      </el-form-item>

      <el-form-item label="商品相册：" prop="selectProductPics">
        <multi-upload
          @changeImg="getImg"
          :value="ruleForm.selectProductPics"
        ></multi-upload>
      </el-form-item>
      <el-form-item label="商品详细：" prop="detailHtml">
        <tinymce
          :width="800"
          :height="300"
          ref="tinynce"
          v-model="ruleForm.detailHtml"
        ></tinymce>
      </el-form-item>
    </el-form>
    <div class="saveBox"><el-button @click="save">保存</el-button></div>
  </div>
</template>

<script>
import { fetchList as fetchProductAttrCateList } from "@/api/productAttrCate";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import SingleUpload from "@/components/Upload/singleUpload";
import MultiUpload from "@/components/Upload/multiUpload";
import Tinymce from "@/components/Tinymce";

export default {
  name: "ProductAttrDetail",
  components: { SingleUpload, MultiUpload, Tinymce },
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
        colorAttr: "red",
        sizeAttr: "40x40x30",
        selectProductPics: [],
        detailHtml: "",
      },
      colorList: ["red", "blue", "black", "yellow"],
      sizeList: ["40x40x30"],
      addColor: "",
      addSize: "",
      rules: {
        colorAttr: [{ required: true, message: "请选择商品规格", trigger: "change" }],
        sizeAttr: [{ required: true, message: "请选择商品规格", trigger: "change" }],
        selectProductPics: [
          { required: true, message: "请选择商品相册", trigger: "change" },
        ],
        detailHtml: [{ required: true, message: "请输入商品详情", trigger: "blur" }],
      },
    };
  },
  computed: {},
  created() {
    // this.getProductAttrCateList();
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
  },
  methods: {
    setOrign() {
      this.ruleForm = {
        colorAttr: "red",
        sizeAttr: "40x40x30",
        selectProductPics: [],
        detailHtml: "",
      };
      this.addColor = "";
      this.addSize = "";
      this.$refs.tinynce.setContent("");
    },
    getImg(data) {
      if (data.length) {
        this.ruleForm.selectProductPics = data;
      }
    },
    save() {
      this.$emit("save", this.form);
    },
    addSizeItem(addSize) {
      if (addSize) {
        if (this.sizeList.includes(addSize)) {
          this.$message({
            message: "已存在相同尺寸",
            type: "warning",
          });
        } else {
          this.sizeList.push(addSize);
          this.addSize = "";
        }
      }
    },
    addColorItem(addColor) {
      if (addColor) {
        if (this.colorList.includes(addColor)) {
          this.$message({
            message: "已存在相同颜色",
            type: "warning",
          });
        } else {
          this.colorList.push(addColor);
          this.addColor = "";
        }
      }
    },
  },
};
</script>

<style>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
.addItem {
  display: flex;
  align-items: center;
}
.addItem .el-input {
  width: 120px;
  margin-right: 10px;
}
.saveBox {
  text-align: center;
}
</style>
