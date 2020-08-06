import Vue from "./core/vue";

// 这里将vm实例挂载到window下，这样就可以在console中直接打印出来，方便调试
window.vm = new Vue({
  el: "#app",
  data: {
    msg: "hello world",
    html: "<h3>this is v-html</h3>",
    text: "<h3>this is v-text</h3>",
    value: "123456",
  },
});
