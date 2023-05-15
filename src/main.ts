import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(store)
  .use(router)
  .use(ElementPlus);
app.mount('#app');

// 禁止滚动条
document.body.style.overflow = 'hidden';
document.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, false);// 禁止页面滑动
