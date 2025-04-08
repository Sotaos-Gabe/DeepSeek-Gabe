//vue指令
import Vue from "vue";

export default Vue.directive("loadmore", {
  bind(el, binding) {
    const SELECTWRAP_DOM = el.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    SELECTWRAP_DOM.addEventListener("scroll", function () {
      const CONDITION =
        this.scrollHeight - this.scrollTop - 30 <= this.clientHeight;
      if (CONDITION) {
        binding.value();
      }
    });
  },
});
