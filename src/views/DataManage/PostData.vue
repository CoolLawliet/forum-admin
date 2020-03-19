<template>
    <div class="table-data">
        <div class="search-box">
            <el-input size="small"
                      v-model="searchVal"
                      placeholder="请输入标题名称检索"
            >
            </el-input>
            <el-button size="small" @click="handleSearch" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
                :data="postData"
                border style="width: 100%"
                :height="tHeight" class="table-box">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="标题名称" prop="title" width="150"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="内容" prop="content"></el-table-column>
            <el-table-column label="作者" prop="author.name" width="120"></el-table-column>
            <el-table-column label="类型" prop="type" width="100"></el-table-column>
            <el-table-column label="阅读量" prop="looks" width="100"></el-table-column>
            <el-table-column label="发布时间" :formatter="timeAgo" prop="create_time" width="160"></el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger"
                               @click="handleDelete(scope.$index,scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pages" ref="page-box">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[5,10,20]"
                    :page-size="size"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="total"
            >

            </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Provide} from 'vue-property-decorator'

    @Component({
        components: {}
    })


    export default class PostData extends Vue {
        created() {
            this.loadData()
        }

        @Provide() searchVal: string = ""; //搜索框
        @Provide() tHeight: number = document.body.offsetHeight - 270;
        @Provide() postData: any = [];//帖子数据
        @Provide() page: number = 1; //当前page
        @Provide() size: number = 5;//请求个数
        @Provide() total: number = 0;//总数据条数

        //格式化时间
        timeAgo(row: any, column: any) {
            let timestamp = row[column.property]
            // 补全为13位
            var arrTimestamp: any = (timestamp + '').split('');
            for (var start = 0; start < 13; start++) {
                if (!arrTimestamp[start]) {
                    arrTimestamp[start] = '0';
                }
            }
            timestamp = arrTimestamp.join('') * 1;

            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - timestamp;

            // 如果本地时间反而小于变量时间
            if (diffValue < 0) {
                return '不久前';
            }

            // 计算差异时间的量级
            var monthC: any = diffValue / month;
            var weekC: any = diffValue / (7 * day);
            var dayC: any = diffValue / day;
            var hourC: any = diffValue / hour;
            var minC: any = diffValue / minute;

            // 数值补0方法
            var zero = function (value: any) {
                if (value < 10) {
                    return '0' + value;
                }
                return value;
            };

            // 使用
            if (monthC > 12) {
                // 超过1年，直接显示年月日
                return (function () {
                    var date = new Date(timestamp);
                    return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
                })();
            } else if (monthC >= 1) {
                return parseInt(monthC) + "月前";
            } else if (weekC >= 1) {
                return parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                return parseInt(dayC) + "天前";
            } else if (hourC >= 1) {
                return parseInt(hourC) + "小时前";
            } else if (minC >= 1) {
                return parseInt(minC) + "分钟前";
            }
            return '刚刚';
        };

        loadData() {
            (this as any).$axios.get(`/admin/profiles/getPosts`,
                {
                    params: {
                        page: this.page,
                        size: this.size
                    }
                }
            )
                .then((res: any) => {
                    this.postData = res.data.data.list;
                    this.total = res.data.data.total;
                })
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

        handleSearch(): void {
            //点击搜索
            this.page = 1;
            this.searchVal ? this.loadSearchData() : this.loadData()
        }

        handleDelete(index: number,row:any) {
            (this as any).$axios.post('/admin/profiles/delPost',{
                id:row._id
            }).then((res:any)=>{
                this.$message({
                    message:res.data.msg,
                    type:'success'
                });
                this.postData.splice(index,1)
            })
        }
        loadSearchData() {
            //加载搜索数据
            (this as any).$axios.get('/admin/profiles/searchPost',
                {
                    params: {
                        kw: this.searchVal,
                        page: this.page,
                        size: this.size
                    }
                }
            ).then((res: any) => {
                this.postData = res.data.data.list;
                this.total = res.data.data.total;
            });
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