import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { globalObject } from '../../data';
import './index.scss';

export default class List extends Component {
  constructor() {
    super(...arguments);
    // insect fish
    const { type = 'fish' } = this.$router.params;
    this.state = {
      type,
      list: []
    };
  }

  config = {
    navigationBarTitleText: '图鉴'
  };

  componentWillMount() {}

  componentDidMount() {
    const { type } = this.state;
    this.setState({
      list: globalObject.getList(type)
    });
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
        <Image
          className="filter"
          src={require('../../images/filter.png')}
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/filter/index?type=${type}`
            });
          }}
        />
      </View>
    );
  }
}
