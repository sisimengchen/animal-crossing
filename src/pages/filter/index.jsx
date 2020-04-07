import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtRange } from 'taro-ui';
import { ALL_MONTH, ALL_SPECIES, ALL_PERSONALITY } from '../../data';
import { cacheDataSet } from '../../utils/cache';
import { read } from '../../utils/localStorage';
import './index.scss';

export default class Filter extends Component {
  constructor() {
    super(...arguments);
    const { type = 'fish' } = this.$router.params;
    this.state = {
      type,
      monthKey: read('GLOBAL_MONTH_KEY'),
      month: [],
      startTime: 0,
      endTime: 24,
      species: undefined,
      birth_month: undefined,
      personality: undefined
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

  check() {
    const {
      type,
      month = [],
      startTime,
      endTime,
      species,
      birth_month,
      personality
    } = this.state;
    if (type == 'villager' && !species && !birth_month && !personality) {
      Taro.showToast({
        title: '请选择筛选条件',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (type != 'villager' && month.length == 0 && startTime == 0 && endTime == 24) {
      Taro.showToast({
        title: '请选择筛选条件',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    return true;
  }

  render() {
    const {
      type,
      monthKey,
      month = [],
      startTime,
      endTime,
      species,
      birth_month,
      personality
    } = this.state;
    return (
      <View className="page filter-page">
        {type == 'villager' ? (
          <View>
            <View className="condition">
              <View className="title">性格</View>
              <View className="months">
                {ALL_PERSONALITY.map((item, index) => {
                  const isActive = item.value == personality;
                  return (
                    <View
                      key={item.value}
                      className={`month${isActive ? ' active' : ''}`}
                      onClick={() => {
                        this.setState({
                          personality: isActive ? undefined : item.value
                        });
                      }}
                    >
                      <View>{item.text}</View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View className="condition">
              <View className="title">生日</View>
              <View className="months">
                {ALL_MONTH.map((item, index) => {
                  const isActive = item == birth_month;
                  return (
                    <View
                      key={item}
                      className={`month${isActive ? ' active' : ''}`}
                      onClick={() => {
                        this.setState({
                          birth_month: isActive ? undefined : item
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
              <View className="title">种族</View>
              <View className="months">
                {ALL_SPECIES.map((item, index) => {
                  const isActive = item.value == species;
                  return (
                    <View
                      key={item.value}
                      className={`month${isActive ? ' active' : ''}`}
                      onClick={() => {
                        this.setState({
                          species: isActive ? undefined : item.value
                        });
                      }}
                    >
                      <View>{item.text}</View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View className="condition">
              <View className="title">活跃期</View>
              <View className="months">
                {ALL_MONTH.map((item, index) => {
                  const isActive = month.includes(item);
                  return (
                    <View
                      key={item}
                      className={`month${isActive ? ' active' : ''}`}
                      onClick={() => {
                        this.setState({
                          month: isActive
                            ? month.filter((n) => n != item)
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
                <Text className="time">
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
          </View>
        )}
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
              if (!this.check()) return;
              cacheDataSet('PAGES_FILTER_STATE', {
                monthKey,
                month,
                startTime,
                endTime,
                species,
                birth_month,
                personality
              });
              Taro.navigateTo({
                url: `/pages/filterout/index?type=${type}`
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
