import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { globalObject, ALL_MONTH } from '../../data';
import './index.scss';

export default class Detail extends Component {
  constructor() {
    super(...arguments);
    const { type = 'fish', id = '1' } = this.$router.params;
    const data = globalObject.getData(type, id);
    this.state = {
      type,
      id,
      monthKey: 'month_n',
      data: globalObject.formate(type, data)
    };
    this.imageSrc = `/images/animals/${type}/${type}${(id + '').padStart(
      3,
      '0'
    )}.png`;
  }

  config = {
    navigationBarTitleText: ''
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    const { data = {} } = this.state;
    data.name &&
      Taro.setNavigationBarTitle({
        title: data.name
      });
  }

  componentDidHide() {}

  onShareAppMessage(options) {
    const { data = {} } = this.state;
    return {
      title: data.name
    };
  }

  render() {
    const { type, id, monthKey, data = {} } = this.state;
    const month = data[monthKey] || [];
    return (
      <View className="page detail-page">
        <View className="top">
          <View className="icon">
            <Image src={this.imageSrc} />
          </View>
          <View className="name">{data.name}</View>
          <View className="infos">
            <View className="info">
              <View className="title">时间</View>
              <View className="text">{data.timeStr}</View>
            </View>
            <View className="info">
              <View className="title">地点</View>
              <View className="text">{data.placeStr}</View>
            </View>
            {data.shapeStr ? (
              <View className="info">
                <View className="title">鱼影</View>
                <View className="text">{data.shapeStr}</View>
              </View>
            ) : null}
            {data.conditStr ? (
              <View className="info">
                <View className="title">天气</View>
                <View className="text">{data.conditStr}</View>
              </View>
            ) : null}
          </View>
        </View>
        <View className="middle">
          <View className="title">
            活跃期
            <View className="switch">
              <View
                className={`item left${monthKey == 'month_s' ? ' active' : ''}`}
                onClick={() => {
                  this.setState({ monthKey: 'month_s' });
                }}
              >
                南半球
              </View>
              <View
                className={`item right${
                  monthKey == 'month_n' ? ' active' : ''
                }`}
                onClick={() => {
                  this.setState({ monthKey: 'month_n' });
                }}
              >
                北半球
              </View>
            </View>
          </View>
          <View className="months">
            {ALL_MONTH.map((item, index) => {
              const isActive = month.includes(item);
              return (
                <View className={`month${isActive ? ' active' : ''}`}>
                  <View>{item}月</View>
                </View>
              );
            })}
          </View>
        </View>
        <View className="bottom">
          <View className="title">售价</View>
          <View className="text">{data.price}</View>
        </View>
      </View>
    );
  }
}
