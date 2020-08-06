/**
 * @description:
 * @param {class}: Vue中的this
 * @return {type}
 */
export function proxy(vm) {
  let data = vm._data;
  Object.keys(data).forEach((key) => {
    // 将key注入到当前this对象中
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        // 注意这里要用data[key]来获取value，要和上面defineReactive方法中的get区分开了
        // 为什么是data[key]：这里有人可能会乱，怎么一会用value，一会用data[key]，原因是我们这里只是做一层代理，你通过vm.xxx获取其实内部就是去将this._data中的数据取出来给你，往引用上想一想就明白了。
        return data[key];
      },
      set: function (newVal) {
        if (newVal === data[key]) {
          return;
        }
        data[key] = newVal;
      },
    });
  });
}
