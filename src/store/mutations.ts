import {MutationTree} from "vuex";

const mutatios:MutationTree<any>={
    SET_USER(state:any,user:any):void{
        state.user =user
    }
};

export default mutatios