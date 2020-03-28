import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { globalObject } from '../../data';
import { cacheDataGet } from '../../utils/cache';
import './index.scss';

export default class Filterout extends Component {
  constructor() {
    super(...arguments);
    const { type = 'fish' } = this.$router.params;
    this.state = {
      type,
      list: []
    };
  }

  config = {
    navigationBarTitleText: '筛选结果'
  };

  componentWillMount() {}

  componentDidMount() {
    const { type } = this.state;
    const filterState = cacheDataGet('PAGES_FILTER_STATE');
    console.log(filterState);
    this.setState({
      list: globalObject.filterList(type, filterState)
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { type, list = [] } = this.state;
    return (
      <View className="page filterout-page">
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
