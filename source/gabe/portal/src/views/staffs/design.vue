<template>
  <div class="detail-container">
    <div style="padding: 20px; height: calc(100vh - 40px)">
      <el-row style="margin-bottom: 10px">
        <el-col :span=6
          ><el-button type="primary" size="small" @click="back"
            ><i class="el-icon-back el-icon--left"></i>返回</el-button
          >
          {{ name }}
          <span style="color: rgb(132, 132, 132); font-size: 14px"
            >（Auto-saved {{ new Date() | formatDate }}）</span
          ></el-col
        >
        <el-col
          :span=18
          style="text-align: right; display: flex; justify-content: flex-end"
        >
          <el-button type="primary" @click="release_visible = true" size="small"
            >公开发布</el-button
          ></el-col
        >
      </el-row>
      <el-row :gutter="12" style="height: 100%">
        <el-col class="detail1" :span=9 style="height: 100%">
          <el-card style="height: 100%" shadow="never">
            <div class="detail1a">
              <div>
                人设与回复逻辑
              </div>
              <el-card shadow="always" class="detail1a1">
                <div class="chatContent">
                  <el-input
                    style="margin-top: 5px"
                    type="textarea"
                    resize="none"
                    :rows="26"
                    placeholder="请输入Prompt"
                    v-model="prompt"
                    :disabled="loading"
                    id="prompt">
                  </el-input>
                </div>
              </el-card>
            </div>
          </el-card>
        </el-col>
        <el-col :span=6 style="height: 100%">
          <el-card class="card-prompt" style="height: 100%" shadow="never">
            <div style="display: flex; flex-direction: column; height: 100%">
              <div>
                关联选择
              </div>
              <div>
                报告模板
                <el-select
                  style="margin-top: 20px;margin-left: 10px;margin-bottom: 10px;"
                  placeholder="请选择模板"
                  size="small"
                  :disabled="loading"
                  v-loadmore="loadMore"
                  v-model="template_id"
                  @change="(value) => handleChange('template')"
                  collapse-tags
                  clearable
                  extraText="报告模板"
                >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
                </el-select>
              </div>
              <span style="font-size: small;color: #909399;">选择了报告模板，则该数智员工只用于报告生成，能力集和知识库不可用！</span>
              <hr>
              <div>
                能力集
                <el-select
                  style="margin-top: 10px;margin-left: 10px;margin-bottom: 10px;"
                  placeholder="请选择能力"
                  size="small"
                  :disabled="loading || template_id != ''"
                  v-loadmore="loadMore"
                  v-model="agents"
                  @change="(value) => handleChange('agent')"
                  multiple
                  collapse-tags
                  extraText="能力集"
                >
                  <el-option
                    style="position: relative"
                    v-for="item in agentList"
                    :key="item.amp_agent_rel_id"
                    :value="item.amp_agent_rel_id"
                    :label="item.agent_name"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin-right: 10px;margin-bottom: 10px;">
                知识库
                <el-select
                  style="margin-left: 10px"
                  placeholder="请选择知识库"
                  size="small"
                  :disabled="loading || template_id != ''"
                  v-loadmore="loadMore1"
                  v-model="knowledgeUUID"
                  @change="(value) => handleChange('knowledgebase')"
                  multiple
                  collapse-tags
                  extraText="知识库"
                >
                  <el-option
                    style="position: relative"
                    v-for="item in knowledgeList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.kb_name"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin-right: 10px;margin-bottom: 10px;">
                开场白
                <el-input
                  style="margin-top: 5px"
                  type="textarea"
                  resize="none"
                  :rows="8"
                  placeholder="请输入开场白"
                  v-model="remarks"
                  :disabled="loading"
                  id="remarks"
                ></el-input>
              </div>
              <div style="margin-right: 10px;margin-bottom: 10px;">
                <div
                  style="
                    margin: 20px 0 10px;
                    display: flex;
                    justify-content: space-between;
                  ">
                  <div>快捷指令</div>
                  <el-button size="mini" @click="openShortcuts('')"
                  style="border-radius: 20px; border-color: white;"
                    ><i class="el-icon-plus el-icon--right;margin-left: 0px"></i
                  ></el-button>
                </div>
                <Container
                  @drop="onDrop"
                  style="
                    overflow-y: auto;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    border-radius: 4px;
                    max-height: 225px;
                  "
                  id="sop"
                >
                  <Draggable v-for="(item, index) in shortcuts" :key="item.id">
                    <div class="draggable-item">
                      {{ index + 1 }} - {{ item.name.length>20?item.name.substr(0, 20) + "...": item.name }}
                      <div style="display: flex;">
                        <i
                        @click="openShortcuts(item)"
                        style="font-size: 20px"
                        class="el-icon-edit"
                      ></i>
                      <i
                        @click.stop="deleteShortcuts(index)"
                        style="font-size: 20px"
                        class="el-icon-remove-outline"
                      ></i>
                      </div>
                    </div>
                  </Draggable>
                </Container>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col class="detail1" :span=9 style="height: 100%">
          <el-card style="height: 100%" shadow="never">
            <div class="detail1a">
              <div>
                预览与调试
              </div>
              <el-card shadow="always" class="detail1a1">
                <div class="chatContent">
                  <div class="chatHistory" id="answer1">
                    <div
                      class="con1"
                      v-for="({ question, answer, doc_fragment, data_source }, index) in chatList1"
                    >
                      <div class="con1a" v-show="index!=0">
                        <img src="/cloud-1.svg" alt="" />
                        <div class="con1a1">
                          <div class="con1a1a">{{ question }}</div>
                        </div>
                      </div>
                      <div class="con1b">
                        <img src="/robot-1.png" alt="" />
                        <div class="con1b1">
                          <div
                          v-highlight
                          v-html="
                            answer? answer: loading1 && index + 1 === chatList1.length? strLoading: index===0?'<p></p>':'<p>暂无数据</p>'
                          "
                          ></div>
                          <div v-show="doc_fragment && !loading1"  style="display: flex; float:right">
                            <el-tooltip content="答案分段" placement="top">
                              <el-button
                                size="small"
                                type="text"
                                @click="openDocFragment(doc_fragment)"
                              >
                                分段
                              </el-button>
                            </el-tooltip>
                            <el-tooltip content="原文件段落" placement="top">
                              <el-button
                                size="small"
                                type="text"
                                @click="openDataSource(data_source)"
                              >
                                数据源
                              </el-button>
                            </el-tooltip>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; overflow-x: auto;width: 100%; ">
                    <div v-for="item in shortcuts" class="input2a3" style="width: 100px;" @click="send1(item.content)">
                      <el-popover placement="top-start" width="500" trigger="hover">
                        <div class="in">{{item.content}}</div>
                        <span slot="reference">{{
                          item.name.length>6?item.name.substr(0, 6) + "...": item.name
                        }}</span>
                      </el-popover>
                        
                    </div>
                  </div>
                  <div class="input2">
                    <el-input
                      ref="input"
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 7 }"
                      placeholder="输入您想了解的内容，Shift+Enter换行"
                      v-model="question1"
                      resize="none"
                      @keydown.enter.native="keyDown1"
                    >
                    </el-input>
                    <div class="input2a">
                      <el-button
                        class="input2a2"
                        v-if="loading"
                        type="primary"
                        size="mini"
                        @click="stop1"
                        >停止</el-button
                      >
                      <div v-else class="input2a2" @click="send1('')">
                        <div class="in">发送</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      width="800px"
      :title="'发布设置'"
      :visible.sync="release_visible"
    >
    <div>
      <h4 style="margin-top: 0px; margin-bottom: 2px;">发布记录</h4>
      <el-input
            v-model="form2.release_record"
            style="width: 100%"
            type="textarea"
            resize="none"
            :rows="3"
            placeholder="请输入版本记录"
            maxlength="2000"
            show-word-limit
          />
    </div>
    <div>
      <div style="display: ruby;"><p style="color: red;">*</p><h4 style="margin-bottom: 5px;">选择发布平台</h4></div>
      <br>
      <div style="margin-top: 8px;margin-bottom: 8px;">
        在以下平台发布你的数智员工，即表示你已充分理解并同意遵循各发布渠道服务条款（包括但不限于任何隐私政策、社区指南、数据处理协议等）。
      </div>
      <table class="table table-bordered table-striped">
        <tr>
          <th>
            发布平台
          </th>
        </tr>
        <tr>
          <!-- 这是选项复选框，其绑定数据的v-model为checkedItem -->
          <td class="column"><input type="checkbox" value="数智人才市场" v-model="form2.release_platform" disabled="true"/></td>
          <td class="value">数智人才市场</td>
          <td class="value">已授权</td>
          <td class="value">——</td>
        </tr>
        <tr>
          <!-- 这是选项复选框，其绑定数据的v-model为checkedItem -->
          <td class="column"><input type="checkbox" value="数字人Cloudia" v-model="form2.release_platform" disabled="true"/></td>
          <td class="value">数字人Cloudia</td>
          <td class="value">已授权</td>
          <td class="value">授权码：{{ agent_id }}</td>
        </tr>
        <tr>
          <!-- 这是选项复选框，其绑定数据的v-model为checkedItem -->
          <td class="column"><input type="checkbox" value="机器人Ginger" v-model="form2.release_platform" disabled="true"/></td>
          <td class="value">机器人Ginger</td>
          <td class="value">已授权</td>
          <td class="value">授权码：{{ agent_id }}</td>
        </tr>
        <tr>
          <!-- 这是选项复选框，其绑定数据的v-model为checkedItem -->
          <td class="column"><input type="checkbox" value="微信客服" v-model="form2.wechat_checked"/></td>
          <td class="value">微信客服</td>
          <td class="value">{{form2.wechat_binding ?'已授权': '未授权'}}</td>
          <td class="value">
            <el-button
              size="small"
              type="text"
              @click="openWechatCustomerSetting"
            >
            {{form2.wechat_binding ?'查看': '授权'}}
            </el-button>
            <el-button
              size="small"
              type="text"
              @click="openWechatkfBinding"
              :disabled="form2.isBindingDisabled"
            >
              绑定客服
            </el-button>
          </td>
        </tr>
        <tr>
          <!-- 这是选项复选框，其绑定数据的v-model为checkedItem -->
          <td class="column"><input type="checkbox" value="飞书" v-model="form2.release_platform" disabled="true"/></td>
          <td class="value">飞书</td>
          <td class="value">暂未开放</td>
          <td class="value">暂未开放</td>
        </tr>
        <tr>
          <!-- 这是选项复选框，其绑定数据的v-model为checkedItem -->
          <td class="column"><input type="checkbox" value="钉钉" v-model="form2.release_platform" disabled="true"/></td>
          <td class="value">钉钉</td>
          <td class="value">暂未开放</td>
          <td class="value">暂未开放</td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="release_visible = false"> 取 消 </el-button>
        <el-button
          v-loading="releaseLoading"
          size="small"
          type="primary"
          @click="release"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="微信客服代开发应用授权" :visible.sync="wechat_visible">
      <el-form ref="form3" :model="form3" :rules="rules3" size="small" label-width="150px">
        <el-form-item label="二维码" prop="qrcode">
          <template>
            <el-popover placement="top-start" width="500" trigger="hover">
              <div><p>企业微信代开发应用授权二维码，使用企业微信管理员账号扫码授权</p></div>
              <span slot="reference">
                <i class="el-icon-question"></i>
              </span>
            </el-popover>
          </template>
          <!-- <el-image
            style="width: 100px; height: 100px"
            :src=this.form3.qrcode
            fit="cover">
          </el-image> -->
          <img style="height: 150px; margin-left: 15px" src="/img/wekefu.png" alt="微信客服代开发应用模板二维码">
        </el-form-item>
        <el-form-item label="企业全称" prop="corp_name">
          <template>
            <el-popover placement="top-start" width="500" trigger="hover">
              <div><p>使用管理员账号扫码登录
                <a href="https://work.weixin.qq.com/wework_admin/frame#profile" target="_blank" style="text-decoration: underline;color: -webkit-link;">
                  企业微信·管理后台</a>查询获取
                </p>
              </div>
              <span slot="reference">
                <i class="el-icon-question"></i>
              </span>
            </el-popover>
          </template>
          <el-input
            v-model="form3.corp_name"
            placeholder="请输入企业全称"
            style="width: 300px"
            maxlength="50"
            v-show="!form2.wechat_binding"
          />
          <el-input
            v-model="form2.enterprise_name"
            style="width: 300px"
            maxlength="50"
            v-show="form2.wechat_binding"
            readonly
          />
        </el-form-item>
        <el-form-item label="流程说明" prop="workflow">
          <template>
            <el-popover placement="top-start" width="500" trigger="hover">
              <div><p>授权开通企业微信客服待开发流程说明</p>
              </div>
              <span slot="reference">
                <i class="el-icon-question"></i>
              </span>
            </el-popover>
          </template>
          <el-input
            v-model="form2.workflow"
            style="width: 300px"
            maxlength="50"
            v-show="!form2.wechat_binding"
            readonly
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="wechat_visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="wechatCustomerSetting" :disabled="form2.wechat_binding">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="微信客服账号绑定" :visible.sync="wekefu_visible">
      <el-form size="small" label-width="150px">
        <el-form-item label="已授权客服账号" prop="authlist">
          <template>
            <el-popover placement="top-start" width="500" trigger="hover">
              <div><p>企业微信管理后台微信客服应用中已授权的客服账号</p></div>
              <span slot="reference">
                <i class="el-icon-question"></i>
              </span>
            </el-popover>
          </template>
          <el-table
            ref="kfbindtable"
            :data=this.form3.authlist
            style="width: 100%"
            :highlight-current-row="true"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable="row => row.selectable"></el-table-column>
            <el-table-column prop="name" label="客服名称" width="80"></el-table-column>
            <el-table-column prop="staff_name" label="数智员工" width="100"></el-table-column>
            <el-table-column prop="avatar" label="客服头像" width="180">
              <template slot-scope="scope">
                <img
                  :src="scope.row.avatar"
                  alt="客服头像"
                  style="width: 30px; height: auto;">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="未授权客服账号" prop="unauthlist">
          <template>
            <el-popover placement="top-start" width="500" trigger="hover">
              <div><p>企业微信管理后台微信客服应用中未授权的客服账号</p></div>
              <span slot="reference">
                <i class="el-icon-question"></i>
              </span>
            </el-popover>
          </template>
          <el-table
            :data=this.form3.unauthlist
            style="width: 100%">
            <el-table-column type="selection" width="55" :selectable="row => row.selectable"></el-table-column>
            <!-- <el-table-column type="selection" :disabled="true"></el-table-column> -->
            <el-table-column prop="name" label="客服名称" width="180"></el-table-column>
            <el-table-column prop="avatar" label="客服头像" width="180">
              <template slot-scope="scope">
                <img
                  :src="scope.row.avatar"
                  alt="客服头像"
                  style="width: 30px; height: auto;">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="initializeSelection">检 查</el-button>
        <el-button size="small" @click="wekefu_visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="wechatkfBinding">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="创建快捷指令" :visible.sync="shortcuts_visible">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="150px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入快捷指令名称"
            style="width: 300px"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="快捷指令内容" prop="content">
          <el-input
            v-model="form.content"
            style="width: 300px"
            type="textarea"
            resize="none"
            :rows="3"
            placeholder="请输入快捷指令内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="shortcuts_visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="答案分段" :visible.sync="doc_fragment_visible">
      <el-table
            border
            class="margin-top-10"
            :data="doc_fragment"
            fit
            highlight-current-row
            max-height="450"
          >
            <el-table-column align="center" label="文件名" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.filename }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分段">
              <template slot-scope="scope">
                <span>{{ scope.row.answer_fragment }}</span>
              </template>
            </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="doc_fragment_visible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="数据源分段" :visible.sync="data_source_visible">
      <el-table
            border
            class="margin-top-10"
            :data="data_source"
            fit
            highlight-current-row
            max-height="450"
          >
            <el-table-column align="center" label="文件名" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.filename }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分段">
              <template slot-scope="scope">
                <span>{{ scope.row.text_content }}</span>
              </template>
            </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="data_source_visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
