class Dep {
  constructor() {
    // 依赖收集，存贮所有的观察者
    this.subs = [];
  }

  // 添加观察者
  addSub(sub) {
    // sub存在，并且挂有一个update的方法
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }

  // 发送通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

export default Dep;
