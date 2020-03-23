<template>
    <div class="account-data">
        <div class="search-box">
            <el-input size="small"
                      v-model="searchVal"
                      placeholder="请输入用户名检索"
            >
            </el-input>
            <el-button size="small" @click="handleSearch" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table border style="width: 100%" :height="tHeight" :data="userData">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="用户名" width="200">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.name"
                              v-if="scope.row.edit">
                    </el-input>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="邮箱" prop="emil" width="410"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="个性签名" width="410">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.tips"
                              v-if="scope.row.edit">
                    </el-input>
                    <span v-else>{{scope.row.tips}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index,scope.row)" v-if="!scope.row.edit" size="mini">编辑
                    </el-button>
                    <el-button @click="handleSave(scope.$index,scope.row)" v-else size="mini" type="success">完成
                    </el-button>
                    <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pages" ref="page-box">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10,20,30]"
                    :page-size="size"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="total"
            >
            </el-pagination>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator'

    @Component({
        components: {}
    })

    export default class AccountData extends Vue {
        @Provide() tHeight: number = document.body.offsetHeight - 270;
        @Provide() userData: any = [];//用户数据
        @Provide() searchVal: string = ""; //搜索框
        @Provide() page: number = 1; //当前page
        @Provide() size: number = 10;//请求个数
        @Provide() total: number = 0;//总数据条数
        loadData() {
            (this as any).$axios.get(`/admin/users/getUserInfo`,
                {
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }
            )
                .then((res: any) => {
                    //设置编辑状态
                    res.data.data.list.forEach((item: any) => {
                        item.edit = false;
                    })
                    this.userData = res.data.data.list;
                    this.total = res.data.data.total;
                })
        }

        handleSearch(): void {
            //点击搜索
            this.page = 1;
            this.searchVal ? this.loadSearchData() : this.loadData()
        }
        handleSizeChange(val: number): void {
            this.size = val;
            this.page = 1;
            this.searchVal ? this.loadSearchData() : this.loadData()
        }

        handleCurrentChange(val: number): void {
            this.page = val;
            this.searchVal ? this.loadSearchData() : this.loadData()
        }
        handleEdit(index: number, row: any): void {
            //编辑
            row.edit = true
        }
        handleSave(index: number, row: any): void {
            //完成
            row.edit = false;
            (this as any).$axios.post('/admin/users/editUserInfo',
                {
                    id:row._id,
                    name:row.name,
                    tips:row.tips
                }
            ).then((res: any) => {
                this.$message({
                    message: res.data.msg,
                    type: "success"

                });
            })
        }

        handleDelete(index: number,row:any) {
            (this as any).$axios.post('/admin/users/delUserInfo',{
                id:row._id
            }).then((res:any)=>{
                this.$message({
                    message:res.data.msg,
                    type:'success'
                });
                this.userData.splice(index,1)
            })
        }
        loadSearchData() {
            //加载搜索数据
            (this as any).$axios.get('/admin/users/searchUser',
                {
                    params: {
                        kw: this.searchVal,
                        page: this.page,
                        size: this.size
                    }
                }
            ).then((res: any) => {
                this.userData = res.data.data.list;
                this.total = res.data.data.total;
            });
        }
        created() {
            this.loadData()
        }
    }
</script>

<style lang="scss" scoped>
    .account-data {
        height: 100%;
        overflow: auto;

        .add-box {
            margin-bottom: 10px;
        }
    }

    .account-data {
        height: 100%;

        .table-box {
            font-size: 14px;
        }

        .pages {
            background: #fff;
            margin-top: 10px;
            padding: 10px 10px;
            text-align: right;
            height: 55px;
            box-sizing: border-box;
        }

        .search-box {
            background: #fff;
            margin-bottom: 10px;
            padding: 10px 10px;
            border-radius: 4px;
            height: 55px;
            box-sizing: border-box;

            .el-input {
                width: 200px;
                margin-right: 10px;
            }
        }
    }
</style>