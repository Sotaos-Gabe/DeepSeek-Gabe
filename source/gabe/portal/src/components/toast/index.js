import Vue from "vue";
import Toast from "./index.vue";

const PToastConstructor = Vue.extend(Toast);

const options = {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  watch: {},
};

// options 内部同组件内部生命周期一样，但组件内部优先执行
const instance = new PToastConstructor(options);

instance.$mount();

document.body.appendChild(instance.$el);

export default function install() {
  Vue.prototype.$toast = instance;
}
