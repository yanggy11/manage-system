<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="表单名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="选择器">
                            <el-select v-model="form.region" placeholder="请选择">
                                <el-option key="bbk" label="步步高" value="bbk"></el-option>
                                <el-option key="xtc" label="小天才" value="xtc"></el-option>
                                <el-option key="imoo" label="imoo" value="imoo"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日期时间">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="多选框">
                            <el-checkbox-group v-model="form.type">
                                <el-checkbox label="步步高" name="type"></el-checkbox>
                                <el-checkbox label="小天才" name="type"></el-checkbox>
                                <el-checkbox label="imoo" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>

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
                    <el-button size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change ="handleCurrentChange"
                    layout="sizes,total, prev, pager, next, jumper"
                    :page-sizes="[10, 15, 20, 30]"
                    :total="total"
                    :page-size="cur_size">
            </el-pagination>
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
                cur_size: 10,
                total:1,
                loading: true
            }
        },
        created(){
            this.getData(this.cur_page,this.cur_size);
        },
        methods: {
            handleSizeChange(val) {
                this.cur_size = val;
                this.getData(1, val);
            },
            handleCurrentChange(val){
                console.log(val);
                this.cur_page = val;
                this.getData(val, this.cur_size);
            },
            getData(currentPage, currentSize){
                let self = this;
                self.$http.post('http://localhost:1987'+'/users/api/user/userList',{page:currentPage,pageSize:currentSize},{headers:{"Authorization":localStorage.getItem("AuthenticationToken")}}).then(function(data) {
                    
                    let pageData = data.body;
                    self.total = pageData.totalRecord;
                    self.tableData = data.body.data;
                    self.loading = false;

                    this.$message("成功加载用户！");
                },function(data) {
                    this.$$message.error("加载失败!");
                })
            },
            sexFormatter(row, column) {
                 if(row.sex === 0) {
                     return "男";
                 }
                return "女";
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            onSubmit() {
                this.$message.success('提交成功！');
            }
        }
    }
</script>
