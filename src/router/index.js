import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/routes',
                    component: resolve => require(['../components/page/routes.vue'], resolve)
                },
                {
                    path: '/menus',
                    component: resolve => require(['../components/page/menus.vue'], resolve)
                },
                {
                    path: '/roles',
                    component: resolve => require(['../components/page/roles.vue'], resolve)
                },
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                },
                  {
                    path: '/userList',
                    component: resolve => require(['../components/page/userList.vue'], resolve)    // 拖拽列表组件
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
