import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import request from "@/utils/request";
import hljs from "highlight.js";
// import "viewerjs/dist/viewer.css";
import DebounceClick from "@/directive/debounce-click";
import "@/icons";
// import Preview from "@/components/preview/index.js";
// import Toast from "@/components/toast/index.js";
import { append, copy } from "@/utils/tools.js";
import '@/icons' // icon
import '@/permission' // permission control
// import { randomString, once } from "@/utils/tools";
import moment from "moment";
import directives from "./directive/el-select";
Vue.use(directives);
Vue.filter("formatDate", (data) => {
  return moment(data).format("YYYY-MM-DD HH:mm:ss");
});
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// Vue.use(directives);
// Vue.filter("formatDate", (data) => {
//   return moment(data).format("YYYY-MM-DD HH:mm:ss");
// });
// Vue.use(Preview);
// Vue.use(Toast);
Vue.use(hljs);
Vue.prototype.$request = request;
Vue.config.productionTip = false
window.copy = () => {
  const data =
    event.target.parentNode.parentNode.parentNode.firstElementChild.innerText;
  copy(data);
  new Vue().$toast.show();
};
Vue.directive("highlight", (el) => {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
    const type = block.parentElement.parentElement.getAttribute("data-type");
    const isExport = type === "10";
    const ol = document.createElement("ol");
    const rowCount = block.outerHTML.split("\n").length;
    const language =
      block.className
        .split(" ")
        .filter((x) => x.indexOf("language-") > -1)?.[0]
        ?.replace(/language-/, "") || "";
    const headerStr = `
      <div class="code-header">
        <span class="code-language">${language}</span>
        <span class="code-button-container">
          <span class="code-copy" onclick=copy()>复制</span>
          <span style="display: ${
            isExport ? "block" : "none"
          }" class="code-export" onclick=exportExcel()>导出</span>
        </span>
      </div>
    `;
    for (let i = 1; i < rowCount; i++) {
      const li = document.createElement("li");
      const text = document.createTextNode(i);
      li.appendChild(text);
      ol.appendChild(li);
    }
    ol.className = "pre-numbering";
    block.parentNode.appendChild(ol);
    append(block.parentNode, headerStr);
    hljs.highlightBlock(block);
  });
});
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(DebounceClick);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
