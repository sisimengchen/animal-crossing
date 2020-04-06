import Taro, { Component } from '@tarojs/taro';
import Index from './pages/index';
import { read, save } from './utils/localStorage';
import './app.scss';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
let interstitialAd = null;

class App extends Component {
  constructor() {
    super(...arguments);
    const monthKey = read('GLOBAL_MONTH_KEY');
    if (!monthKey) {
      save('GLOBAL_MONTH_KEY', 'month_n');
    }
    if (Taro.createInterstitialAd) {
      interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-6093d8dad98f06b2'
      });
      interstitialAd.onLoad(() => {});
      interstitialAd.onError((err) => {});
      interstitialAd.onClose(() => {});
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err);
        });
      }
    }
  }

  config = {
    pages: [
      'pages/index/index',
      'pages/list/index',
      'pages/filter/index',
      'pages/filterout/index',
      'pages/detail/index',
      'pages/about/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#834B16',
      navigationBarTitleText: '动森图鉴',
      navigationBarTextStyle: 'white'
    },
    navigateToMiniProgramAppIdList: ['wxa52657922aaaae3f']
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById('app'));
