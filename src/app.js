//app.js
App({
  globalData: {
    userInfo: 'todolist',
    activeList: [1, 2, 3],
    completeList: []
  },
  watch (property, initVal, method) {
    const obj = this.globalData;
    const privatePropName = `_${property}`;

    obj[privatePropName] = initVal;

    Object.defineProperty(obj, property, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this[privatePropName] = value;
        method(value);
      },
      get: function () {
        return this[privatePropName];
      }
    })
  }
})