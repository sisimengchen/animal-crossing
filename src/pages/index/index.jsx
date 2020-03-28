import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [
        {
          icon: '/images/animals/fish/fish001.png',
          text: '鱼图鉴',
          url: '/pages/list/index?type=fish'
        },
        {
          icon: '/images/animals/insect/insect001.png',
          text: '昆虫图鉴',
          url: '/pages/list/index?type=insect'
        },
        {
          icon: '/images/icon_lattedex.png',
          text: '关于',
          url: '/pages/about/index'
        }
      ],
      miniProgramList: [
        {
          icon: '/images/icon_cokedex.png',
          text: '可乐图鉴Pokedex',
          appId: 'wxa52657922aaaae3f'
        }
      ]
    };
  }

  config = {
    navigationBarTitleText: '动森图鉴'
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage(options) {}

  render() {
    const { list = [], miniProgramList = [] } = this.state;
    return (
      <View className="page index-page">
        {list.map((item, index) => {
          return (
            <View
              key={item.url}
              className="card"
              onClick={() => {
                Taro.navigateTo({
                  url: item.url
                });
              }}
            >
              <Image src={item.icon} />
              <Text>{item.text}</Text>
            </View>
          );
        })}
        <View className="mini-title">—— 我们的其他作品 ——</View>
        {miniProgramList.map((item, index) => {
          return (
            <View
              key={item.url}
              className="card"
              onClick={() => {
                Taro.navigateToMiniProgram({
                  appId: item.appId
                });
              }}
            >
              <Image src={item.icon} />
              <Text>{item.text}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}
