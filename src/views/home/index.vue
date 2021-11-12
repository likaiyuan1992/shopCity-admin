<template>
  <div class="app-container">
    <h3>
      轮播设置
      <el-button style="margin-left: 20px" @click="dialogVisible = true" type=""
        ><i class="el-icon-plus"></i> 新增</el-button
      >
    </h3>

    <div class="bannerSet flex flex_wrap">
      <div v-for="(bnnerItem, index) in bannerData" :key="index">
        <i class="el-icon-close banner_del" @click="delteBannerSet(index)"></i>
        <img :src="bnnerItem.bannerUrl" class="image avatarBanner" />
        <div style="padding: 14px">
          <div>{{ bnnerItem.title }}</div>
          <span>{{ bnnerItem.content }}</span>
        </div>
      </div>
    </div>
    <p style="text-align: center">
      <el-button @click="saveSetBanner">保存</el-button>
    </p>
    <el-dialog title="新增轮播" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="图片：" prop="bannerUrl">
          <el-upload
            class="avatar-uploader"
            :action="baseApi + '/admin/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="{ Authorization: getToken() }"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="ruleForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBanner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { setBanner, bannerList } from "@/api/homebrand";

export default {
  data() {
    return {
      baseApi: process.env.BASE_API,
      ruleForm: {
        bannerUrl: "",
        title: "",
        content: "",
      },
      imageUrl: "",
      bannerData: [],
      dialogVisible: false,
      rules: {
        bannerUrl: [{ required: true, message: "请选择图片", trigger: "blur" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getBannerList();
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.$nextTick(() => {
          this.ruleForm.bannerUrl = "";
          this.imageUrl = "";
          this.$refs.ruleForm.resetFields();
        });
      }
    },
  },
  methods: {
    getToken,
    getBannerList() {
      bannerList().then((res) => {
        this.bannerData = res.data;
      });
    },
    saveSetBanner() {
      setBanner({ bannerData: this.bannerData }).then((res) => {
        this.$message({
          message: res.message,
          type: "success",
        });
      });
    },
    delteBannerSet(index) {
      this.bannerData.splice(index, 1);
    },
    saveBanner() {
      this.$refs.ruleForm.validate((vali) => {
        if (vali) {
          this.bannerData.push(JSON.parse(JSON.stringify(this.ruleForm)));
          this.dialogVisible = false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.filename;
      this.ruleForm.bannerUrl = this.imageUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  display: block;
  width: 175px;
  height: 175px;
}
.avatarBanner {
  display: inline-block;
  width: 100%;
  height: 300px;
}
.bannerSet {
  display: flex;
  flex-wrap: wrap;
}
.bannerSet > div {
  margin-right: 15px;
  position: relative;
  box-shadow: 0 0 10px #ccc;
}
.banner_del {
  position: absolute;
  right: 4px;
  top: 4px;
  cursor: pointer;
}
</style>
