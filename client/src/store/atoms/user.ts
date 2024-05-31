import {atom} from 'recoil';

interface UserState{
    isLoading:boolean;
    userEmail:string | null;
    userRole:String | null;
}
export const userState=atom<UserState>({
    key:'userState',
    default:{
        isLoading:true,
        userEmail:null,
        userRole:null
    }
})