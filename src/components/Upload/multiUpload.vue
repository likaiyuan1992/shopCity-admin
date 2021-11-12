<template>
   
  <div>
    <el-upload
      :action="useOss ? ossUploadUrl : minioUploadUrl"
      :data="useOss ? dataObj : null"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { policy } from "@/api/oss";
import { getToken } from "@/utils/auth";
export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      dataObj: {
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
      },
      dialogVisible: false,
      dialogImageUrl: null,
      useOss: false, //使用oss->true;使用MinIO->false
      ossUploadUrl: "http://macro-oss.oss-cn-shenzhen.aliyuncs.com",
      minioUploadUrl: process.env.BASE_API + "/admin/upload",
    };
  },
  computed: {
    fileList() {
      if (!this.value.length) return [];
      let fileList = [];
      for (let i = 0; i < this.value.length; i++) {
        fileList.push(this.value[i]);
      }
      return fileList;
    },
    headers() {
      return {
        Authorization: getToken(),
      };
    },
  },
  methods: {
    emitInput() {
      this.$emit("changeImg", this.fileList);
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].url === file.url) {
          this.fileList.splice(i, 1);
        }
      }
      this.emitInput();
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    beforeUpload(file) {
      let _self = this;
      if (!this.useOss) {
        //不使用oss不需要获取策略
        return true;
      }
      return new Promise((resolve, reject) => {
        policy()
          .then((response) => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
            _self.dataObj.key = response.data.dir + "/${filename}";
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data.host;
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      });
    },
    handleUploadSuccess(res, file) {
      // let url = this.dataObj.host + "/" + this.dataObj.dir + "/" + file.filename;
      let url = res.filename;
      this.fileList.push({ url: url, uid: file.uid, name: file.name });
      this.emitInput();
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "最多只能上传" + this.maxCount + "张图片",
        type: "warning",
        duration: 1000,
      });
    },
  },
};
</script>
<style></style>
