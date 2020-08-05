import { proxy } from "./proxy";
import { observer } from "./observer";

class Vue {
  constructor(options) {
    // 1、通过属性保存选项的数据
    this.$el = options.el ? document.querySelector(options.el) : "";
    this._data = options.data;
    observer(this._data);
    proxy(this);
  }
}

export default Vue;
