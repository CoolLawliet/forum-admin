<template>
    <div class="table-data">
        <div class="search-box">
            <el-input size="small"
                      v-model="searchVal"
                      placeholder="请输入评论内容检索"
            >
            </el-input>
            <el-button size="small"  type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
                :data="commentData"
                border style="width: 100%"
                :height="tHeight" class="table-box">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="评论内容" prop="answer.content" width="150"></el-table-column>
            <el-table-column label="评论者" prop="author.name" width="120"></el-table-column>
            <el-table-column label="评论时间" prop="create_time" width="160"></el-table-column>

        </el-table>
    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue} from 'vue-property-decorator'

    @Component({
        components:{

        }
    })

    export default class CommentData extends Vue{
        @Provide() searchVal: string = ""; //搜索框
        @Provide() tHeight: number = document.body.offsetHeight - 270;
        @Provide() commentData: any = [];//帖子数据
        @Provide() page: number = 1; //当前page
        @Provide() size: number = 5;//请求个数
        @Provide() total: number = 0;//总数据条数、

        created(){
            this.loadData()
            console.log(this.total);
        }

        loadData() {
            (this as any).$axios.get(`/admin/profiles/getComment`,
                {
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }
            )
                .then((res: any) => {
                    console.log(res);

                    this.commentData = res.data.data.list;
                    this.total = res.data.data.total;
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