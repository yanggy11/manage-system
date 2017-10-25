<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'readme',
                        title: '自述'
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '数据管理',
                        subs: [
                            {
                                index: 'userList',
                                title: '用户管理'
                            },
                            {
                                index: 'roles',
                                title: '权限管理'
                            },
                            {
                                index: 'menus',
                                title: '菜单管理'
                            },
                            {
                                index: 'routes',
                                title: '路由管理'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 170px;
        left: 0;
        top: 70px;
        bottom:0;
        background: black;
        alignment: left;
    }
    .sidebar > ul {
        height:100%;
    }
    .el-menu {
        border-radius: 2px;
        list-style: none;
        position: relative;
        margin: 0;
        padding-left: 0;
        background-color:black;
    }

    .sidebar .content {
        background: none repeat scroll 0 0 #fff;
        position: absolute;
        left: 0px;
        right: 0;
        top: 70px;
        bottom: 0;
        width: auto;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: scroll;
    }
</style>
