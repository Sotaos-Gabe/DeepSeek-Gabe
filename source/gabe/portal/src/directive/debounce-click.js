export default {
  install(Vue){
    // 防止按钮短期内多次点击
    Vue.directive("DebounceClick", {
      inserted(el, binding) {
        let time = null, fn = binding.value[0];
        el.addEventListener("click", () => {
          clearTimeout(time);
          time = setTimeout(() => {
            clearTimeout(time);
            fn.apply(null, binding.value.slice(1));
          }, binding.arg ? Number(binding.arg) : 300);
        });
      }
    });
  }
}
