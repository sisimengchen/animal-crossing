import fish from './fish';
import fishmap from './fishmap';
import insect from './insect';
import insectmap from './insectmap';
import moment from 'moment';
import { read } from '../utils/localStorage';

export const ALL_MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const UNKOWN_TYPE_TEXT = '未知类型';
const UNKOWN_PROPERTY_TEXT = '未知属性';
const UNKOWN_DATA_TEXT = '未知';

const TYPE_MAPS = {
  fish: '鱼',
  insect: '昆虫'
};

const ALL_MAPS = {
  fish: fishmap,
  insect: insectmap
};

export const globalObject = {
  data: {
    fish: fish,
    insect: insect
  },
  getType: function(type) {
    return TYPE_MAPS[type] || UNKOWN_TYPE_TEXT;
  },
  getList: function(type) {
    const list = this.data[type];
    const monthKey = read('GLOBAL_MONTH_KEY') || 'month_n';
    return list
      .map(data => {
        const expireData = getExpireData(data, monthKey);
        // console.log(data, expireData);
        return {
          ...expireData,
          ...data
        };
      })
      .filter(Boolean);
  },
  getData: function(type, id) {
    const list = this.getList(type);
    const data = list[parseInt(id) - 1];
    const monthKey = read('GLOBAL_MONTH_KEY') || 'month_n';
    const expireData = getExpireData(data, monthKey);
    return {
      ...expireData,
      ...data
    };
  },
  formate: function(type = 'fish', data = {}) {
    data.month_n = data.month_n || [];
    if (data.month_n.length == 0) {
      data.month_n = ALL_MONTH;
    }
    data.month_s = data.month_s || [];
    if (data.month_s.length == 0) {
      data.month_s = ALL_MONTH;
    }
    if (data.place) {
      data.placeStr = this.getText(type, 'place', data.place);
    }
    if (data.shape) {
      data.shapeStr = this.getText(type, 'shape', data.shape);
    }
    if (data.time) {
      data.timeStr = this.getText(type, 'time', data.time);
      data.timeStr =
        data.timeStr == '0-24'
          ? '全天'
          : data.timeStr.replace(/\d+/g, function(match) {
              return match + '点';
            });
    }
    if (data.condit) {
      data.conditStr = this.getText(type, 'condit', data.condit);
    }
    return data;
  },
  getText: function(type, key, value) {
    const typeObject = ALL_MAPS[type];
    if (!typeObject) {
      return UNKOWN_TYPE_TEXT;
    }
    const map = typeObject[key];
    if (!map) {
      return UNKOWN_PROPERTY_TEXT;
    }
    const text = map[value];
    if (!text) {
      return UNKOWN_DATA_TEXT;
    }
    return text;
  },
  filterList: function(type, filter) {
    const list = this.getList(type);
    if (!filter) return list;
    const {
      monthKey = 'month_n',
      month = [],
      startTime = 0,
      endTime = 24
    } = filter;
    const filterList = list.filter(item => {
      // month空表示选中所有月份
      let isMonthOk = month.length == 0 ? true : false;
      // 24小时表示所有时间
      let isTimeOk = endTime - startTime == 24 ? true : false;
      if (!isMonthOk) {
        const itemMonth = item[monthKey];
        if (itemMonth.length == 0) {
          // 不存在，表示全部月份
          isMonthOk = true;
        } else {
          isMonthOk = itemMonth.some(m => month.includes(m));
        }
      }
      if (!isTimeOk) {
        let itemTime = this.getText(type, 'time', item['time']);
        itemTime = itemTime.replace(/[-、]/g, ',').split(',');
        const tempArray = [[startTime, endTime]];
        for (let i = 0; i < itemTime.length; i = i + 2) {
          const first = parseInt(itemTime[i], 10);
          const second = parseInt(itemTime[i + 1], 10);
          if (first > second) {
            tempArray.push([first, 24]);
            tempArray.push([0, second]);
          } else {
            tempArray.push([first, second]);
          }
        }
        // 存在合并则表示有交集
        if (tempArray.length != merge(tempArray).length) {
          isTimeOk = true;
        }
      }
      return isMonthOk && isTimeOk;
    });
    return filterList;
  }
};

const merge = function(intervals) {
  if (intervals.length === 0) return [];

  intervals.sort(function(a, b) {
    return a[0] - b[0];
  });

  var result = [intervals[0]];
  helper(intervals, 1, 0, result);
  return result;
};

function helper(arr, i, j, result) {
  if (i >= arr.length) {
    return;
  }
  var afterStart = arr[i][0];
  var afterEnd = arr[i][1];

  var beforeStart = result[j][0];
  var beforeEnd = result[j][1];

  if (afterStart <= beforeEnd) {
    result[j][0] = Math.min(beforeStart, afterStart);
    result[j][1] = Math.max(beforeEnd, afterEnd);
  } else {
    result.push(arr[i]);
  }
  helper(arr, i + 1, result.length - 1, result);
}

const getExpireData = function(data, monthKey) {
  const month = data[monthKey] || [];
  let expireDays = -1;
  if (month.length == 0) {
    // console.log(data, true);
    return {
      isVisible: true,
      expireDays
    };
  }
  const current = new moment().startOf('day');
  const currentMonth = current.month() + 1;
  const result = continuousGrouping(month);
  const isVisible = result.some((item = []) => {
    const from = item[0];
    const to = item[item.length - 1];
    if (currentMonth >= from && currentMonth <= to) {
      expireDays = moment()
        .month(to - 1)
        .endOf('month')
        .diff(current, 'days');
      return true;
    }
    return false;
  });
  return {
    isVisible,
    expireDays
  };
};

const continuousGrouping = function(arr) {
  var result = [],
    i = 0;
  result[i] = [arr[0]];
  arr.reduce(function(prev, cur) {
    cur - prev === 1 ? result[i].push(cur) : (result[++i] = [cur]);
    return cur;
  });
  return result;
};
