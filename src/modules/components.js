// 组件
import ElementPlus from 'element-plus';
import ArcoVue, { Notification } from '@arco-design/web-vue';
import globalCompos from '../components';
import 'element-plus/dist/index.css';
import '@arco-design/web-vue/dist/arco.css';

// 图标
// element
import * as Icons from '@element-plus/icons-vue';
// arco
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// svg
import 'virtual:svg-icons-register';
import svgIcon from '@/icons/SvgIcon.vue';
import remixIcon from '@/icons/RemixIcon.vue';

export default (app, lang, settings) => {
  // 组件安装
  app.use(ElementPlus, {
    size: localStorage.getItem('size') || settings.defaultSize,
    locale: lang[localStorage.getItem('language') || settings.defaultLanguage],
  });
  app.use(ArcoVue, {
    size: localStorage.getItem('size') || settings.defaultSize,
    locale: lang[localStorage.getItem('language') || settings.defaultLanguage],
  });
  app.use(globalCompos);
  Notification._context = app._context;

  // 图标注册
  Object.keys(Icons).forEach((key) => {
    app.component(key, Icons[key]);
  });
  app.component('SvgIcon', svgIcon);
  app.component('RemixIcon', remixIcon);
  app.use(ArcoVueIcon);
};
