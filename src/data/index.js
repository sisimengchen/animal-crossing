import fish from './fish';
import fishmap from './fishmap';
import insect from './insect';
import insectmap from './insectmap';
import villager from './villager';
import villagermap from './villagermap';
import moment from 'moment';
import { read } from '../utils/localStorage';

export const ALL_MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const ALL_SPECIES = Object.keys(villagermap.species).map((value) => {
  return {
    text: villagermap.species[value],
    value
  };
});

export const ALL_PERSONALITY = Object.keys(villagermap.personality).map(
  (value) => {
    return {
      text: villagermap.personality[value],
      value
    };
  }
);

const UNKOWN_TYPE_TEXT = '未知类型';
const UNKOWN_PROPERTY_TEXT = '未知属性';
const UNKOWN_DATA_TEXT = '未知';

const TYPE_MAPS = {
  fish: {
    name: '鱼',
    merge: (data = {}) => {
      const monthKey = read('GLOBAL_MONTH_KEY') || 'month_n';
      let extraData = {};
      if (data.month_n || data.month_s) {
        extraData = getExpireData(data, monthKey);
      }
      return {
        ...extraData,
        ...data
      };
    }
  },
  insect: {
    name: '昆虫',
    merge: (data = {}) => {
      const monthKey = read('GLOBAL_MONTH_KEY') || 'month_n';
      let extraData = {};
      if (data.month_n || data.month_s) {
        extraData = getExpireData(data, monthKey);
      }
      return {
        ...extraData,
        ...data
      };
    }
  },
  villager: {
    name: '村民',
    groupBy: (data = {}) => {
      const { cn_name } = data;
      let group_key = '未知';
      if (cn_name[0]) {
        group_key = cn_name[0].toUpperCase();
      }
      data.group_key = group_key;
      return group_key;
    },
    merge: (data = {}) => {
      let extraData = {};
      if (data.birth_month) {
        extraData.is_birth_month =
          new Date().getMonth() + 1 == data.birth_month;
      }
      if (data.birth_month && data.birth_day) {
        extraData.birthStr = `${data.birth_month}月${data.birth_day}日`;
      }
      return {
        ...extraData,
        ...data
      };
    }
  }
};

const ALL_MAPS = {
  fish: fishmap,
  insect: insectmap,
  villager: villagermap
};

export const globalObject = {
  data: {
    fish: fish,
    insect: insect,
    villager: villager
  },
  getType: function (type) {
    return TYPE_MAPS[type] || { name: UNKOWN_TYPE_TEXT };
  },
  getList: function (type) {
    const typeObject = TYPE_MAPS[type] || {};
    const list = this.data[type];
    if (typeObject.merge) {
      return list.map(typeObject.merge);
    } else {
      return list;
    }
  },
  group: function (type) {
    const typeObject = TYPE_MAPS[type] || {};
    const list = this.getList(type);
    if (typeObject.groupBy) {
      return groupBy(list, TYPE_MAPS.villager.groupBy);
    } else {
      return list;
    }
  },
  sort: function (type, order) {
    const list = this.getList(type);
    const [attribute = 'id', orderType = 'asc'] = order.split('|');
    return list.sort(function (a, b) {
      if (orderType == 'asc') {
        return a[attribute] - b[attribute];
      }
      return b[attribute] - a[attribute];
    });
  },
  getData: function (type, id) {
    const typeObject = TYPE_MAPS[type] || {};
    const list = this.data[type];
    const data = list.find((item) => item.id == id) || {};
    if (typeObject.merge) {
      return typeObject.merge(data);
    } else {
      return data;
    }
  },
  formate: function (type = 'fish', data = {}) {
    if (data.month_n && data.month_n.length == 0) {
      data.month_n = ALL_MONTH;
    }
    if (data.month_s && data.month_s.length == 0) {
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
          : data.timeStr.replace(/\d+/g, function (match) {
              return match + '点';
            });
    }
    if (data.condit) {
      data.conditStr = this.getText(type, 'condit', data.condit);
    }
    if (data.species) {
      data.speciesStr = this.getText(type, 'species', data.species);
    }
    if (data.personality) {
      data.personalityStr = this.getText(type, 'personality', data.personality);
    }
    return data;
  },
  getText: function (type, key, value) {
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
  // console.log(groupBy(villager, TYPE_MAPS.villager.groupBy));
  filter: function (type, filter) {
    const list = this.getList(type);
    if (!filter) return list;
    const {
      monthKey = 'month_n',
      month = [],
      startTime = 0,
      endTime = 24,
      species,
      birth_month,
      personality
    } = filter;
    const filterList = list.filter((item) => {
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
          isMonthOk = itemMonth.some((m) => month.includes(m));
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
      return (
        isMonthOk &&
        isTimeOk &&
        (species ? species == item.species : true) &&
        (birth_month ? birth_month == item.birth_month : true) &&
        (personality ? personality == item.personality : true)
      );
    });
    return filterList;
  }
};

const merge = function (intervals) {
  if (intervals.length === 0) return [];

  intervals.sort(function (a, b) {
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

const getExpireData = function (data, monthKey) {
  // console.log(data, monthKey);
  const month = data[monthKey] || [];
  // console.log(month);
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

const continuousGrouping = function (arr) {
  var result = [],
    i = 0;
  result[i] = [arr[0]];
  arr.reduce(function (prev, cur) {
    cur - prev === 1 ? result[i].push(cur) : (result[++i] = [cur]);
    return cur;
  });
  return result;
};

const groupBy = function (arr, fn) {
  return arr
    .map(typeof fn === 'function' ? fn : (val) => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});
};

// console.log(groupBy(villager, TYPE_MAPS.villager.groupBy));
