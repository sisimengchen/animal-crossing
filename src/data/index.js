import fish from './fish';
import fishmap from './fishmap';
import insect from './insect';
import insectmap from './insectmap';

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
    return list;
  },
  getData: function(type, id) {
    const list = this.getList(type);
    const data = list[parseInt(id) - 1];
    return data;
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
    }
    if (data.condit) {
      data.conditStr = this.getText(type, 'condit', data.condit);
    }
    console.log(data);
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
  }
};
