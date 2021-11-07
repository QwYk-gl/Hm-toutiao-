// 对象数据的存储，获取，删除进行模块化封装

// 存储
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
  // 为什么要用try catch
  /* 我如果去判断是否为json字符串比较麻烦
     然而用try来捕获异常
     能将json字符串转化为对象
     就直接return出去
     转化不了进入catch中 直接返回data
    */
}
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
