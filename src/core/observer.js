import Dep from './dep';

// 数据响应式
function defineReactive(data, key, value) {

  // 负责收集依赖，并发送通知
  let dep = new Dep();

  // 如果value类型是object就会自动进行递归
  observer(value);
  // 不熟悉下面这个方法的可以去mdn看一下解释
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      // 添加依赖收集
      Dep.target && dep.addSub(Dep.target);
      // 注意：这里不能用data[key]来替代value，因为这样用就又会触发get方法，形成死循环
      return value;
    },
    set: function (newVal) {
      // 如果前后值相等就直接return
      if (newVal === value) {
        return;
      }
      console.log(`数据改变了，新数据为${newVal}`);
      value = newVal;
      // 发送通知
      dep.notify();
    },
  });
}
export const observer = (data) => {
  // 边界条件判断，同时也是递归的结束条件
  if (!data || typeof data !== "object") {
    return;
  }
  // 遍历data对象
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
}

