import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

export default class About extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      updateList: [
        {
          version: '0.9',
          date: '2020.03.29',
          updateItems: [
            '萌新入坑，做个图鉴自己用；',
            '收录了《集合啦！动物森友会》中的鱼和昆虫资料；',
            '支持按活跃期、时间筛选鱼和昆虫。'
          ]
        },
        {
          version: '1.0',
          date: '2020.03.31',
          updateItems: [
            '优化了切换南北半球的体验；',
            '支持按编号、售价对图鉴进行排序。',
            '新增到期提醒。'
          ]
        }
      ]
    };
  }

  config = {
    navigationBarTitleText: '关于'
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { updateList = [] } = this.state;
    return (
      <View className="page about-page">
        <View className="updates">
          {updateList.map((update, index) => {
            return (
              <View key={index} className="update">
                <View className="version">Ver {update.version}</View>
                <View className="date">{update.date}</View>
                <View className="itemList">
                  {update.updateItems.map(item => {
                    return <View>{item}</View>;
                  })}
                </View>
              </View>
            );
          })}
        </View>
        <View className="author">
          <Image src="/images/minilogo.png"></Image>
          <Text>made by mengchen & pangboran</Text>
          <Text>dedicated to all Animal Crossing residents</Text>
        </View>
      </View>
    );
  }
}
