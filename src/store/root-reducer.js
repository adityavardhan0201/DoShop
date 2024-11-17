import { combineReducers } from "redux";
import { userReducer,detailsReducer } from './user/userReducer';
import {productReducer} from '../store/user/productReduer'
export const rootReducer = combineReducers(
    {
        user: userReducer,
        details : detailsReducer,
        shopData : productReducer
    });