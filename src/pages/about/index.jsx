import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

export default class About extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
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
    const { list = [] } = this.state;
    return <View className="page about-page">关于</View>;
  }
}
