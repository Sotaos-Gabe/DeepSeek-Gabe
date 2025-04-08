<template>
  <div id="setting-container">
    <div style="padding: 5px; height: calc(100vh - 20px)">
      <el-button
        size="big"
        type="text"
        style="color: black;padding-bottom: 0px;"
        @click="back"
          >|<i class="el-icon-back el-icon--left"></i>
      </el-button>
      <el-row>
        <el-col :span="4" style="height: calc(100vh - 80px)">
        </el-col>
        <el-col :span="16" style="height: calc(100vh - 80px)">
          <el-tabs v-model="activeName" style="margin:15px;" type="border-card">
          <el-tab-pane :key="'gen'" :label="'新生成PPT'" :name="'gen'" style="overflow: auto;">
            <keep-alive>
              <el-row>
                <el-col v-if="step == 1" class="detail1" style="height: calc(100vh - 180px)">
                  <el-form
                  ref="form1"
                  :model="form1"
                  :rules="rules1"
                  size="small"
                  label-width="130px"
                  >
                    <el-form-item label="主题场景">
                      <el-input
                        v-model="theme"
                        style="width: 100%;"
                        placeholder="请输入主题">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                      <textarea
                        v-model="knowledge"
                        placeholder="请输入内容描述"
                        style="width: 100%; height: 300px; padding: 10px;border-color: #ccc;">
                      </textarea>
                    </el-form-item>
                    <!-- <el-form-item label="应用我的素材库">
                      <input type="checkbox" v-model="useLocalMaterial" style="margin-top: 10px;margin-right: 10px;"/>
                      <el-input
                        v-model="form1.keyword"
                        style="width: 180px;"
                        placeholder="输入过滤关键字">
                      </el-input>
                    </el-form-item>-->
                    <el-form-item> 
                      <el-button
                        style="float: right;"
                        size="small"
                        type="primary"
                        @click="nextStep(3)"
                      >
                        下一步
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col v-if="step == 3" class="detail1" style="height: calc(100vh - 180px)">
                  <h3 style="font-weight: bold;">课件风格选择</h3>
                  <el-row style="margin-bottom: 20px;margin-left: 50px;">
                    <div v-for="({code,name,image},index) in styleList" :key="name">
                      <el-col cols="auto" style="width: 230px; height: 150px;margin: 3px;">
                        <el-card style="cursor:pointer;" class="list-card" :class="{ 'is-selected': styleSelectedIndex === index }">
                          <el-image
                            @click="styleSelectedBtn(index)"
                            :src="image"
                          />
                        </el-card>
                      </el-col>
                    </div>
                  </el-row>
                  <el-form
                  ref="form4"
                  :model="form4"
                  :rules="rules1"
                  size="small"
                  label-width="20px"
                  >

                    <el-form-item>
                      <el-button
                        size="small"
                        type="primary"
                        @click="nextStep(1)"
                      >
                        上一步
                      </el-button>
                      <el-button
                        style="float: right;margin-right: 20px;"
                        size="small"
                        type="primary"
                        @click="nextStep(4)"
                      >
                        开始生成
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col v-if="step == 4" class="detail1" style="height: calc(100vh - 180px)">
                  <div style="height: 100%">
                    <div class="chatContent">
                      <div class="chatHistory" id="answer">
                        <div
                          class="con1"
                          v-for="(
                            { query,create_time, answer }, index
                          ) in chatList"
                        >
                          <div class="con1a">
                            <!-- <img src="/cloud-1.svg" alt="" /> -->
                            <div class="con1a1">
                              <div class="con1a1a">
                                <div>{{ query }}</div>
                                <span style="color: rgb(132, 132, 132); font-size: 14px">
                                  {{ create_time | formatDate }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="con1b">
                            <span style="margin-left: 30px;
                            width: 80px;
                            font-size: 18px;
                            font-weight: bold;">
                              <i class="el-icon-chat-line-round" /> 回答
                            </span>
                            <div class="con1b1">
                              <div
                              v-highlight
                              v-html="
                                answer
                                  ? answer
                                  : loading && index + 1 === chatList.length
                                  ? strLoading
                                  : '<p>暂无数据</p>'
                              "
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div v-if="suggestedQuestionList && suggestedQuestionList.data && suggestedQuestionList.data.length>0" style="padding-bottom: 20px;">
                          <div class="flex flex-wrap justify-center">
                            <div  v-for="question in suggestedQuestionList.data">
                              <button type="button" @click="sendSuggestQuestion(question)"
                                      class="btn disabled:btn-disabled btn-secondary-accent btn-medium mb-2 mr-2 last:mr-0">{{question}}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style="display: block;
                          padding-left: 10px;
                          padding-right: 10px;
                          gap: 10px;">
                        <div
                          id="message_input"
                          class="input2"
                          style="
                            display: flex;
                            align-items: center;
                            padding-left: 10px;
                            padding-right: 10px;
                            gap: 10px;
                          "
                        >
                          <el-input
                            ref="input"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 7 }"
                            placeholder="请在这里输入您的问题"
                            v-model="query"
                            resize="none"
                            @keydown.enter.native="keyDown"
                          >
                          </el-input>
                          <div class="input2a_1">
                            <el-button
                              class="input2a2_1"
                              v-if="loading"
                              type="primary"
                              size="mini"
                              @click="stop"
                              >停止</el-button
                            >
                            <div v-else class="input2a2_1" @click="send()">
                              <div class="in">发送</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane :key="'input'" :label="'输入大纲生成PPT'" :name="'input'" style="overflow: auto;">
            <keep-alive>
              <el-row>
                <el-col v-if="step == 1" class="detail1" style="height: calc(100vh - 180px)">
                  
                  <mavon-editor
                    v-model="outline"
                    :toolbars="markdownOption"
                    ref="md"
                    style="min-height: 500px; height: 90%;width: 100%;margin-bottom: 20px;"
                  />
                  <el-form
                  ref="form1"
                  :model="form1"
                  size="small"
                  label-width="130px"
                  >
                    <el-form-item> 
                      <el-button
                        style="float: right;"
                        size="small"
                        type="primary"
                        @click="nextStep(3)"
                      >
                        下一步
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col v-if="step == 3" class="detail1" style="height: calc(100vh - 180px)">
                  <h3 style="font-weight: bold;">课件风格选择</h3>
                  <el-row style="margin-bottom: 20px;margin-left: 50px;">
                    <div v-for="({code,name,image},index) in styleList" :key="name">
                      <el-col cols="auto" style="width: 230px; height: 150px;margin: 3px;">
                        <el-card style="cursor:pointer;" class="list-card" :class="{ 'is-selected': styleSelectedIndex === index }">
                          <el-image
                            @click="styleSelectedBtn(index)"
                            :src="image"
                          />
                        </el-card>
                      </el-col>
                    </div>
                  </el-row>
                  <el-form
                  ref="form4"
                  :model="form4"
                  :rules="rules1"
                  size="small"
                  label-width="20px"
                  >

                    <el-form-item>
                      <el-button
                        size="small"
                        type="primary"
                        @click="nextStep(1)"
                      >
                        上一步
                      </el-button>
                      <el-button
                        style="float: right;margin-right: 20px;"
                        size="small"
                        type="primary"
                        @click="nextStep(4)"
                      >
                        开始生成
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col v-if="step == 4" class="detail1" style="height: calc(100vh - 180px)">
                  <div style="height: 100%">
                    <div class="chatContent">
                      <div class="chatHistory" id="answer">
                        <div
                          class="con1"
                          v-for="(
                            { query,create_time, answer }, index
                          ) in chatList"
                        >
                          <div class="con1a">
                            <!-- <img src="/cloud-1.svg" alt="" /> -->
                            <div class="con1a1">
                              <div class="con1a1a">
                                <div>{{ query }}</div>
                                <span style="color: rgb(132, 132, 132); font-size: 14px">
                                  {{ create_time | formatDate }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="con1b">
                            <span style="margin-left: 30px;
                            width: 80px;
                            font-size: 18px;
                            font-weight: bold;">
                              <i class="el-icon-chat-line-round" /> 回答
                            </span>
                            <div class="con1b1">
                              <div
                              v-highlight
                              v-html="
                                answer
                                  ? answer
                                  : loading && index + 1 === chatList.length
                                  ? strLoading
                                  : '<p>暂无数据</p>'
                              "
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div v-if="suggestedQuestionList && suggestedQuestionList.data && suggestedQuestionList.data.length>0" style="padding-bottom: 20px;">
                          <div class="flex flex-wrap justify-center">
                            <div  v-for="question in suggestedQuestionList.data">
                              <button type="button" @click="sendSuggestQuestion(question)"
                                      class="btn disabled:btn-disabled btn-secondary-accent btn-medium mb-2 mr-2 last:mr-0">{{question}}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style="display: block;
                          padding-left: 10px;
                          padding-right: 10px;
                          gap: 10px;">
                        <div
                          id="message_input"
                          class="input2"
                          style="
                            display: flex;
                            align-items: center;
                            padding-left: 10px;
                            padding-right: 10px;
                            gap: 10px;
                          "
                        >
                          <el-input
                            ref="input"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 7 }"
                            placeholder="请在这里输入您的问题"
                            v-model="query"
                            resize="none"
                            @keydown.enter.native="keyDown"
                          >
                          </el-input>
                          <div class="input2a_1">
                            <el-button
                              class="input2a2_1"
                              v-if="loading"
                              type="primary"
                              size="mini"
                              @click="stop"
                              >停止</el-button
                            >
                            <div v-else class="input2a2_1" @click="send()">
                              <div class="in">发送</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane :key="'old'" :label="'已有PPT内容'" :name="'old'" style="overflow: auto;">
            <keep-alive>
              <div style="padding: 20px; height: calc(100% - 50px); overflow-y: auto">
                <el-form ref="form5" :inline="true" :model="form5" size="small">
                  <el-form-item label="名称" prop="name">
                    <el-input
                      v-model="form5.name"
                      style="width: 220px"
                      @keyup.enter.native="search"
                      placeholder="请输入大纲名称"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="search"> 搜索 </el-button>
                    <el-button @click="resetForm()"> 重置 </el-button>
                  </el-form-item>
                </el-form>
                <el-table
                  v-loading="listLoading"
                  border
                  :data="list"
                  element-loading-text="Loading"
                  fit
                  highlight-current-row
                >
                  <el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                      <span>{{ scope.row.name }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="生成时间">
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
                        @click="selectStyleTemplate(scope.row)"
                      >
                        选择风格模板导出
                      </el-button>
                      <el-button
                        style="margin-left: 6px"
                        size="small"
                        type="text"
                        @click="confirmDelete(scope.row)"
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
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        </el-col>
        <el-col :span="4" style="height: calc(100vh - 80px);">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" style="height: calc(100vh - 80px)">
        </el-col>

        <el-col :span="4" style="height: calc(100vh - 80px);">
        </el-col>
      </el-row>
    </div>
    <el-dialog
      width="500px"
      :title="'另存模板'"
      :visible.sync="saveAsOpenVisible"
    >
      <el-form
        ref="form3"
        :model="form3"
        :rules="rules3"
        size="small"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form3.name"
            placeholder="请输入名称"
            style="width: 300px"
            maxlength="50"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="saveAsOpenVisible = false"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveAsTemplate"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="'选择风格模板'"
      :visible.sync="visible"
    >
      <el-row style="margin-left: 40px;">
        <div v-for="({code,name,image},index) in styleList" :key="name">
          <el-col cols="auto" style="width: 230px; height: 150px;margin: 3px;">
            <el-card style="cursor:pointer;" class="list-card" :class="{ 'is-selected': styleSelectedIndex === index }">
              <el-image
                  @click="styleSelectedBtn(index)"
                :src="image"
              />
            </el-card>
          </el-col>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false"> 取 消 </el-button>
        <el-button
          size="small"
          type="primary"
          @click="expectPPT"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import { chatSseRequset } from "@/api/docinfo.js";
import { Container, Draggable } from "vue-smooth-dnd";
import { marked } from "marked";
import store from '@/store';
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import { getUuidStr } from "@/utils/uuid";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  console.log("dragResult", dragResult);
  const result = [...arr];
  let itemToAdd = payload;
  let itemTemp = arr[removedIndex];
  console.log("itemTemp", itemTemp);
  if (itemTemp.category === "title" || itemTemp.category === "contents") {
    return result;
  }
  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

export default {
  name: "pptDetail",
  components: { Container, Draggable, mavonEditor },
  data() {
    return {
      activeName: 'gen',
      query: "",
      loading: false,
      firstQuery: true,
      resultStr: "",
      conversation_id: "",
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      inputs: {},
      files: [], // 文件列表
      chatList: [],
      selectedIndex: 0,
      selectedSlice: undefined,
      saveAsOpenVisible: false,
      useLocalMaterial: false,
      checkedTemplate: "",
      sliceTemplateList: [
      {"id": "slice_template1","name": "单文本","category":"single"},
      {"id": "slice_template2","name": "QA文本","category":"qa"},
      ],
      slices: [{
        "title": {
          "content":"The main title of the courseware, for example: Unit1"
        },
        "category": "title",
        "texts": [],
      },{
        "title": {
          "content":"CONTENTS"
        },
        "category": "contents",
        "texts": [
          {
            "content":"PART 01 Warming up",
            "subtitleId": "aaaaaa"
          },
          {
            "content":"PART 02 Presentation",
            "subtitleId": "bbbbbb"
          },
          {
            "content":"PART 03 Let's talk",
            "subtitleId": "cccccc"
          },
          {
            "content":"PART 04 Practice",
            "subtitleId": "dddddd"
          },
          {
            "content":"PART 05 Quiz and homework",
            "subtitleId": "eeeeee"
          }
        ],
      },{
        "title": {
          "content":"PART 01 Warming up"
        },
        "category": "subtitle",
        "id": "aaaaaa",
        "texts": [],
      },{
        "title": {
          "content":"Warming up 1"
        },
        "category": "content",
        "texts": [
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          }
        ],
      },{
        "title": {
          "content":"Warming up 2"
        },
        "category": "content",
        "texts": [
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          }
        ],
      },{
        "title": {
          "content":"PART 02 Presentation"
        },
        "category": "subtitle",
        "id": "bbbbbb",
        "texts": [],
      },{
        "title": {
          "content":"Sentence Pattern"
        },
        "category": "content",
        "texts": [
          {
            "content":"content"
          },
          {
            "content":"content"
          }
        ],
      },{
        "title": {
          "content":"View and predict"
        },
        "category": "content",
        "texts": [
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          }
        ],
      },{
        "title": {
          "content":"Vocabulary look and say"
        },
        "category": "content",
        "texts": [
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          }
        ],
      },{
        "title": {
          "content":"New word and tips"
        },
        "category": "content",
        "texts": [
          {
            "content":"N. content"
          },
          {
            "content":"T. tip"
          },
          {
            "content":"N. content"
          },
          {
            "content":"T. tip"
          },
          {
            "content":"N. content"
          },
          {
            "content":"T. tip"
          }
        ],
      },{
        "title": {
          "content":"PART 03 Let's talk"
        },
        "category": "subtitle",
        "id": "cccccc",
        "texts": [],
      },{
        "title": {
          "content":"Let’s try"
        },
        "category": "content",
        "texts": [
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          }
        ],
      },{
        "title": {
          "content":"Make a similar dialogue & write"
        },
        "category": "content",
        "texts": [
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          }
        ],
      },{
        "title": {
          "content":"Think and say"
        },
        "category": "content",
        "texts": [
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          },
          {
            "content":"content"
          }
        ],
      },{
        "title": {
          "content":"PART 04 Practice"
        },
        "category": "subtitle",
        "id": "dddddd",
        "texts": [],
      },{
        "title": {
          "content":"Make a similar dialogue & write"
        },
        "category": "content",
        "texts": [
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          }
        ],
      },{
        "title": {
          "content":"Read and answer"
        },
        "category": "content",
        "texts": [
          {
            "content":"1.content"
          },
          {
            "content":"2.Question"
          },
          {
            "content":"3.Answer"
          }
        ],
      },{
        "title": {
          "content":"Read and fill"
        },
        "category": "content",
        "texts": [
          {
            "content":"Words"
          },
          {
            "content":"content are separated by commas"
          },
          {
            "content":"1.question"
          },
          {
            "content":"2.question"
          },
          {
            "content":"3.question"
          },
          {
            "content":"4.question"
          }
        ],
      },{
        "title": {
          "content":"Group work"
        },
        "category": "content",
        "texts": [
          {
            "content":"1.content"
          },
          {
            "content":"2.content"
          },
          {
            "content":"3.content"
          },
          {
            "content":"4.content"
          }
        ],
      },{
        "title": {
          "content":"PART 05 Quiz and homework"
        },
        "category": "subtitle",
        "id": "eeeeee",
        "texts": [],
      },{
        "title": {
          "content":"Ask and write"
        },
        "category": "content",
        "texts": [
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          },
          {
            "content":"Q. Question"
          },
          {
            "content":"A. Answer"
          }
        ],
      },{
        "title": {
          "content":"Homework"
        },
        "category": "content",
        "texts": [
          {
            "content":"1. Sentence example"
          },
          {
            "content":"2. Sentence example"
          }
        ],
      }],
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
      listLoading: false,
      templateLoading: false,
      knowledge: "",
      theme: "机器人的发展未来",
      step: 1,
      templateId: "",
      templateName: "",
      templateList: [],
      form1: {
        subject: "英语",
        grade: "五年级",
        semester: "上学期",
        unit: "一单元",
        keyword: "",
      },
      form2: {
      },
      rules1: {
      },
      form3: {
        name: "",
      },
      rules3: {
        name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
      },
      form4: {
      },
      form5: {
        name: "",
      },
      pageNum: 1,
      total: 0,
      pageSize: 10,
      visible: false,
      list: [],
      suggestedQuestionList: [],
      listLoading: false,
      outlineSelected: {},
      outline:"",
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示 HTML 源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 隐藏保存按钮
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
    };
  },
  created() {
    const conversation_id = this.$route.query.conversation_id;
    const askType = this.$route.query.askType;
    if (conversation_id && conversation_id != "" && askType) {
      this.conversation_id = conversation_id;
      this.step = 4;
      this.getAskHistoryRecords();
    }
    const params = this.getFromStorage();
    if (params) {
      this.form1 = JSON.parse(params);
    }
    this.getTemplateList();
    this.selectedSlice = this.slices[0];
    this.getListPPTJson();
  },
  methods: {
    back() {
      this.$router.replace({
        path: `/frontpage`,
      });
    },
    showCreatedTimes() {
    },
    getAskHistoryRecords() {
      this.$request({
        url: "/tech/api/yao/ask/getUserHistoryConversationRecords",
        method: "get",
        params: { conversation_id: this.conversation_id },
      })
      .then(({ code,data }) => {
        if (code == 200) {
          for (let i = 0; i < data.length; i++) {
            const answer = JSON.parse(data[i].answer);
            // data[i].answer = marked(answer[0].thought);
            console.log(answer);
            const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
            answer[0].answer = answer[0].answer.replace("```markdown", "").replace("```", "");
            var html1 = md.render(answer[0].answer);
            html1 = html1.replace(/<img/g, '<img style="max-width: 100%;height: auto;"');
            const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">').replace(/<img/g, "<img onerror=\"this.alt='图片生成出错了，可能涉及敏感信息，请完善提示词！'\"")
            data[i].answer = html;
          }
          this.chatList = data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    selectItem(index) {
      console.log("=======================selectItem=============================");
      console.log(index);
      this.selectedIndex = index;
      this.selectedSlice = this.slices[index];
    },
    styleSelectedBtn(index) {
      console.log("=======================styleSelectedBtn=============================");
      console.log(index);
      this.styleSelectedIndex = index;
    },
    getList() {
      this.listLoading = true;
      const params = {
        tags: this.form1.subject+","+this.form1.grade+","+this.form1.semester+","+this.form1.unit,
        // keyword: this.form1.keyword
      };
      this.$request({
        url: "/tech/api/yao/user/notebook/list",
        method: "get",
        params: params,
      })
        .then(({ data }) => {
          console.log("=======================getList=============================");
          console.log(data);
          this.listLoading = false;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              this.knowledge += data[i].content+'\n\n';
            }
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getTemplateList() {
      this.templateLoading = true;
      this.templateList = [];
      const params = {
        page: 1,
        limit: 1000
      };
      this.$request({
          url: "/tech/amp/reporttemplate/list",
          method: "get",
          params,
        }).then((res) => {
        this.templateLoading = false;
        for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].category == "courseware") {
              this.templateList.push(res.data.list[i]);
            }
          }
      })
      .catch((err) => {
        console.log(err);
        this.templateLoading = false;
      });
    },
    nextStep(value) {
      console.log("=======================Step=============================");
      console.log(value);
      if (value === 2) {
        // const jsonString = JSON.stringify(this.form1);
        // this.saveToStorage(jsonString);
        // if (this.knowledge === "") {
        //   this.$message.error("请输入知识点");
        //   return;
        // }
        if (this.theme === "") {
          this.$message.error("请输入主题场景");
          return;
        }
        if (this.useLocalMaterial) {
          const datas = {
            page: 1,
            page_size: 100,
          };
          // datas.tags=this.form1.subject+","+this.form1.grade+","+this.form1.semester+","+this.form1.unit;
          datas.keyword = this.form1.keyword;
          this.$request({
            url: "/tech/api/yao/resource/getFilesByFileName",
            method: "post",
            data: datas,
          })
          .then(({ data: { list } }) => {
            for (let i = 0; i < list.length; i++) {
              this.files.push(list[i].file_url);
            }
          })
          .catch(() => {
          });
        }

      }
      if (value === 3) {
        if (this.activeName == "input" && this.outline === "") {
          this.$message.error("请输入大纲内容");
          return;
        }
      }
      if (value === 4) {
        let lang = "中文";
        // if (this.form1.subject === "英语") {
        //   lang = "英文";
        // }
        this.firstQuery = true;
        this.query = `请按照主题和描述生成一份PPT，用${lang}输出，PPT的主题是 ${ this.theme }，\n描述为：\n${ this.knowledge }`;
        let template = "\n";
        // for (let i = 0; i < this.slices.length; i++) {
        //   if (this.slices[i].category === "title") {
        //     template += "#"+this.slices[i].title.content + "\n\n";
        //   } else if (this.slices[i].category === "subtitle") {
        //     template += "##"+this.slices[i].title.content + "\n\n";
        //   } else if (this.slices[i].category === "contents") {
        //     template += "##"+this.slices[i].title.content + "\n\n";
        //     for (let j = 0; j < this.slices[i].texts.length; j++) {
        //       template += "- "+this.slices[i].texts[j].content + "\n";
        //     }
        //   }else {
        //     template += "###"+this.slices[i].title.content + "\n";
        //     for (let j = 0; j < this.slices[i].texts.length; j++) {
        //       template += "- "+this.slices[i].texts[j].content + "\n";
        //     }
        //   }
        // }
        this.inputs["template"] = template;
        this.inputs["ppt_style_template"] = this.styleList[this.styleSelectedIndex].code;
        this.inputs["files"] = this.files.join(" \n ");
        this.send();
      }
      this.step = value;
    },
    selectedTemplate(name,value) {
      this.slices = JSON.parse(value);
      this.selectedIndex = 0;
      this.templateName = name;
      this.selectedSlice = this.slices[0];
    },
    saveTemplateBtn() {
      this.$request({
          url: "/tech/amp/reporttemplate/update",
          method: "post",
          data: { id: this.templateId, name: this.templateName, content: JSON.stringify(this.slices) },
        })
        .then(({ data }) => {
          this.$message.success("保存成功");
        })
        .catch(() => {});
    },
    deleteTemplate(index, id) {
      this.$confirm("确定删除此模板吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          const data = {
            id: id,
            status: -1
          };

          this.$request({
            url: "/tech/amp/reporttemplate/update",
            method: "post",
            data,
          }).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.templateList.splice(index, 1);
              }
            })
            .catch((err) => {
              this.$message.error("删除失败!请重试...");
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      return false;
    },
    addSliceBtn(category,index) {
      console.log(index);
      if (category === "single") {
        const newObj = {
          title: {
            content: "Title"
          },
          category: "content",
          texts: [
            {
              content: "content"
            }
          ]
        };
        this.slices.splice(index + 1, 0, newObj);
      } else if (category === "qa") {
        const newObj = {
          title: {
            content: "Title"
          },
          category: "content",
          texts: [
            {
              content: "Q. Question"
            },
            {
              content: "A. Answer"
            }
          ]
        };
        this.slices.splice(index + 1, 0, newObj);
      }
    },
    removeSlice(index, category) {
      if (category === "subtitle") {
        for (let i = 0; i < this.slices[1].texts.length; i++) {
          if (this.slices[1].texts[i].subtitleId === this.slices[index].id) {
            this.slices[1].texts.splice(i, 1);
            break;
          }
        }
        this.slices.splice(index, 1);
      }else {
        if (this.slices[index-1].category === "subtitle" && (index === this.slices.length - 1 || this.slices[index+1].category === "subtitle")) {
          this.$message.warning("不能删除,子标题下面必须要有内容页");
          return;
        }
        this.slices.splice(index, 1);
      }
    },
    handleTextChange(index){
      console.log("=======================handleTextChange============================");
      if (this.selectedSlice.category === "contents") {
        for (let i = 1; i < this.slices.length; i++) {
          if (this.slices[i].id === this.selectedSlice.texts[index].subtitleId) {
            this.slices[i].title.content = this.selectedSlice.texts[index].content;
          }
        }
      }
    },
    saveAsOpenBtn() {
      this.saveAsOpenVisible = true;
      this.form3.name = "";
    },
    saveAsTemplate() {
      this.$refs["form3"].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form3.name,
            category: "courseware",
            content: JSON.stringify(this.slices)
          };
          this.$request({
            url: "/tech/amp/reporttemplate/create",
            method: "post",
            data: params,
          })
            .then(({ data }) => {
              this.$message.success("另存成功");
              this.saveAsOpenVisible = false;
              this.getTemplateList();
          })
          .catch((err) => {
            console.log(err);
          });
        }
      });
    },
    addSliceTextBtn() {
      if (this.slices[this.selectedIndex].category === "contents") {
        const newObj = {
          title: {
            content: "Sub Title"
          },
          category: "subtitle",
          id: getUuidStr(),
          texts: []
        };
        this.slices.splice(this.slices.length, 0, newObj);
        this.addSliceBtn("single",this.slices.length)
        this.slices[this.selectedIndex].texts.push({
          content: "Sub Title",
          subtitleId: newObj.id
        })
      } else {
        this.slices[this.selectedIndex].texts.push({
          content: "content"
        })
      }
    },
    addSliceQATextBtn() {
      this.slices[this.selectedIndex].texts.push({
        content: "Q. Question"
      },{
        content: "A. Answer"
      });
    },
    onDrop(dropResult) {
      this.slices = applyDrag(this.slices, dropResult);
    },
    saveToStorage(value) {
      localStorage.setItem("knowledge_form1_data", value);
    },
    getFromStorage() {
      return localStorage.getItem("knowledge_form1_data") || '';
    },
    stop() {
      this.resultStr = "";
      this.loading = false;
      console.log("=======================stop=============================");
    },
    sendSuggestQuestion(msg){
      this.query = msg;
      this.send();
    },
    send() {
      this.suggestedQuestionList = [];
      let extra = null;
      if (!this.query.trim() && !extra)
        return this.$toast.show("请输入内容！", undefined, true);
      this.loading = true;
      this.resultStr = "";
      if (this.firstQuery) {
        this.firstQuery = false;
        this.chatList = [
          ...this.chatList,
          {
            query: this.theme,
            create_time: new Date(),
            answer: "",
            ...(extra || {}),
          },
        ];
      } else {
        this.chatList = [
          ...this.chatList,
          {
            query: this.query,
            create_time: new Date(),
            answer: "",
            ...(extra || {}),
          },
        ];
      }

      this.connectToChatSSE("3");
    },
    connectToChatSSE(ask_type) {
      this.loading = true;
      const json = {
        query: this.query,
        ask_type: ask_type,
        inputs: this.inputs,
        conversation_id: this.conversation_id,
      }
      this.query = "";
      console.log("=======================connectToChatSSE=============================");
      chatSseRequset(json, this.successCallback, this.errCallback);
    },
    successCallback(msg) {
      if (msg.event == "stop") {
        if (this.resultStr.lastIndexOf("请回复“满意”")>-1 || this.resultStr.lastIndexOf("请回复'满意'")>-1 || this.resultStr.lastIndexOf("请回复\"满意\"")>-1){
          console.log("=======================满意=============================");
          this.suggestedQuestionList = {"data":["满意"]}
        }
        this.stopCallback();
      }else {
        // this.loading = false;
        if (msg.data.includes('conversation_id')) {
          const data = JSON.parse(msg.data);
          if (data.event.includes("message") && data.event != "message_end") {
            this.resultStr += data.answer;
            const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
            console.log(this.resultStr);
            this.resultStr = this.resultStr.replace("```markdown", "").replace("```", "");
            var html1 = md.render(this.resultStr);
            this.conversation_id = data.conversation_id;
            this.$set(this.chatList, this.chatList.length - 1, {
              ...this.chatList[this.chatList.length - 1],
              answer: html1,
            });
          } else if (data.event == "node_started") {
            this.nodes = [
              ...this.nodes,
              {
                node_id: data.node_id,
                title: data.title,
                node_type: data.node_type,
                status: "processing",
                elapsed_time: 0,
              },
            ];
          } else if (data.event == "node_finished") {
            this.$set(this.nodes, this.nodes.length - 1, {
              ...this.nodes[this.nodes.length - 1],
              status: data.status,
              elapsed_time: data.elapsed_time,
            });
          }
        }
      }
    },
    stopCallback() {
      this.loading = false;
      const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
      console.log(this.resultStr);
      this.resultStr = this.resultStr.replace("```markdown", "").replace("```", "");
      var html1 = md.render(this.resultStr);
      const html = html1.replace(/<img/g, '<img style="max-width: 100%;height: auto;"');
      console.log(html);
      this.$set(this.chatList, this.chatList.length - 1, {
          ...this.chatList[this.chatList.length - 1],
          answer: html,
        });
      this.stop();
    },
    errCallback(err) {
      this.stop();
      console.log(err, "---");
    },
    keyDown(e) {
      if (this.showDialog) {
        e.preventDefault();
      }else if (!e.shiftKey && !this.loading) {
        this.send();
        e.preventDefault();
      }
    },
    scrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("answer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    expectPPT() {
      this.visible = false;
      const data = {
        user_id:store.getters.userId,
        title:this.outlineSelected.name,
        template:this.styleList[this.styleSelectedIndex].code,
        message:this.outlineSelected.ppt_json
      }
      this.$request({
        url: "/ppt/v1/yaovia/ppt/ask_export_ppt",
        method: "post",
        data: data,
      })
        .then((res) => {
          this.$message.success("生成PPT成功!");
          this.$router.replace({
            path: `/articles`,
          });
        })
    },
    confirmDelete(row) {
      this.$confirm("确定删除该PPT大纲?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/ppt/v1/yaovia/delpptjson",
            method: "post",
            data: {
              _id: row._id,
            },
          })
            .then(() => {
              this.$message.success("删除成功");
              this.getListPPTJson();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListPPTJson();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getListPPTJson();
    },
    search() {
      this.pageNum = 1;
      this.getListPPTJson();
    },
    getListPPTJson() {
      this.listLoading = true;
      const params = {
        page: this.page_no,
        page_size: this.page_size,
        user_id: store.getters.userId,
      };
      if (this.form5.name) {
        params.name = this.form5.name;
      }
      this.$request({
        url: "/ppt/v1/yaovia/pptjsons",
        method: "get",
        params,
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
    resetForm() {
      this.form5 = {
        name: "",
      };
      this.pageNum = 1;
      this.getListPPTJson();
    },
    selectStyleTemplate(row) {
      this.visible = true;
      this.outlineSelected = row;
    },
  },
  watch: {
    loading(value) {
      this.scrollBottom();
    },
    chatList() {
      this.scrollBottom();
    },
    suggestedQuestionList() {
      this.scrollBottom();
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/dark-light.scss";
@import "@/styles/theme.scss";
@import "@/styles/chat.scss";
#setting-container {
.detail1 ::v-deep .el-card__body {
  height: 100%;
}
.chatHistory {
  flex: 1;
  overflow: auto;
}
.chatContent {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
.list-item {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 10px;
  // margin-left: 10px;
  // padding-left: 10px;
  // margin-right: 0px;
  // padding-top: 5px;
  // border-radius: 6px;
  font-size: 12px;
  .label {
    margin-left: 5px;
  }
  .right-box {
    align-items: center;
    color: #B2B8D0;
    display: none;
    padding: 0;
    .el-button {
      margin-right: 5px;
    }
  }
  .left-box {
    width: 100%;
    // margin-top: 10px;
    // margin-bottom: 10px;
  }
}
.list-item:hover {
  background-color: #F7F7F9;
  .right-box {
    display: flex;
  }
}
.list-item.is-selected {
  background-color: #dcdcde;
  .right-box {
    display: flex;
  }
}
  .flex {
    display: flex;
  }
  .mb-2\.5 {
    margin-bottom: .625rem;
  }
  .items-center {
    align-items: center;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .py-2 {
    padding-top: .5rem;
    padding-bottom: .5rem;
    justify-content: center;
  }
  .justify-center {
    justify-content: center;
  }
  .font-medium {
    font-weight: 500;
    font-size: 13px;
  }
  .text-gray-500 {
    --tw-text-opacity: 1;
    color: rgb(102 112 133 / var(--tw-text-opacity));
  }
  .btn-medium {
    height: 2rem;
    border-width:.5px;
    border-radius: .5rem;
    padding-left: .875rem;
    padding-right: .875rem;
    font-size: 13px;
    margin-left: 10px;
    color:#155aef;
    background-color:#fff;
    border-color: inherit;
    --tw-shadow: 0px 1px 2px 0px rgba(16,24,40,.05);
    --tw-shadow-colored: 0px 1px 2px 0px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)
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
.draggable-item {
  width: 100%;
  height: 150px;
  display: block;
  background-color: #fff;
  outline: 0;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 2px;
  margin-top: 2px;
  cursor: default;
  user-select: none;
  cursor: pointer;
  display: flex;
  // align-items: center;
  justify-content: space-between;
}
textarea::placeholder {
    color: #ccc;
    opacity: 1;
}
a {
  text-decoration: underline;
  color: blue;
}
a:hover {
  text-decoration: underline;
  color: rgb(113, 170, 240);
}
}
</style>
