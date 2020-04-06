import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Ad } from '@tarojs/components';
import { globalObject } from '../../data';
import './index.scss';

const orderList = [
  { value: '', text: '排序' },
  { value: 'id|asc', text: '编号↑' },
  { value: 'id|desc', text: '编号↓' },
  { value: 'price|asc', text: '售价↑' },
  { value: 'price|desc', text: '售价↓' }
];

export default class List extends Component {
  constructor() {
    super(...arguments);
    // insect fish
    const { type } = this.$router.params;
    this.state = {
      type,
      order: 'id|asc',
      groupKeys: [],
      groupkey: '',
      list: []
    };
  }

  config = {
    navigationBarTitleText: '图鉴'
  };

  componentWillMount() {}

  componentDidMount() {
    const { type } = this.state;
    if (type) {
      Taro.setNavigationBarTitle({
        title: globalObject.getType(type).name + '图鉴'
      });
      const group = globalObject.group(type);
      let list;
      let groupKeys;
      let groupkey = '';
      if (Array.isArray(group)) {
        groupKeys = [];
        list = group;
      } else {
        groupKeys = Object.keys(group);
        list = [];
        for (let i = 0; i < groupKeys.length; i++) {
          const key = groupKeys[i];
          list.push({
            id: `group_id_${key}`,
            className: `group_bar_${key}`,
            type: 'group_key',
            name: key
            // index: i
          });
          group[key][0].className = `group_bar_${key}`;
          list = list.concat(group[key]);
          if (i == 0) {
            groupkey = key;
          }
        }
      }
      console.log(groupKeys, list);
      this.setState({
        groupKeys,
        list,
        groupkey
      });
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage(options) {
    const { type } = this.state;
    return {
      title: globalObject.getType(type).name + '图鉴'
    };
  }

  sort(order) {
    if (!order) return;
    const { type } = this.state;
    this.setState({
      order,
      list: globalObject.sort(type, order)
    });
  }

  group(groupkey) {
    if (!groupkey) return;
    this.setState(
      {
        groupkey
      },
      () => {
        Taro.pageScrollTo({
          selector: `.group_bar_${groupkey}`
        });
      }
    );
  }

  render() {
    const { type, order, groupkey, groupKeys = [], list = [] } = this.state;
    return (
      <View className="page list-page">
        <Ad
          unit-id="adunit-2afa35e18c9ee0e9"
          ad-type="grid"
          grid-opacity="0.8"
          grid-count="5"
          ad-theme="white"
        ></Ad>
        {groupKeys.length ? (
          <View className="group-list">
            {groupKeys.map((item, index) => {
              return (
                <View
                  key={item}
                  className={`item${groupkey == item ? ' active' : ''}`}
                  onClick={() => {
                    this.group(item);
                  }}
                >
                  {item}
                </View>
              );
            })}
          </View>
        ) : (
          <View className="order-list">
            {orderList.map((item, index) => {
              return (
                <View
                  key={item.value}
                  className={`item${order == item.value ? ' active' : ''}`}
                  onClick={() => {
                    this.sort(item.value);
                  }}
                >
                  {item.text}
                </View>
              );
            })}
          </View>
        )}
        <View className="animal-list">
          {list.map((item, index) =>
            item.type == 'group_key' ? (
              <View key={item.id} className="group_bar">
                {item.name}
              </View>
            ) : (
              <View
                key={item.id}
                className={`animal ${item.className ? item.className : ''}`}
                onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/detail/index?type=${type}&id=${item.id}`
                  });
                }}
              >
                <View className="icon">
                  <Image
                    src={`/images/animals/${type}/${type}${(
                      item.id + ''
                    ).padStart(3, '0')}.png`}
                  />
                </View>
                <View className="name">
                  {item.name}
                  {item.expireDays > -1 && item.expireDays <= 7 ? (
                    <Text className="expire-days">
                      {item.expireDays == 0
                        ? '最后一天'
                        : item.expireDays + '天后到期'}
                    </Text>
                  ) : null}
                </View>
                {item.price ? (
                  <View className="price">{item.price}</View>
                ) : null}
              </View>
            )
          )}
        </View>
        <View
          className="filter"
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/filter/index?type=${type}`
            });
          }}
        >
          筛选
        </View>
      </View>
    );
  }
}
