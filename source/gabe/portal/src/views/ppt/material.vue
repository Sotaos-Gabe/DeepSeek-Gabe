<template>
  <div class="home-container">
    <el-row>
      <el-col :span="24" style="height: 100vh">
        <div style="padding: 20px; height: calc(100% - 50px); overflow-y: auto">
          <el-form ref="form1" :inline="true" :model="form1" size="small">
            <el-form-item style="margin-bottom: 0px;">
              <el-button 
                size="big"
                type="text" 
                style="color: black;padding-top: 0px;"
                @click="back"
                  >|<i class="el-icon-back el-icon--left"></i>
              </el-button>
            </el-form-item>
            <el-form-item label="名称或标签" prop="name" style="margin-bottom: 0px;">
              <el-input
                v-model="form1.name"
                style="width: 220px"
                @keyup.enter.native="search"
                placeholder="请输入素材名称或者标签"
                clearable
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 0px;">
              <el-button type="primary" @click="search"> 搜索 </el-button>
              <el-button @click="resetForm()"> 重置 </el-button>
              <el-button type="primary" @click="search"> 刷新 </el-button>
            </el-form-item>
            
          </el-form>
          <div style="justify-content: end;display: flex;width: 100%;margin-bottom: 5px;">
              <el-button size="small" type="primary" @click="addFileInfoBtn('image')""> 上传图片 </el-button>
              <el-button size="small" type="primary" @click="addFileInfoBtn('audio')"> 上传音频 </el-button>
              <el-button size="small" type="primary" @click="addFileInfoBtn('video')"> 上传视频 </el-button>
            </div>
          <el-table
            v-loading="listLoading"
            border
            :data="list"
            element-loading-text="Loading"
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="文件名称">
              <template slot-scope="scope">
                <span>{{ scope.row.file_name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文件">
              <template slot-scope="scope">
                <el-image
                  v-if="scope.row.category == 'image'"
                  style="
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                  "
                  :src="scope.row.file_url"
                  :preview-src-list="[scope.row.file_url]"
                  @click="handleClickItem"
                >
                </el-image>
                <audio
                  v-if="scope.row.category == 'audio'"
                  style="
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                  "
                  :src="scope.row.file_url"
                  ref="audioPlayer"
                  controls
                ></audio>
                <video
                  v-if="scope.row.category == 'video'"
                  class="video-box"
                  :src="scope.row.file_url"
                  style="
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                  "
                  @click="
                    () => {
                      videoUrl = scope.row.file_url;
                      videoVisible = true;
                    }
                  "
                ></video>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文件大小(MB)">
              <template slot-scope="scope">
                <span>{{ (scope.row.file_size/1024/1024).toFixed(3) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文件类型">
              <template slot-scope="scope">
                <span>{{ scope.row.category }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文件标签">
              <template slot-scope="scope">
                <span>{{ scope.row.tags }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上传时间">
              <template slot-scope="scope">
                <div>{{ scope.row.create_time | formatDate }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="editFileInfo(scope.row,scope.$index)"
                >
                  修改
                </el-button>
                <el-button
                  style="margin-left: 6px"
                  size="small"
                  type="text"
                  @click="confirmDelete(scope.row,scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="margin-top-20 text-align-right">
            <el-pagination
              :current-page="pageNum"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="上传图片"
      :visible.sync="imageUploadVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload_box">
        <el-upload
          class="upload-demo"
          drag
          accept=".png,.jpg,.jpeg"
          action="#"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadfileFn"
          :multiple="false"
          :file-list="materialList"
          :on-remove="handleRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将图片拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传png,jpg,jpeg图片,且每次只能上传一个
          </div>
        </el-upload>
        <div style="display: flex;align-items: center;margin-left: 10px;">
          添加标签：
          <el-input
            v-model="tags"
            placeholder="多个标签用逗号隔开！"
            style="width: 200px;"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadCloseFn('image')">
          取 消
        </el-button>
        <i v-if="uploadFileLoading" class="el-icon-loading" />
        <el-button
          size="small"
          type="primary"
          :loading="upBtnLoading"
          :disabled="upBtnDisabled || files.length == 0"
          @click="uploadAddFn('image')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="上传音频"
      :visible.sync="audioUploadVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload_box">
        <el-upload
          class="upload-demo"
          drag
          accept=".mp3,.mp4,.wav,.wma"
          action="#"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadfileFn"
          :multiple="false"
          :file-list="materialList"
          :on-remove="handleRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将音频文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传MP3、MP4、WMA和WAV‌‌音频文件,且每次只能上传一个
          </div>
        </el-upload>
        <div style="display: flex;align-items: center;margin-left: 10px;">
          添加标签：
          <el-input
            v-model="tags"
            placeholder="多个标签用逗号隔开！"
            style="width: 200px;"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadCloseFn('audio')">
          取 消
        </el-button>
        <i v-if="uploadFileLoading" class="el-icon-loading" />
        <el-button
          size="small"
          type="primary"
          :loading="upBtnLoading"
          :disabled="upBtnDisabled || files.length == 0"
          @click="uploadAddFn('audio')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="上传视频"
      :visible.sync="videoUploadVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="upload_box">
        <el-upload
          class="upload-demo"
          drag
          accept=".mp4,.swf,.wmv,.avi,.mov"
          action="#"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadfileFn"
          :multiple="false"
          :file-list="materialList"
          :on-remove="handleRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将视频文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传MP4、SWF、AVI、MOV和WAV‌‌视频文件,且每次只能上传一个
          </div>
        </el-upload>
        <div style="display: flex;align-items: center;margin-left: 10px;">
          添加标签：
          <el-input
            v-model="tags"
            placeholder="多个标签用逗号隔开！"
            style="width: 200px;"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadCloseFn('video')">
          取 消
        </el-button>
        <i v-if="uploadFileLoading" class="el-icon-loading" />
        <el-button
          size="small"
          type="primary"
          :loading="upBtnLoading"
          :disabled="upBtnDisabled || files.length == 0"
          @click="uploadAddFn('video')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="'修改标签'"
      :visible.sync="visible"
    >
      <el-form
        ref="form2"
        :model="form2"
        label-width="100px"
      >
        <el-form-item label="标签名称">
          <el-input
            v-model="form2.tags"
            placeholder="请输入标签名称，多个标签用逗号隔开！"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="updatedFileTags"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="视频预览"
      destroy-on-close
      :visible.sync="videoVisible"
      width="640px"
    >
      <video
        style="width: 600px; height: 400px"
        :src="videoUrl"
        controls
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import store from '@/store'
import { uploadFile } from "@/api/docinfo.js";
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      form1: {
        name: "",
      },
      form2: {
        tags: "",
        file_id: "",
      },
      tags: "",
      pageNum: 1,
      total: 0,
      pageSize: 10,
      visible: false,
      addLoading: false,
      uploadLoading: false,
      username: "",
      outlineSelected: {},
      styleSelectedIndex: 0,
      styleList:[
        {"code": "edu_template1","name": "经典淡蓝","image":"/img/edu_template1.jpg"},
        {"code": "edu_template2","name": "有趣卡通","image":"/img/edu_template2.jpg"},
        {"code": "beige","name": "经典米黄","image":"/img/beige.jpg"},
        {"code": "bubbles","name": "可爱泡泡","image":"/img/bubbles.jpg"},
        {"code": "blue","name": "蓝色风雅","image":"/img/blue.jpg"},
        {"code": "lively","name": "活泼可爱","image":"/img/lively.jpg"},
        {"code": "green","name": "绿色经典","image":"/img/green.jpg"},
        {"code": "refreshing_green","name": "绿色清新","image":"/img/refreshing_green.jpg"},
        {"code": "warm_red","name": "温馨红色","image":"/img/warm_red.jpg"},
        {"code": "warm_family","name": "温馨家庭","image":"/img/warm_family.jpg"},
      ],
      imageUploadVisible: false,
      audioUploadVisible: false,
      videoUploadVisible: false,
      upBtnDisabled: false,
      upBtnLoading: false,
      uploadFileLoading: false,
      materialList: [],
      files: [],
      videoVisible: false,
      videoUrl: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },

  methods: {
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    resetForm() {
      this.form1 = {
        name: "",
      };
      this.pageNum = 1;
      this.getList();
    },
    handleRemove(file, fileList) {
      console.log('文件被删除:', file);
      console.log('当前文件列表:', fileList);
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].file_name === file.name) {
          this.files.splice(i, 1);
          break;
        }
      }
      console.log('当前文件列表:', this.files);
    },
    handleClickItem() {
      this.$nextTick(() => {
        const mask = document.querySelector(".el-image-viewer__mask");
        if (mask) {
          mask.addEventListener("click", () => {
            const closeBtn = document.querySelector(".el-image-viewer__close");
            if (closeBtn) {
              closeBtn.click();
            }
          });
        }
      });
    },
    confirmDelete(row,index) {
      this.$confirm("确定删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/tech/api/yao/resource/delete",
            method: "post",
            data: {
              file_id: row.file_id,
            },
          })
            .then(() => {
              this.list.splice(index,1)
              this.total = this.total - 1
              this.$message.success("删除成功");
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    search() {
      this.pageNum = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      const datas = {
        page: this.pageNum,
        page_size: this.pageSize,
      };
      if (this.form1.name) {
        datas.keyword = this.form1.name;
      }
      this.$request({
        url: "/tech/api/yao/resource/getFilesByFileName",
        method: "post",
        data: datas,
      })
        .then(({ data: { list, total } }) => {
          this.listLoading = false;
          this.list = list;
          this.total = total;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    addFileInfoBtn(category) {
      if (category === "image") {
        this.imageUploadVisible = true;
      } else if (category === "audio") {
        this.audioUploadVisible = true;
      } else if (category === "video") {
        this.videoUploadVisible = true;
      }
      this.upBtnLoading = false;
      this.upBtnDisabled = true;
    },
    beforeAvatarUpload(file) {
      this.file_size = file.size;
      const isLt2M = file.size / 1024 / 1024 <= 5;
      if (!isLt2M) {
        this.$message.error("上传文档大小不能超过 5MB!");
      }
      return isLt2M;
    },
    uploadfileFn(params) {
      const forms = new FormData();
      forms.append("file", params.file);
      this.uploadFileLoading = true;
      uploadFile(forms)
      .then((res) => {
          console.log(res, 'uploadfile')
          if (res.code === 200) {
            this.files.push(res.data)
            this.upBtnDisabled = false;
          }
          this.uploadFileLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.uploadFileLoading = false;
        });
    },
    uploadAddFn(category) {
      this.upBtnLoading = true;
      for (let i = 0; i < this.files.length; i++) {
        this.files[i].category = category;
        this.files[i].tags = this.tags;
      }
      const data = {
        files: this.files,
      };

      this.$request({
            url: "/tech/api/yao/resource/save",
            method: "post",
            data,
          }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: "文件添加成功!",
              type: "success",
            });
            this.uploadCloseFn(category);
            this.file_size = 0;
            this.pageNum = 1;
            this.getList();
          }
          // console.log(res, 'addfile')
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadCloseFn(category) {
      if (category === "image") {
        this.imageUploadVisible = false;
      } else if (category === "audio") {
        this.audioUploadVisible = false;
      } else if (category === "video") {
        this.videoUploadVisible = false;
      }
      this.materialList = [];
      this.files = [];
      this.tags = "";
    },
    editFileInfo(row,index) {
      this.visible = true;
      this.form2 = row;
      this.form2.index = index;
      console.log(row, "row");
    },
    updatedFileTags() {
      this.visible = false;
      const data = {
        file_id: this.form2.file_id,
        tags: this.form2.tags,
      };
      this.$request({
            url: "/tech/api/yao/resource/update",
            method: "post",
            data,
          }).then((res) => {
          if (res.code === 200) {
            this.list[this.form2.index].tags = this.form2.tags;
            this.$message({
              message: "文件修改成功!",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding-left: 20px;
}
list-card {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.list-card:hover {
  background-color: #F7F7F9;
  .right-box {
    display: flex;
  }
}
.list-card.is-selected {
  background-color: #dcdcde;
  .right-box {
    display: flex;
  }
}
.upload_box {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
.el-upload-list__item .el-icon-close {
  display: absolute;
  top: -9999px;
  right: -9999px;
}
</style>
