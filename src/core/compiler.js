import Watcher from './watcher';


// 这里为啥用class类，而不写成普通函数，后面会说明
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

  // 编译元素节点
  complieElement(node) {
    // console.dir(node); // 调试
    Array.from(node.attributes).forEach((attr) => {
      // attrName = 'v-html'
      let attrName = attr.name;
      // 判断是否为指令，v-开头就认为是vue指令
      if (this.isDirective(attrName)) {
        // 获取指令内容
        let key = attr.value;
        // v-html -> html, v-text -> text
        attrName = attrName.substring(2);
        // 通过下面这个函数处理，就不用写那么多的if判断了
        this.update(node, key, attrName);
      }
    });
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

      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      })
    }
  }
  // 更新函数(画重点)
  update(node, key, attrName) {
    // attrName 为html、text、model等
    // 通过做字符串拼接，拼成htmlUpdater、textUpdater、modelUpdater等等。
    // 然后通过this[name]的方式获取到相应的函数，在执行。
    // 这样做的好处是，你有新的指令，complieElement根本不用动，
    // 你只需要按照规则添加新的指令解析函数就行，保持了设计模式种的开放封闭原则。
    let updateFn = this[attrName + "Updater"];
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }
  // 更新v-html
  htmlUpdater(node, value, key) {
    node.innerHTML = value;
    new Watcher(this.vm, key, (newValue) => {
      console.log('newValue=', newValue)
      node.innerHTML = newValue;
    })
  }
  // 更新v-text
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    })
  }
  // 更新v-model
  modelUpdater(node, value) {
    node.value = value;
  }

  // 是否为元素指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
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
}
export default Compiler;
