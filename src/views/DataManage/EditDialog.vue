<template>
    <el-dialog
            :close-on-click-modal="false"
            :show-close="false"
            title="编辑板块"
            :visible.sync="dialogVisible"
    >
        <el-form
                :rules="rules"
                ref="ruleForm"
                :model="form"
                label-width="100px"
                size="small"
                class="form-box"
        >
            <el-form-item label="板块名称" prop="type">
                <el-input v-model="form.type" placeholder="请输入板块名称"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('closeDialog')" size="small">取消</el-button>
      <el-button @click="submitForm('ruleForm')" type="primary" size="small">确定</el-button>
    </span>
    </el-dialog>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Provide} from "vue-property-decorator";

    @Component({
        components: {}
    })

    export default class EditDialog extends Vue {
        // 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
        @Prop(Boolean) dialogVisible!: boolean;
        @Prop(Object) form!: {
            type: string;
            _id: string;
        };

        @Provide() rules: any = {
            type: [{required: true, message: "请输入板块名称", trigger: "blur"}],
        };

        submitForm(formName: any) {
            (this.$refs[formName] as any).validate((valid: boolean) => {
                console.log(this.form);
                if (valid) {
                    (this as any).$axios
                        .post(`/admin/profiles/editType`, {
                            _id: this.form._id,
                            type: this.form.type
                        })
                        .then((res: any) => {
                            // console.log(res.data);
                            this.$emit("closeDialog");
                            this.$message({
                                message: res.data.msg,
                                type: "success"
                            });
                        });
                }
            });
        }

        created() {
            // console.log(this.dialogVisible, this.form);
        }
    }
</script>

<style lang="scss" scoped>
    .form-box {
        .el-input,
        .el-select {
            width: 200px !important;
        }
    }
</style>
