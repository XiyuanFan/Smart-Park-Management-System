import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
// 已接入真实后端（server/ 目录），不再需要 Mock.js 拦截请求。
// 如需切回纯前端演示，取消下面这行注释即可。
// import "./mock"
import { Provider } from 'react-redux';
import { store } from './store';
import {ConfigProvider} from "antd"
import zhCN from 'antd/locale/zh_CN';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render( 
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>
);

/**
 *  面试题 1：ConfigProvider 的作用是什么？
  答：ConfigProvider 是 Ant Design 提供的全局配置容器，可以统一设置国际化语言、主题、组件尺寸、前缀类名等配置，让整套组
  件在全局范围内保持一致。

  面试题 2：为什么 ConfigProvider 适合放在入口文件？
  答：因为它的配置通常希望作用于整个应用，比如语言、主题、尺寸等。放在入口文件统一包裹后，所有页面和组件都能共享这套配
  置，减少重复代码。
 */