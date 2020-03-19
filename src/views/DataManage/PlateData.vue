<template>
    <div class="table-data">
        <div class="search-box">
            <el-input size="small"
                      v-model="addVal"
                      placeholder="请输入板块名称"
            >
            </el-input>
            <el-button size="small" @click="addType" type="primary" icon="fa fa-plus-circle">添加板块</el-button>
        </div>
        <el-table
                :data="plateData"
                border style="width: 100%"
                 class="table-box">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="type" label="板块"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index,scope.row)" size="mini">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index,scope.row)"
                    >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <EditDialog
                :dialog-visible="dialogVisable"
                :form="formData"
                @closeDialog="closeDialog"
        ></EditDialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Provide} from 'vue-property-decorator'
    import EditDialog from "@/views/DataManage/EditDialog.vue";
    import fa from "element-ui/src/locale/lang/fa";

    @Component({
        components: {EditDialog}
    })

    export default class PlateData extends Vue {
        @Provide() plateData: any = [];//帖子数据
        @Provide() addVal: string = ""; //搜索框

        @Provide() dialogVisable: Boolean = false;//是否展示编辑页面
        @Provide() formData: object = {
            type: '',
        };

        handleEdit(index: number, row: any) {
            this.formData = row;
            this.dialogVisable = true
        }

        handleDelete(index: number,row:any) {
            (this as any).$axios.post('/admin/profiles/delType',{
                    id:row._id
            }).then((res:any)=>{
                this.$message({
                    message:res.data.msg,
                    type:'success'
                });
                this.plateData.splice(index,1)
            })
        }
        addType(){
            (this as any).$axios.post('/admin/profiles/addType',
                {
                        type: this.addVal,
                }
            ).then((res: any) => {
                this.$message({
                    message:res.data.msg,
                    type:'success'
                });
                this.loadData()
            });
        }

        closeDialog() {
            this.dialogVisable = false
        }

        created() {
            this.loadData()
        }

        loadData() {
            (this as any).$axios.get(`/admin/profiles/getType`)
                .then((res: any) => {
                    this.plateData = res.data.data;
                })
        }
    }
</script>

<style lang="scss" scoped>
    .table-data {
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