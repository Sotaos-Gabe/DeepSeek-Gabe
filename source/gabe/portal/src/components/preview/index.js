import Vue from "vue";
import Preview from "./index.vue";

const PreviewConstructor = Vue.extend(Preview);

const options = {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  watch: {},
};

// options 内部同组件内部生命周期一样，但组件内部优先执行
const instance = new PreviewConstructor(options);

instance.$mount();

document.body.appendChild(instance.$el);

export default function install() {
  Vue.prototype.$preview = instance;
}
