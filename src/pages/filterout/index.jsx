import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Ad } from '@tarojs/components';
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
    console.log(filterState)
    this.setState({
      list: globalObject.filter(type, filterState)
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { type, list = [] } = this.state;
    return (
      <View className="page filterout-page">
        <Ad
          unit-id="adunit-20eec8de555f176b"
          ad-type="grid"
          grid-opacity="0.8"
          grid-count="5"
          ad-theme="white"
        ></Ad>
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
                  {item.is_birth_month ? (
                    <Text className="expire-days">本月生日</Text>
                  ) : null}
                </View>
                {item.price ? (
                  <View className="price">{item.price}</View>
                ) : null}
                {item.birthStr ? (
                  <View className="price">{item.birthStr}</View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
