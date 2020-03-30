import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { read, save } from '../../utils/localStorage';
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
        }
      ],
      miniProgramList: [
        {
          icon: '/images/icon_cokedex.png',
          text: '可乐图鉴Pokedex',
          appId: 'wxa52657922aaaae3f'
        }
      ],
      monthKey: read('GLOBAL_MONTH_KEY')
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
    const { list = [], miniProgramList = [], monthKey } = this.state;
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
        <View className="table">
          <View
            className="item"
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/about/index'
              });
            }}
          >
            <View className="title">关于LatteDex</View>
            <View className="text">Ver 1.0</View>
          </View>
          <View
            className="item"
            onClick={() => {
              const data = monthKey == 'month_n' ? 'month_s' : 'month_n';
              save('GLOBAL_MONTH_KEY', data);
              this.setState(
                {
                  monthKey: data
                },
                () => {
                  Taro.showToast({
                    title: `游戏环境切换到${
                      data == 'month_n' ? '北' : '南'
                    }半球`,
                    icon: 'none',
                    duration: 2000
                  });
                }
              );
            }}
          >
            <View className="title">游戏环境</View>
            <View className="text">
              {monthKey == 'month_n' ? '北半球' : '南半球'}
            </View>
          </View>
        </View>
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