// import { SSE } from "@/utils/sse";
import { marked } from "marked";
import { getUuid } from "@/utils/uuid";
import { Container, Draggable } from "vue-smooth-dnd";
// import { getToken} from "@/utils/auth";
import markdownItMermaid from "@wekanteam/markdown-it-mermaid";
import { reportSseRequset, chatSseRequset, multiDocChatSseRequset } from "@/api/docinfo.js";
const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};
const getImg = (url) => require(`./images/chat${url}.png`);
var service = null;
export default {
  name: "StaffsDesign",
  components: { Container, Draggable },
  data() {
    return {
      form: {
        id: "",
        name: "",
        content: "",
      },
      rules: {
        name: [{ required: true, message: "请输入快捷指令名称", trigger: "blur" }],
        content: [{ required: true, message: "请输入快捷指令内容", trigger: "blur" }],
      },
      rules3: {
        enterprise_id: [{ required: true, message: "请输入企业ID", trigger: "blur" }],
        token: [{ required: true, message: "请输入企业token", trigger: "blur" }],
        encoding_aes_key: [{ required: true, message: "请输入企业encoding_aes_key", trigger: "blur" }],
        secret: [{ required: true, message: "请输入企业密钥", trigger: "blur" }],
        open_kf_id: [{ required: true, message: "请输入客服ID", trigger: "blur" }],
        corp_name: [{required: true, message: "请输入企业微信主体全称", trigger: "blur"}],
      },
      form1: {
        name: "",
      },
      form2: {
        release_record: "",
        release_platform: ["数智人才市场", "数字人Cloudia", "机器人Ginger"],
        wechat_binding: false,
        model_code: "",
        auth_status: "",
        enterprise_name:"",
        isBindingDisabled: true,
        wechat_checked: false,
      },
      form3: {
        qrcode: "/img/wekefu.png",
        unAuthDisabled: true,
        corp_name:"",
        customer_id: getUuid(),
        enterprise_id: "",
        token: "",
        encoding_aes_key: "",
        authlist:[],
        unauthlist:[],
        selectedIds:[],
        bindinglist:[],
        selectedRows:[],
        secret: "",
        open_kf_id: "",
        webhook: "https://digital-human-dev.harix.iamidata.com/wechat-service/cloudminds/receive/c2ddb79a"
      },
      wechat_visible: false,
      wekefu_visible: false,
      release_visible: false,
      id: "",
      agent_id: "",
      name: "",
      category: "",
      doc_fragment_visible: false,
      doc_fragment: [],
      data_source_visible: false,
      data_source: [],
      loading: false,
      prompt: "",
      remarks: "",
      corp_name: "",
      agents: [],
      agentList: [],
      agentObjList: {},
      releaseLoading: false,
      wechatLoading: false,
      strLoading: `<div class="loading"><div></div><div></div><div></div></div>\r`,
      question1: "",
      chatList1: [],
      qaStream1: null,
      resultStr1: "",
      loading1: false,
      elBottom: 40,
      elRight: 0,
      startclientX: 0,
      startclientY: 0,
      timer: null,
      visible: false,
      hideUploadBtn: false,
      uploadUrl: [],
      isAgentEnd: false,
      agentLoading: false,
      agentPageNum: 1,
      pageSize: 10,
      focusStatus: false,
      knowledgeUUID: [],
      knowledgeList: [],
      knowledgeLoading: false,
      isKnowledgeEnd: false,
      knowledgePageNum: 1,
      shortcuts: [],
      shortcuts_visible: false,
      characterVoices: "",
      characterVoicesLoading: false,
      templateList: [],
      template_id: "",
      language: "cn",
    };
  },
  created() {
    this.id = Number(this.$route.params.id);
    this.name = this.$route.query.name;
    this.agent_id = Number(this.$route.query.agent_id);
    this.category = this.$route.query.category;
    this.getAgentInfo();
    this.getTemplateList();
    this.getAgentList();
    this.getKnowledgeList();
    this.getSysPrompt();
    this.getReleaseInfo();
    // this.getkflist();
    // 初始化数字人
    // this.initToken();
    this.remarks = "您好！我是"+this.name+"，很高兴为您服务，请问有什么可以帮助您的吗？";
    this.chatList1.push({
      answer: this.remarks,
      question: "",
    })
  },
  methods: {
    getTemplateList() {
      const params = {
        page: 1,
        limit: 1000
      };
      this.$request({
          url: "/tech/amp/reporttemplate/list",
          method: "get",
          params,
        }).then((res) => {
        for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].category == "report" || res.data.list[i].category == "courseware") {
              // console.log(res.data.list[i])
              this.templateList.push(res.data.list[i]);
            }
          }
      })
      .catch((err) => {
        console.log(err);
      });
    },
    openDocFragment(doc_fragment) {
      this.doc_fragment = doc_fragment;
      this.doc_fragment_visible = true;
    },
    openDataSource(data_source) {
      this.data_source = data_source;
      this.data_source_visible = true;
    },
    copybtn() {
      copy(this.form3.webhook)
      this.$message.success('复制成功')
    },
    openWechatCustomerSetting() {
      this.wechat_visible = true;
      this.$nextTick(() => {
        this.$refs["form3"].clearValidate();
      });
    },
    openWechatkfBinding() {
      this.wekefu_visible = true;
      this.getkflist();
      // console.log("selection")
      // this.initializeSelection();
      // this.$nextTick(() => {
      //   this.$refs["form3"].clearValidate();
      // });
    },
    wechatkfBinding(){
      this.form3.selectedRows.forEach((element, _blank) => {
        // this.addkflist(element)
        this.form3.bindinglist.push(element.open_kfid)
      })
      const model_value = "yaowei-" + this.agent_id
      this.$request({
        url:"/wechat-service/cloudminds/kefubind",
        method:"post",
        data:{model_code:model_value, kfid_list:this.form3.bindinglist, staff_name:this.name, corp_name:this.form2.enterprise_name},
      })
      .then(({ data }) => {
        this.wekefu_visible = false;
        this.$message.success("授权成功");
      })
      .catch(() => {})
    },
    addkflist(val){
      this.form3.bindinglist.push(val)
    },
    wechatCustomerSetting() {
      this.$refs["form3"].validate((valid) => {
        if (valid) {
          this.form2.wechat_binding = true;
          this.wechat_visible = false;
          this.wechatLoading = true;
          this.validCorpName()
          this.updatewechatSetting()
          // this.getReleaseInfo()
        }
      });
    },
    getkflist(){
      this.$request({
        url:"/wechat-service/cloudminds/kefulist",
        method: "get",
        params: {
          corp_name: this.form2.enterprise_name,
          // corp_name: "达闼科技",
          category: "wechat-kefu",
          staff_name: this.name,
        },
      })
        .then(({ data }) => {
          // this.wechatLoading = false;
          // this.wekefu_visible = false;
          this.form3.authlist = data.AuthorizationList
          this.form3.unauthlist = data.UnAuthorizationList
          this.form3.selectedIds = data.selectedIds
          this.initializeSelection();
          // this.$message.success("授权成功");
        })
        .catch(() => {});
    },
    initializeSelection(val){
      this.form3.selectedRows = val; // 选中的行数据
      this.form3.authlist.forEach(row => {
        if (this.form3.selectedIds.includes(row.id)) {
          console.log("selected row id:",row.id)
          this.$refs.kfbindtable.toggleRowSelection(row, true);
        }
      });
    },
    handleSelectionChange(val) {
      // if (this.form3.selectedRows.length == 0){
      //   console.log("init selection")
      //   this.initializeSelection()
      // }
      this.form3.selectedRows = val; // 选中的行数据
      // this.$message.success(val);
      console.log('选中的行数据:', this.form3.selectedRows);
      this.form3.selectedRows.forEach((element, _blank) => {
        console.log('选中的行数据内容:', element);
      })
      // console.log('选中的行数据:', val);
    },
    getReleaseInfo() {
      this.$request({
        url: "/tech/amp/virtualStaff/releaseinfo",
        method: "get",
        params: {
          virtual_id: this.id,
          agent_id: this.agent_id,
        },
      })
      .then(({ data }) => {
        this.form2.release_record = data.release_record;
        this.form2.model_code = data.model_code;
        this.form2.auth_status = data.auth_status
        this.form2.enterprise_name = data.enterprise_name
        const release_platform = data.release_platform.split(",")
        if (release_platform.length > this.form2.release_platform.length) {
          this.form2.release_platform = release_platform;
        }
        if (this.form2.release_platform.includes('wechat')){
          this.form2.wechat_checked = true
        }
        if (data.auth_status == 1){
          this.form2.wechat_binding = true;
          this.form2.isBindingDisabled = false;
        }
      })
      .catch(() => {
        this.form2.release_platform = data.release_platform.split(",");
      })
      .catch(() => {
      });
    },
    getImg,
    getAsrText(text) {
      this.question = text;
    },
    changeFocusStatus(flage) {
      this.focusStatus = flage;
    },
    loadMore() {
      if (this.isAgentEnd || this.agentLoading) return;
      this.agentPageNum++;
      this.getAgentList();
    },
    loadMore1() {
      if (this.isKnowledgeEnd || this.knowledgeLoading) return;
      this.knowledgePageNum++;
      this.getKnowledgeList();
    },
    release() {
      this.releaseLoading = true;
      if (this.form2.wechat_checked){
        const newArray = this.form2.release_platform.concat(["wechat"]);
        this.form2.release_platform = newArray;
      }
      if (!this.form2.wechat_checked){
        this.form2.release_platform = this.form2.release_platform.filter(item => item !== "wechat");
      }
      this.$request({
        url: "/tech/amp/virtualStaff/release",
        method: "post",
        data: { id: this.id, release_record: this.form2.release_record, release_platform: this.form2.release_platform, wechat_customer_setting: this.form3 },
      })
        .then(({ data }) => {
          this.$message.success("发布成功");
          this.releaseLoading = false;
          this.release_visible = false;
          this.getReleaseInfo();
          if (this.form2.release_platform.includes("wechat")){
            this.releaseStaff(0);
          }else{
            this.releaseStaff(1);
          }
        })
        .catch(() => {
          this.releaseLoading = false;
        })
    },
    releaseStaff(val){
      this.$request({
        url: "/wechat-service/cloudminds/corp/staffRelase",
        method: "post",
        data: { staff_name: this.name, status: val},
      })
        .then(({ data }) => {
        })
        .catch(() => {
        })
    },
    handleEditChange(file, fileList) {
      this.hideUploadBtn = fileList.length >= 1;
    },
    uploadImgRemove(file, fileList) {
      this.hideUploadBtn = fileList.length >= 1;
    },
    onSuccess({ data: { url, file_type } }) {
      this.uploadUrl = [{ url, file_type }];
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 <= 10;

      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isLt2M;
    },
    back() {
      this.$router.replace({
        path: `/team/staffs`,
      });
    },
    addPromptConfirm() {
      this.$request({
        url: "/tech/amp/virtualStaff/updateSysPrompt",
        method: "post",
        data: { agent_id: this.agent_id, sysprompt: this.prompt, opening_remarks: this.remarks, commands: this.shortcuts },
      })
        .then(({ data }) => {
          // this.$message.success("修改成功");
        })
        .catch(() => {
      })
    },
    stop1() {
      this.qaStream1?.close();
      this.resultStr1 = "";
      this.loading1 = false;
    },
    send1(instruction) {
      if (instruction!='')
        this.question1 = instruction;
      if (!this.question1.trim())
        return this.$toast.show("请输入内容！", undefined, true);

      this.loading1 = true;
      this.resultStr1 = "";

      this.chatList1 = [
        ...this.chatList1,
        { question: this.question1, answer: "" },
      ];
      if (this.template_id == '') {
        if (this.category === '其他智能载体') {
          this.connectToMultiDocChatSSE(this.agent_id)
        } else if (this.category === '绘画智能人') {
          this.connectToChatSSE(this.agent_id,5);
        } else {
          this.connectToChatSSE(this.agent_id,4);
        }
      }else{
        this.$request({
          url: "/tech/amp/reporttemplate/info",
          method: "get",
          params: { id: this.template_id },
        })
        .then(({ data }) => {
          this.template_content = data.content;
          this.connectToReportSSE();
        })
        .catch(() => {});
      }
    },
    connectToChatSSE(agent_id,chat_type) {
      this.loading1 = true;
      const json = {
        agent_id: agent_id,
        question: this.question1,
        chat_type: chat_type,
      }
      chatSseRequset(json, this.successCallback, this.errCallback);
    },
    connectToMultiDocChatSSE(agent_id) {
      this.loading1 = true;
      const json = {
        agent_id: agent_id,
        question: this.question1,
      }
      multiDocChatSseRequset(json, this.successMultiDocCallback, this.errCallback);
    },
    connectToReportSSE() {
      this.loading1 = true;
      const json = {
            language: this.language,
            type: "report",
            message: this.question1,
            template: this.template_content,
          }
      reportSseRequset(json, this.successCallback, this.errCallback);
    },
    successCallback(msg) {
      this.question1 = "";
      if (msg.event == "stop") {
        this.stopCallback();
      }else {
        this.loading1 = false;
        const data = JSON.parse(msg.data).data;
        this.resultStr1 += data.content;
        this.$set(this.chatList1, this.chatList1.length - 1, {
            ...this.chatList1[this.chatList1.length - 1],
            answer: this.resultStr1,
          });
      }
    },
    stopCallback() {
      this.loading1 = false;
      this.question1 = "";
      const md = require('markdown-it')({
              html: true,
              linkify: true,
              typographer: true
            }).use(markdownItMermaid);
      this.resultStr1;
      var html1 = md.render(this.resultStr1);
      html1 = html1.replace(/<ol>/g, '<ol style="margin-top: 10px; margin-bottom: -10px;">').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<h1>/g, '<h1 style="margin-bottom: -20px;">').replace(/<h2>/g, '<h2 style="margin-bottom: -10px;">').replace(/<h3>/g, '<h3 style="margin-bottom: -10px;">').replace(/<h4>/g, '<h4 style="margin-bottom: -10px;">');
      const html = html1.replace(/<table>/g, '<table style="border-collapse: collapse; border-spacing: 0;display: table;background-color: transparent;border: 1px solid #ddd;">').replace(/<td>/g, '<td style="border: 1px solid #dfe2e5;font-size: 14px;padding: 6px 13px;">').replace(/<th>/g, '<th style="border: 1px solid #dfe2e5;padding: 6px 13px;">')
      this.$set(this.chatList1, this.chatList1.length - 1, {
          ...this.chatList1[this.chatList1.length - 1],
          answer: html,
        });
      this.stop1();
    },
    errCallback(err) {
      this.stop1();
      console.log(err, "---");
    },
    successMultiDocCallback(msg){
      this.question1 = "";
      if (msg.event == "stop") {
        this.stop1();
      }else {
        this.loading1 = false;
        const content = JSON.parse(msg.data).data.content;
        const integrate_answer = content.integrate_answer;
        this.doc_fragment = content.doc_fragment;
        this.data_source = content.doc_source;
        if (integrate_answer != undefined) {
          this.resultStr1 += integrate_answer;
        }
        this.$set(this.chatList1, this.chatList1.length - 1, {
          question: this.chatList1[this.chatList1.length - 1].question,
          answer: marked(this.resultStr1),
          doc_fragment: this.doc_fragment,
          data_source: this.data_source,
        });
      }
    },
    stop() {
      this.qaStream?.close();
      this.resultStr = "";
      this.loading = false;
      this.getSelectDetail();
    },
    keyDown1(e) {
      if (!e.shiftKey && !this.loading1) {
        this.send1('');
        e.preventDefault();
      }
    },
    handleChange(type) {
      if (type == "agent") {
        var agent_objs = []
        for (let i = 0; i < this.agents.length; i++) {
          agent_objs.push(this.agentObjList[this.agents[i]])
        }
        this.$request({
          url: "/tech/amp/virtualStaff/bindAgents",
          method: "post",
          data: { agent_id: this.agent_id, agents: agent_objs },
        })
        .then(({ data }) => {
          // this.$message.success("修改成功");
        })
        .catch(() => {});
      }else if (type == "knowledgebase") {
        this.$request({
          url: "/tech/amp/virtualStaff/bindDocs",
          method: "post",
          data: { agent_id: this.agent_id, dirids: this.knowledgeUUID },
        })
        .then(({ data }) => {
          // this.$message.success("修改成功");
        })
        .catch(() => {});
      }else if (type == "template") {
        const report_id = this.template_id == ''?-1:this.template_id;
        this.$request({
          url: "/tech/amp/virtualStaff/bindReportTemplate",
          method: "post",
          data: { agent_id: this.agent_id, report_id: report_id },
        })
        .then(({ data }) => {
          // this.$message.success("修改成功");
        })
        .catch(() => {});
      }

    },
    getHistoryList() {
      this.$request({
        url: "/tech/amp/virtualStaff/chatRecord",
        method: "get",
        params: { agent_id: this.agent_id, page: 1, limit: 1000 },
      })
        .then(({ data }) => {
          this.chatList = data.map(({ answer, ...extra }) => ({
            ...extra,
            answer: marked(answer),
          }));
        })
        .catch(() => {});
    },
    getKnowledgeList() {
      this.knowledgeLoading = true;
      const data = {
        page: this.knowledgePageNum,
        page_size: 100
      };
      this.$request({
            url: "/knowledgebase/mmue/api/qadockb/list?lang=zh-CN",
            method: "post",
            data,
          })
        .then(({ data }) => {
          this.knowledgeList = [...this.knowledgeList, ...data.list];
          this.isKnowledgeEnd = data.total <= this.knowledgeList.length;
          this.knowledgeLoading = false;
        })
        .catch(() => {
          this.knowledgeLoading = false;
        });
    },
    getAgentList() {
      this.agentLoading = true;
      const params = {
        agent_id: this.agent_id,
        page: this.agentPageNum,
        limit: this.pageSize,
      };
      
      this.$request({
        url: "/tech/amp/virtualStaff/canBindAgents",
        method: "get",
        params,
      })
        .then(({ data }) => {
          this.agentLoading = false;
          this.agentList = data;
          this.agents = [];
          for (let i = 0; i < this.agentList.length; i++) {
            if (this.agentList[i].switch) {
              this.agents.push(this.agentList[i].amp_agent_rel_id);
            }
            this.agentObjList[this.agentList[i].amp_agent_rel_id] = this.agentList[i];
          }
        })
        .catch(() => {
          this.agentLoading = false;
        })
    },
    getAgentInfo() {
      const params = {
        agent_id: this.agent_id
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getSvAgentInfo",
        method: "get",
        params
      })
        .then(({ data: { dirids } }) => {
          this.knowledgeUUID = dirids;
        })
        .catch(() => {
        })
    },
    getSysPrompt() {
      const params = {
        agent_id: this.agent_id
      };
      this.$request({
        url: "/tech/amp/virtualStaff/getSysPrompt",
        method: "get",
        params
      })
        .then(({ data: { gpt_prompt_sys,opening_remarks,commands,report_id } }) => {
          this.prompt = gpt_prompt_sys.replace("{docs}","");
          this.remarks = opening_remarks;
          this.shortcuts = commands;
          this.template_id = (report_id==0 || report_id==-1)?'':report_id;
        })
        .catch(() => {
        })
    },
    scrollBottom() {
      this.$nextTick(() => {
        const ele = document.getElementById("answer");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    scrollBottom1() {
      this.$nextTick(() => {
        const ele = document.getElementById("answer1");
        ele.scrollTop = ele.scrollHeight;
      });
    },
    validCorpName(){
      this.$request({
        url:"/wechat-service/cloudminds/corp/valid",
        method: "get",
        params: {
          corp_name: this.form3.corp_name,
          category: "wechat-kefu",
        },
      })
        .then(({ data:{valid} }) => {
          this.wechatLoading = false;
          this.wechat_visible = false;
          this.$message.success("授权成功");
        })
        .catch(() => {});
    },
    updatewechatSetting(){
      this.$request({
        url:"/tech/amp/wechatcustomer/authcallback",
        method: "post",
        data: { agent_id: this.agent_id, enterprise_name: this.form3.corp_name,auth_status:1 },
      })
        .then(({ data }) => {
          this.getReleaseInfo()
        })
        .catch(() => {});
    },
    initToken() {
      this.$request({
        url: "/api/rdp/V1/token/generate",
        method: "post",
        data: {
          appid: "qv4WvWcI",
          appkey: "93c77dafc649901c99e8bd9868a647aecdb3f889",
        },
      })
        .then(({ data }) => {
          this.initHarix(data[0].accessToken);
        })
        .catch(() => {});
    },
    openShortcuts(item) {
      if (item == "" && this.shortcuts.length >= 5){
        this.$message.warning("快捷回复最多5条");
      } else {
        this.shortcuts_visible = true;
        this.$nextTick(() => {
          this.$refs.form.resetFields();
          if (item!="") {
            this.form = {
              id: item.id,
              name: item.name,
              content: item.content,
            };
          } else {
            this.form = {
              id: "",
              name: "",
              content: "",
            };
          }
        });
      }
    },
    deleteShortcuts(index) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.shortcuts.splice(index, 1);
          this.addPromptConfirm();
        })
        .catch(() => {});
    },
    move(e) {
      let odiv = document.querySelector(".playContainer"); //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        //绑定元素位置到positionX和positionY上面
        this.positionX = top;
        this.positionY = left;
        //移动当前元素
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    add() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id!= "") {
            console.log(this.form.id);
            this.shortcuts.forEach((item) => {
              if (item.id === this.form.id) {
                item.name = this.form.name;
                item.content = this.form.content;
              }
            });
          } else {
            this.shortcuts.push({
              id: getUuid(),
              content: this.form.content,
              name: this.form.name,
            });
          }
          this.shortcuts_visible = false;
          this.$nextTick(() => {
            const ele = document.getElementById("sop");
            ele.scrollTop = ele.scrollHeight;
          });
          this.addPromptConfirm();
        }
      });
    },
    onDrop(dropResult) {
      this.shortcuts = applyDrag(this.shortcuts, dropResult);
    },
  },
  computed: {},
  watch: {
    prompt(next, prev) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.addPromptConfirm();
      }, 400);
    },
    remarks(next, prev) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.addPromptConfirm();
      }, 400);
      // if (this.chatList1.length === 0) {
      //   this.chatList1.push({
      //     answer: this.remarks,
      //   });
      // }else {
      //   if (this.remarks==="") {
      //     if(this.chatList1.length>1){
      //       this.chatList1.shift();
      //     }else{
      //       this.chatList1 = [];
      //     }
      //   } else {
        this.chatList1[0].answer = this.remarks;
        // }
      // }
    },
    loading(value) {
      this.scrollBottom();
    },
    chatList() {
      this.scrollBottom();
    },
    loading1(value) {
      this.scrollBottom1();
    },
    chatList1() {
      this.scrollBottom1();
    },
  },
  beforeUnmount() {
    service?.stop();
    service = null;
  },

  mounted() {
    document.addEventListener("visibilitychange", function logData() {
      if (document.visibilityState === "hidden") {
        service?.stop();
        service = null;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/dark-light.scss";
@import "@/styles/theme.scss";
@import "@/styles/chat.scss";
.detail-container {
  height: 100vh;
}
.detail1 ::v-deep .el-card__body {
  height: 100%;
}
.detail1a {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}
.detail1a1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
.playContainer {
  width: 100%;
  height: 400px;
  cursor: pointer;
  margin: 0 auto;
}
/* .playContainer {
  position: fixed;
  width: 300px;
  height: 600px;
  right: 20px;
  top: 20px;
  z-index: 1000;
  cursor: pointer;
} */
#playerDiv {
  width: 100%;
  height: 100%;
  background: url(./images/bg.jpeg) no-repeat center top;
  background-size: cover;
  z-index: 0;
}
#playerDiv ::v-deep video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  cursor: pointer;
}
.draggable-item {
  height: 50px;
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
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.card-prompt ::v-deep .el-card__body {
  height: 100%;
}
.hide-upload-btn ::v-deep .el-upload-list--picture-card {
  width: 20px;
  height: 20px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 50px;
  height: 50px;
}
.avatar-uploader ::v-deep .el-upload {
  min-width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table{
    margin-top: 10px;
    border-collapse: collapse;
    border-spacing: 0;
    background-color: transparent;
    display: table;
    width: 100%;
    max-width: 100%;
    margin:0 auto;
  }
.table th{
    text-align:left;
    vertical-align:middle;
    font-size: 12px;
    font-family: 'Arial Normal', 'Arial';
    color: #333333;
    padding: 3px 7px;
  }
.table td{
    text-align:center;
    vertical-align:middle;
    font-size: 10px;
    font-family: 'Arial Normal', 'Arial';
    color: #333333;
    padding: 3px 7px;
  }
.table-bordered {
  border: 1px solid #ddd;
}
.column{
  width:20px;
  height:30px;
  border:1px solid #a2a1a1;
  background: #f1f1f1;
}
.value{
  width:42px;
  height:30px;
  border:1px solid #a2a1a1;
}

.no-pointer-events .el-table__row {
  pointer-events: none;
}

hr {
  // border: none; /* 移除默认边框 */
  height: 1px; /* 线的高度 */
  background-color: #ccc; /* 线的颜色 */
  margin: 10px 0; /* 线的上下外边距 */
}
</style>
