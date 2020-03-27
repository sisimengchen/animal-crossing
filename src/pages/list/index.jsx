import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { globalObject } from '../../data';
import { cacheDataGet, cacheDataRemove } from '../../utils/cache';
import './index.scss';

export default class List extends Component {
  constructor() {
    super(...arguments);
    // insect fish
    const { type = 'fish' } = this.$router.params;
    this.list = globalObject.getList(type);
    this.state = {
      type,
      list: this.list
    };
    // console.log(this.state);
  }

  config = {
    navigationBarTitleText: '图鉴'
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    const { type } = this.state;
    if (type) {
      Taro.setNavigationBarTitle({
        title: globalObject.getType(type) + '图鉴'
      });
    }
    const filterState = cacheDataGet('PAGES_FILTER_STATE');
    if (filterState) {
      // cacheDataRemove('PAGES_FILTER_STATE');
      console.log(filterState);
    }
  }

  componentDidHide() {}

  render() {
    const { type, list = [] } = this.state;
    return (
      <View className="page list-page">
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
                <Text className="name">{item.name}</Text>
                <Text className="price">{item.price}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
