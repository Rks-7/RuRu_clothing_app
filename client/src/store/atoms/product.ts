import {atom} from 'recoil';
import { Product } from '../../components/Product/Product';

interface productStateprops{
    isLoading:boolean,
    allproducts:Product[]
}
export const productState=atom<productStateprops>({
    key:"productState",
    default:{
        isLoading:true,
        allproducts:[],

    }
})