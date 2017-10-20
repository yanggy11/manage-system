<template>
    <div class="table">
        <div>
            <el-form :inline="true" :model="criteria" class="demo-form-inline" style="display:flex; justify-content: space-between;">
                <el-form-item>
                    <el-button type="primary" @click="openUserInfo(0,undefined)">新增</el-button>
                </el-form-item>
                <div>
                    <el-form-item label="姓名">
                        <el-input v-model="criteria.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select v-model="criteria.sex" placeholder="请选择">
                            <el-option v-for="item in genders" :label="item.label" :value="item.value" :key="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-table v-loading.body="loading" :data="tableData" border>
            <el-table-column prop="name" label="姓名" align="center" width="140">
            </el-table-column>
            <el-table-column prop="age" label="年龄" align="center" width="105">
            </el-table-column>
            <el-table-column prop="sex" label="性别" align="center" :formatter="sexFormatter" width="105">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="手机号" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="220">
                <template scope="scope">
                    <el-button size="small" @click="openUserInfo(1, scope.row.id)" icon="delete">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteUser(scope.row.id)" icon="delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes,total, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 30]" :total="total" :page-size="cur_size">
            </el-pagination>
        </div>
        <div style="width:30%;">
            <el-dialog title="用户信息" :visible.sync="userInfoDialog" :modal="true">
                <el-form>
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                        <el-input v-model="userInfo.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" :label-width="formLabelWidth">
                        <el-input v-model="userInfo.age" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth">
                        <el-input v-model="userInfo.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="userInfo.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选择" :label-width="formLabelWidth">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox label="复选框 A"></el-checkbox>
                            <el-checkbox label="复选框 B"></el-checkbox>
                            <el-checkbox label="复选框 C"></el-checkbox>
                            <el-checkbox label="禁用"></el-checkbox>
                            <br>
                            <el-checkbox label="选中且禁用"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" v-if="userInfo.id == undefined">
                        <el-input type="password" v-model="userInfo.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-radio v-model="userInfo.sex" class="radio" :label="1">女</el-radio>
                        <el-radio v-model="userInfo.sex" class="radio" :label="0">男</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="userInfoDialog = false">取 消</el-button>
                    <el-button type="primary" @click="saveUserInfo()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            cur_size: 15,
            total: 1,
            loading: true,
            userInfoDialog: false,
            formLabelWidth: '80px',
            userInfo: {},
            genders: [{
                value: "0",
                label: "男"
            }, {
                value: "1",
                label: "女"
            }],
            criteria: {
                gender: ''
            },
             checkList: ['选中且禁用','复选框 A']
        }
    },
    created() {
        this.getData(this.cur_page, this.cur_size);
    },
    methods: {
        handleSizeChange(val) {
            this.cur_size = val;
            this.getData(1, val);
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData(val, this.cur_size);
        },
        getData(currentPage, currentSize) {
            let self = this;
            self.$http.post('http://localhost:1987' + '/users/api/user/userList', { page: currentPage, pageSize: currentSize }, { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).then(function(data) {

                let pageData = data.body;
                self.total = pageData.totalRecord;
                self.tableData = data.body.data;
                self.loading = false;

                this.$message.success("成功加载用户！");
            }, function(data) {
                this.$$message.error("加载失败!");
            })
        },
        sexFormatter(row, column) {
            if (row.sex === 0) {
                return "男";
            }
            return "女";
        },
        openUserInfo(flag, userId) {
            let self = this;
            self.userInfoDialog = true;
            if (flag == 1) {
                self.$http.post('http://localhost:1987' + '/users/api/user/getUserById', { userId: userId },
                    { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                    then(function(data) {
                        self.userInfo = data.body.data;
                    }, function(data) {
                        this.$message.error("加载失败!");
                    });
            } else {
                self.userInfo = { sex: 1 };
            }
        },
        saveUserInfo() {
            console.log(this.userInfo);
            if (this.userInfo.id == undefined) {
                this.addUser();
            } else {
                this.updateUser();
            }
        },
        updateUser() {
            this.$http.post('http://localhost:1987' + '/users/api/user/updateUserInfo', this.userInfo,
                { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                then(function(data) {
                    this.userInfoDialog = false;
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.getData(this.cur_page, this.cur_size);
                }, function(data) {
                    this.$message.error("加载失败!");
                });
        },
        addUser() {
            this.$http.post('http://localhost:1987' + '/users/api/user/register', this.userInfo,
                { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                then(function(data) {
                    this.userInfoDialog = false;
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.getData(this.cur_page, this.cur_size);
                }, function(data) {
                    this.$message.error("加载失败!");
                });
        },
        deleteUser(userId) {
            console.log(userId);
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('http://localhost:1987' + '/users/api/user/delete', { userId: userId },
                    { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                    then(function(data) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getData(this.cur_page, this.cur_size);
                    }, function(data) {
                        this.$message.error("加载失败!");
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style scope>
.el-dialog__wrapper .el-input__inner {
    width: 70%;
}

.el-dialog__wrapper .input {
    width: 70%;
}

.criteria {
    text-align: right;
    display: flex;
}

.table .el-dialog--small {
    width: 30%;
}

.table .el-dialog {
    width: 30%;
}

.table .el-button {
    margin-bottom: 0px;
}

.table .criteria {
    text-align: right;
}

.el-dialog__header {
    height: 30;
    padding: 20px 20px 0;
    text-align: left;
    background-color: lightblue;
}
</style>
