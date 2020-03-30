import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Ad } from '@tarojs/components';
import { globalObject } from '../../data';
import './index.scss';

export default class List extends Component {
  constructor() {
    super(...arguments);
    // insect fish
    const { type } = this.$router.params;
    this.state = {
      type,
      order: 'id|asc',
      list: []
    };
    this.orderList = [
      { value: '', text: '排序' },
      { value: 'id|asc', text: '编号↑' },
      { value: 'id|desc', text: '编号↓' },
      { value: 'price|asc', text: '售价↑' },
      { value: 'price|desc', text: '售价↓' }
    ];
  }

  config = {
    navigationBarTitleText: '图鉴'
  };

  componentWillMount() {}

  componentDidMount() {
    const { type } = this.state;
    if (type) {
      this.setState({
        list: globalObject.getList(type)
      });
    }
  }

  componentWillUnmount() {}

  componentDidShow() {
    const { type } = this.state;
    if (type) {
      Taro.setNavigationBarTitle({
        title: globalObject.getType(type) + '图鉴'
      });
    }
  }

  componentDidHide() {}

  sort(order) {
    if (!order) return;
    const [attribute = 'id', type = 'asc'] = order.split('|');
    this.setState({
      order,
      list: this.state.list.sort(function(a, b) {
        if (type == 'asc') {
          return a[attribute] - b[attribute];
        }
        return b[attribute] - a[attribute];
      })
    });
  }

  render() {
    const { type, order, list = [] } = this.state;
    return (
      <View className="page list-page">
        <Ad unit-id="adunit-6ef6284998be6d4f"></Ad>
        <View className="order-list">
          {this.orderList.map((item, index) => {
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
        <View className="animal-list">
          {list.map((item, index) => {
            const imageSrc = `/images/animals/${type}/${type}${(
              item.id + ''
            ).padStart(3, '0')}.png`;
            return (
              <View
                className="animal"
                key={item.id}
                onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/detail/index?type=${type}&id=${item.id}`
                  });
                }}
              >
                <View className="icon">
                  <Image src={imageSrc} />
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
                <View className="price">{item.price}</View>
              </View>
            );
          })}
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
