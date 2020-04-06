import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Ad, Button } from '@tarojs/components';
import { globalObject, ALL_MONTH } from '../../data';
import { read } from '../../utils/localStorage';
import './index.scss';

export default class Detail extends Component {
  constructor() {
    super(...arguments);
    const { type, id } = this.$router.params;
    this.state = {
      type,
      id,
      monthKey: read('GLOBAL_MONTH_KEY'),
      data: {}
    };
  }

  config = {
    navigationBarTitleText: ''
  };

  componentWillMount() {}

  componentDidMount() {
    const { type, id } = this.state;
    if (type && id) {
      this.imageSrc = `/images/animals/${type}/${type}${(id + '').padStart(
        3,
        '0'
      )}.png`;
      const data = globalObject.getData(type, id);
      console.log(data);
      console.log(globalObject.formate(type, data));
      Taro.setNavigationBarTitle({
        title: data.name
      });
      this.setState({
        data: globalObject.formate(type, data)
      });
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

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
            {data.timeStr ? (
              <View className="info">
                <View className="title">时间</View>
                <View className="text">{data.timeStr}</View>
              </View>
            ) : null}
            {data.placeStr ? (
              <View className="info">
                <View className="title">地点</View>
                <View className="text">{data.placeStr}</View>
              </View>
            ) : null}
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
            {data.speciesStr ? (
              <View className="info">
                <View className="title">种族</View>
                <View className="text">{data.speciesStr}</View>
              </View>
            ) : null}
            {data.personalityStr ? (
              <View className="info">
                <View className="title">性格</View>
                <View className="text">{data.personalityStr}</View>
              </View>
            ) : null}
            {data.birthStr ? (
              <View className="info">
                <View className="title">生日</View>
                <View className="text">{data.birthStr}</View>
              </View>
            ) : null}
          </View>
        </View>
        {type == 'villager' ? null : (
          <View className="active-phase">
            <View className="title">
              活跃期
              {data.expireDays > -1 && data.expireDays <= 7 ? (
                <Text className="expire-days">
                  {data.expireDays == 0
                    ? '最后一天'
                    : data.expireDays + '天后到期'}
                </Text>
              ) : null}
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
        )}
        {data.price ? (
          <View className="price">
            <View className="title">售价</View>
            <View className="text">{data.price}</View>
            <Button className="share-btn" open-type="share">
              分享
            </Button>
          </View>
        ) : null}
        {data.phrase || data.motto ? (
          <View className="attributes">
            <View className="attribute">
              <View className="title">口头禅</View>
              <View className="text">{data.phrase}</View>
            </View>
            <View className="attribute">
              <View className="title">座右铭</View>
              <View className="text">{data.motto}</View>
            </View>
          </View>
        ) : null}
        <Ad
          unit-id="adunit-1ca3aa42a68d3a78"
          ad-type="grid"
          grid-opacity="0.8"
          grid-count="5"
          ad-theme="white"
        ></Ad>
      </View>
    );
  }
}
