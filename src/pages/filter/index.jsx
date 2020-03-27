import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtRange } from 'taro-ui';
import { ALL_MONTH } from '../../data';
import { cacheDataSet } from '../../utils/cache';
import './index.scss';

export default class Filter extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      month: [],
      startTime: 0,
      endTime: 24
    };
  }

  config = {
    navigationBarTitleText: '筛选'
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleChange(value) {
    const [startTime, endTime] = value;
    this.setState({
      startTime,
      endTime
    });
  }

  render() {
    const { month = [], startTime, endTime } = this.state;
    return (
      <View className="page filter-page">
        <View className="condition">
          <View className="title">活跃期</View>
          <View className="months">
            {ALL_MONTH.map((item, index) => {
              const isActive = month.includes(item);
              return (
                <View
                  className={`month${isActive ? ' active' : ''}`}
                  onClick={() => {
                    this.setState({
                      month: isActive
                        ? month.filter(n => n != item)
                        : month.concat(item)
                    });
                  }}
                >
                  <View>{item}月</View>
                </View>
              );
            })}
          </View>
        </View>
        <View className="condition">
          <View className="title">
            时间
            <Text>
              {startTime}点~{endTime}点
            </Text>
          </View>
          <View className="range">
            <AtRange
              value={[startTime, endTime]}
              min={0}
              max={24}
              sliderStyle={{ border: '2rpx solid rgba(0,0,0,0.1)' }}
              trackStyle={{ height: '4PX' }}
              railStyle={{ height: '4PX' }}
              onChange={this.handleChange.bind(this)}
            />
          </View>
        </View>
        <View className="fixed-btns-view">
          <Button
            onClick={() => {
              this.setState({
                month: [],
                startTime: 0,
                endTime: 24
              });
            }}
          >
            重置
          </Button>
          <Button
            onClick={() => {
              cacheDataSet('PAGES_FILTER_STATE', this.state);
              Taro.navigateBack({
                delta: 1
              });
            }}
          >
            确定
          </Button>
        </View>
      </View>
    );
  }
}
