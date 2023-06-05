import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import en from 'element-plus/es/locale/lang/en';
import zh from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';
import settings from '@/settings';
// 多语言
import i18n from '@/locale';
// 主题
import '@/themes/darkmenu.css';
// 图标
import 'remixicon/fonts/remixicon.css';
// mock
import './mock';
// 各种组件配置
import installCompo from '@/modules/components';
// 导入代码高亮文件
import installHignlight from '@/modules/highlight';
// 3d组件
import installPlugin from '@/modules/plugin';
// 低代码相关
import installLowcode from '@/modules/lowcode';
// 日志收集
import installLog from '@/modules/log';
// 自定义指令
import directive from '@/directive';
// 全局样式
import '@/styles/index.scss';
// 权限拦截
import './permission';

const app = createApp(App);

// pinia
app.use(createPinia());

// 安装组件库
const lang = { zh, en };
installCompo(app, lang, settings);

// 低代码
installLowcode(app);

// 代码高亮
installHignlight(app);

// 3d
installPlugin(app);

// 日志
installLog(app);

// 自定义指令
directive(app);

app.use(i18n);
app.use(router);
app.mount('#app');
