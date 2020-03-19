<template>
    <div class="account-data">
        <div class="add-box">
            <el-button @click="addAdmin" type="primary">新增账户</el-button>
        </div>
        <el-table :data="adminData" border style="width: 100%">
            <el-table-column label="角色" width="180">
                <template slot-scope="scope">
                    <el-select @change="selectChange(scope.row)" v-if="scope.row.edit" v-model="scope.row.role">
                        <el-option v-for="option in options"
                                   :label="option.role"
                                   :value="option.role"
                                   :key="option.key"
                        ></el-option>
                    </el-select>
                    <span v-else>{{scope.row.role}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账号" width="180">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.username"
                              v-if="scope.row.edit">

                    </el-input>
                    <span v-else>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="des" label="描述"></el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope" v-if="scope.row.username!=='admin'">
                    <el-button @click="handleEdit(scope.$index,scope.row)" v-if="!scope.row.edit" size="mini">编辑
                    </el-button>
                    <el-button @click="handleSave(scope.$index,scope.row)" v-else size="mini" type="success">完成
                    </el-button>
                    <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddAdmin @update="getData" @closeDialog="closeDialog" :dialogVisible="dialogVisible"
                  :options="options"></AddAdmin>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Provide} from 'vue-property-decorator'
    import AddAdmin from "@/views/UserManage/AddAdmin.vue";
    import logger from "vuex/dist/logger";

    @Component({
        components: {
            AddAdmin
        }
    })

    export default class AccountData extends Vue {
        @Provide() adminData: any = [];

        @Provide() dialogVisible: boolean = false;

        //select数据
        @Provide() options: any = [
            {
                key: "admin",
                role: "管理员",
                des: "Super Administrator. Have access to view all pages."
            },
            {
                key: "editor",
                role: "客服",
                des: "Normal Editor. Can see all pages except permission page."
            }
        ];

        addAdmin() {
            this.dialogVisible = true
        }

        closeDialog() {
            this.dialogVisible = false
        }

        getData() {
            (this as any).$axios('admin/users/allUsers').then((res: any) => {
                //设置编辑状态
                res.data.data.forEach((item: any) => {
                    item.edit = false;
                })
                this.adminData = res.data.data
            })
        }

        handleEdit(index: number, row: any): void {
            //编辑
            row.edit = true
        }

        handleDelete(index:number,row:any):void{
            //删除
           ( this as any).$axios.post('/admin/users/deleteUser',{
               id:row._id
           }).then((res:any)=>{
               console.log(res);
               this.$message({
                   message: res.data.msg,
                   type: "success"
               });
               this.adminData.splice(index,1)
           })
        }

        handleSave(index: number, row: any): void {
            console.log(row);
            //完成
            row.edit = false;
            (this as any).$axios.post('/admin/users/editUser',
                {
                    id:row._id,
                    username:row.username,
                    key:row.key,
                    des:row.des,
                    role:row.role,
                    date:row.date
                }
            ).then((res: any) => {
                this.$message({
                    message: res.data.msg,
                    type: "success"

                });
            })
        }

        selectChange(item: any) {
            this.options.map((option: any) => {
                if (option.role == item.role) {
                    item.key = option.key;
                    item.des = option.des
                }
            })
        }

        created() {
            this.getData()
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
</style>