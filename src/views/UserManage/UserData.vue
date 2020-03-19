<template>
    <div class="AccountData">
        UserData
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component({
        components:{

        }
    })

    export default class AccountData extends Vue{

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