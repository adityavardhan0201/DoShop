import { useState, createContext, useEffect,useContext } from "react";
import { useReducer } from "react";
import { collection,setDoc,getDoc,doc } from 'firebase/firestore';
import { db,auth } from '../firebase/firebase_1';
import {  useSelector } from "react-redux";

export const CartContext = createContext(null);

export const reducercart = (state,action) =>
{
    if(action.type === "FETCH_CART_DETAILS")
    {
        return action.cart
    }
    else
    {
        return [];
    }
}

export const CartProvider =  ({ children }) => {

    const user = useSelector((state) => state.user)
    const [count,setCount] = useState(0);
    let IntialCart = [];
    useEffect(()=>
    {
        const FETCHDETAILS = async() =>
        {
            if(user && user.user && user.user.uid)
            {
            const ref = await doc(db,"users",await(user.user.uid));
            const get = await getDoc(ref);
            const info = get.data();
            IntialCart = info;
            let c= 0 ;
            if(info && info.cart)
            {
                info.cart.map((mc)=>
                {
                    c = c+mc.count
                })
                setCount(c)
                dispatch({type:"FETCH_CART_DETAILS",cart:info.cart})
            }
            else if((info && info.cart.length===0))
            {
                console.log(info);
            }
            }
        }
        FETCHDETAILS();
    },[user])
    const [state,dispatch] = useReducer(reducercart , IntialCart)
   
    return (
        <CartContext.Provider value={{count,setCount ,state,dispatch}}>
            {children}
        </CartContext.Provider>
    );
};
