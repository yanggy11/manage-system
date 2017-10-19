<template>
    <div class="table">
        <el-button type="primary" @click="openUserInfo(0, 0)">新增</el-button>
        <el-table v-loading.body="loading" :data="tableData" border style="width: 100%;">
            <el-table-column prop="id" label="ID" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="age" label="年龄" align="center">
            </el-table-column>
            <el-table-column prop="sex" label="性别" align="center" :formatter="sexFormatter">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button size="small" @click="openUserInfo(1, scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="sizes,total, prev, pager, next, jumper" :page-sizes="[10, 15, 20, 30]" :total="total" :page-size="cur_size">
            </el-pagination>
        </div>
        <div style="width:30%;">
            <el-dialog title="收货地址" :visible.sync="userInfoDialog" :modal="true">
                <el-form :model="form">
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
                    <el-form-item label="密码" :label-width="formLabelWidth">
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
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: ''
            },
            cur_page: 1,
            cur_size: 20,
            total: 1,
            loading: true,
            userInfoDialog: false,
            formLabelWidth: '120px',
            userInfo: {}
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
            console.log(val);
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

                this.$message("成功加载用户！");
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
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.$message('编辑第' + (index + 1) + '行');
        },
        handleDelete(index, row) {
            this.$message.error('删除第' + (index + 1) + '行');
        },
        onSubmit() {
            this.$message.success('提交成功！');
        },
        openUserInfo(flag, userId) {
            console.log(flag);
            let self = this;
            self.userInfoDialog = true;
            if(flag == 1) {
                self.$http.post('http://localhost:1987' + '/users/api/user/getUserById', { userId: userId },
                    { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                    then(function(data) {
                        console.log(data);
                        self.userInfo = data.body.data;
                    }, function(data) {
                        this.$message.error("加载失败!");
                    });
            }else {
                self.userInfo = {sex:1};
            }
        },
        saveUserInfo() {
            console.log(this.userInfo);
            if(this.userInfo.id == undefined) {
                this.addUser();
            }else {
                updateUser();
            }
        },
        updateUser() {
             this.$http.post('http://localhost:1987' + '/users/api/user/updateUserInfo', this.userInfo,
                { headers: { "Authorization": localStorage.getItem("AuthenticationToken") } }).
                then(function(data) {
                    this.userInfoDialog = false;
                    this.$message("保存成功！");
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
                    this.$message("保存成功！");
                    this.getData(this.cur_page, this.cur_size);
                }, function(data) {
                    this.$message.error("加载失败!");
                });
        }
    }
}
</script>

<style scope>
.table .el-input__inner {
    width: 60%;
}
.table .el-dialog--small {
    width: 30%;
}
.table .el-dialog {
    width: 30%;
}
.table .el-button {
    margin-bottom: 5px;
}
</style>
