<template>
    <div class="login">
        <LoginHeader>
            <el-form
                    :rules="rules"
                    :model="ruleForm"
                    ref="ruleForm"
                    label-position="left"
                     label-width="0px"
                     slot="container">
                <div class="title">
                    <h3>账号密码登录</h3>
                </div>
                <!--username-->
                <el-form-item prop="username">
                    <el-input type="text" v-model="ruleForm.username"
                    auto-complete="off" placeholder="账号">
                        <i slot="prefix" class="fa fa-user-o"></i>
                    </el-input>

                </el-form-item>
                <!--password-->
                <el-form-item prop="pwd">
                    <el-input type="password" v-model="ruleForm.pwd"
                              auto-complete="off" placeholder="密码">
                        <i slot="prefix" class="fa fa-lock"></i>
                    </el-input>

                </el-form-item>
                <!--登录button-->
                <el-form-item>
                    <el-button :loading="isLogin"
                            @click.native.prevent="handleSubmit" type="primary" style="width: 100%">登录</el-button>
                </el-form-item>
                <!--7天登录和忘记密码-->
                <el-form-item>
                    <el-checkbox v-model="ruleForm.autoLogin"
                                 :checked="ruleForm.autoLogin">
                        7天内自动登录
                    </el-checkbox>
                    <el-button @click="$router.push('/password')" type="text" class="forget">忘记密码?</el-button>
                </el-form-item>
            </el-form>
        </LoginHeader>
    </div>
</template>

<script lang="ts">
    import {Component, Provide, Vue} from "vue-property-decorator";
    import {State,Getter,Mutation,Action} from "vuex-class";
    import LoginHeader from './LoginHeader.vue'

    @Component({
        components:{
            LoginHeader
        }
    })

    export default class Login extends Vue{
        //存储用户信息
        @Action('setUser') setUser:any;

        @Provide() isLogin:boolean=false;
        @Provide() ruleForm:{
            username:String;
            pwd:String;
            autoLogin:boolean;
        }={
            username:"",
            pwd:"",
            autoLogin:true //是否自动登录
        };

        @Provide() rules={
            username:[{required:true,message:'请输入账号',trigger:'blur'}],
            pwd:[{required:true,message:'请输入密码',trigger:'blur'}],
        };

        handleSubmit():void{
            (this.$refs['ruleForm'] as any).validate((valid:boolean)=>{
                if (valid){
                    this.isLogin=true;
                    (this as any).$axios.post('/admin/users/login',
                        this.ruleForm).then((res:any)=>{
                        this.isLogin=false;
                        //存储token
                        localStorage.setItem('tsToken',res.data.token);
                        //存储到vuex
                        this.setUser(res.data.token);
                        //登陆成功跳转
                        this.$router.push('/');
                    }).catch(()=>{
                        this.isLogin=false;
                    })
                }
            })
        }

    }
</script>

<style lang="scss" scoped>
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    i {
        font-size: 14px;
        margin-left: 8px;
    }
    .forget {
        float: right;
    }
</style>