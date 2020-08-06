class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;

    this.compiler(this.el);
  }

  compiler(el) {
    // 获取子元素（注意：子元素是一个类数组，不是真数组，所以下面需要用Array.from转成数组）
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 判断文本节点
      if (this.isTextNode(node)) {
        // 编译文本节点
        this.complierText(node);
      } else if (this.isElementNode(node)) {
        // 编译元素节点
        this.complieElement(node);
      }

      // 判断node节点是否有子节点，如果有，需要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node);
      }
    });
  }
  // 文本节点判断
  isTextNode(node) {
    // nodeType：3代表文本节点
    return node.nodeType === 3;
  }
  // 元素节点判断
  isElementNode(node) {
    // nodeType：1代表元素节点
    return node.nodeType === 1;
  }
  // 编译文本节点
  complierText(node) {
    // 这里涉及到正则解析字符串，不懂的可以先去看看我正则的那篇博客
    // http://shiluyue.xyz/blog/blog/JS/RegExp.html
    const reg = /\{\{(.+?)\}\}/;
    // value = {{ msg }}
    let value = node.textContent;
    // 判断是否为差值表达式，既{{}}
    if (reg.test(value)) {
      // 这里会获取到上面reg括号中的内容，既 msg ,注意我们写的时候一般双大括号中间都会加空格，这里需要用trim去掉空格
      let key = RegExp.$1.trim(); // key = msg;
      // 这里用replace直接替换为Vue实例中msg实际的值，通过this.vm[key]='hello world'
      node.textContent = value.replace(reg, this.vm[key]);
    }
  }

  // 更新html
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
  // 是否为元素指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  // 编译元素节点
  complieElement(node) {
    // ...
    if (attrName === "v-html") {
      this.htmlUpdater(node, this.vm[key]);
    } else if (attrName === "v-text") {
      this.textUpdater(node, this.vm[key]);
    }
  }
  // 更新text
  textUpdater(node, value) {
    node.textContent = value;
  }
}
export default Compiler;
