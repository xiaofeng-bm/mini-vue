import Dep from './dep';

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性key: 这里就是指main文件中的msg，html等等。
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;

    // 把Watcher记录到Dep类的静态属性target
    Dep.target = this;
    // 存储旧值，注意这里会触发get方法，在get方法中调用addSub
    this.oldValue = vm[key];

    // 在get添加完成后，在将Dep.target置空
    Dep.target = null;
  }

  // 当数据发生变化的时候更新视图
  update() {
    let newValue = this.vm[this.key];
    // 如果新旧值相同，啥也不用干
    if(newValue === this.oldValue) {
      return
    }
    // 走到这里说明新旧值不同，调用回调函数更新视图
    this.cb(newValue);
  }
}

export default Watcher;