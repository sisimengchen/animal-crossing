const data = {};

export function cacheDataSet(key, val) {
  data[key] = val;
}

export function cacheDataGet(key, delelteAfterGet) {
  const temp = data[key];
  delelteAfterGet && delete data[key];
  return temp;
}

export function cacheDataRemove(key) {
  const temp = data[key];
  temp && delete data[key];
}

export function cacheDataHas(key) {
  return key in data;
}
