import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import VueResource from 'vue-resource';

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.prototype.$axios = axios;
Vue.http.interceptors.push((request, next) => {
    let token = localStorage.getItem('AuthenticationToken');
    if (token) {
        request.headers.set('Authorization', token);
    }
    next((response) => {
        return response;
    });
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
