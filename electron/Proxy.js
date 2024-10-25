/**
 *
 * @param {*} data
 * @param {obj, property, value} setFn obj[property] = value; obj, property, value
 * @param {obj, property} getFn obj, property
 */
function proxyData(data, setFn, getFn) {
  // 创建一个处理器对象，定义拦截行为
  const handler = {
    // 拦截属性赋值操作
    set(target, property, value) {
      setFn(target, property, value);
      return true; // 表示成功赋值
    },
    // 拦截属性读取操作
    get(target, property) {
      if (getFn) {
        return getFn(target, property);
      } else {
        return target[property];
      }
    },
    // 拦截属性删除操作
    deleteProperty(target, property) {
      delete target[property];
      return true;
    },
  };
  // 创建一个代理对象
  return new Proxy(data, handler);
}

module.exports = { proxyData };
