import Taro from '@tarojs/taro';

const cache = {}; // 针对存不进去缓存的情况，做一个兼容
const prefix = process.env.NODE_ENV == 'development' ? 'DEV_' : ''

export function save(key, data) {
  key = prefix + key; 
  try {
    Taro.setStorageSync(key, data);
    delete cache[key]; // 设置成功后清空cache
    // 百度小程序中出现较多存不进去的情况，而且没报错，强制判断一下存进去了咩，不然就存内存
    if (process.env.TARO_ENV === 'swan') {
      if (Taro.getStorageSync(key)) {
        return true;
      } else {
        cache[key] = data;
      }
    }
    return true;
  } catch (e) {
    cache[key] = data;
    return true;
  }
}
export function read(key) {
  key = prefix + key; 
  try {
    return Taro.getStorageSync(key) || cache[key] || '';
  } catch (e) {
    return cache[key] || false;
  }
}
export function remove(key) {
  key = prefix + key; 
  try {
    delete cache[key];
    return Taro.removeStorageSync(key);
  } catch (e) {
    return false;
  }
}
