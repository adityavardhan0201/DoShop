import React, { useContext, useEffect } from "react";
import { CartContext } from "../context/cart_context";

import {  useSelector } from "react-redux";
import {db , auth} from '../firebase/firebase_1';
import { getDoc,doc,setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import "./CartPage.css";
import { Link } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();
    const {count,setCount,dispatch,state} = useContext(CartContext);
    const details = useSelector((state) => state.details)
    const user = useSelector((state) => state.user)
    const remove_item = async (item) =>
    {
       let array = [...state];
       array.forEach((element) => {
            if(element.name === item)
            {
                setCount(count-(element.count));
            }
       });
       array = array.filter((map) => map.name !== item);
        dispatch({type:"FETCH_CART_DETAILS",cart:array})
        if(auth.currentUser!=null)
        {
                const ref = await doc(db,"users",auth.currentUser.uid);
                const get = await getDoc(ref);
                const info = get.data();
                setDoc(ref,{...details,cart:array})
        }
    } 
    const decrease = async (name) =>
    {
        let array = [...state];
        setCount(count-1);
        array.map((mp) =>
        {
            if(mp.name===name)
            {
                mp.count = mp.count-1;
            }
        })
        if(auth.currentUser!=null)
        {
                const ref = await doc(db,"users",auth.currentUser.uid);
                const get = await getDoc(ref);
                const info = get.data();
                setDoc(ref,{...details,cart:state})
        }
        dispatch({type:"FETCH_CART_DETAILS",cart:state})
    }
    const SignInFunc = () =>
    {
        navigate('/SignUp');
    }
    const increase = async (name) =>
    {
        setCount(count+1);
        let array = [...state];
        array.map((mp) =>
        {
            if(mp.name === name)
            {
                mp.count = mp.count+1;
            }
        })
        if(auth.currentUser!=null)
        {
                const ref = await doc(db,"users",auth.currentUser.uid);
                const get = await getDoc(ref);
                const info = get.data();
                setDoc(ref,{...details,cart:state})
        }
        dispatch({type:"FETCH_CART_DETAILS",cart:state})
    }
    let totalsum = 0;
    return ( 
        <div>
        <div className="cart-page">
            <table className="cart-table">
                <thead>
                    <tr>
                        <th className="cart-header-image">Product</th>
                        <th className="cart-header-item">Item</th>
                        <th className="cart-header-price">Price</th>
                        <th className="cart-header-quantity">Quantity</th>
                        <th className="cart-header-total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {state.length > 0 && 
                        state.map((item, index) => {
                            totalsum = totalsum + (item.price * item.count);
                            const total = item.price * item.count;
                            return (
                                <tr key={index} className="cart-row">
                                    <td className="cart-image-cell">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="cart-image"
                                        />
                                    </td>
                                    <td className="cart-item-name">{item.name}</td>
                                    <td className="cart-item-price">{`$ ${item.price}`}</td>
                                    <td className="cart-item-quantity">
                                        <div >
                                        <button className="cart-quantity-btn" disabled={item.count === 1} onClick={() => decrease(item.name)}>-</button>
                                        {item.count}
                                        <button className="cart-quantity-btn" onClick={() => increase(item.name)}>+</button>
                                        </div>
                                    </td>
                                    <td className="cart-item-total">{`$ ${total}`}</td>
                                    <td>
                                        <MdDelete className="cart-delete-btn" onClick={() => remove_item(item.name)} />
                                    </td>
                                </tr>
                            );
                        })
                    }
                    {state.length === 0 &&   
                        <tr>
                            <td colSpan="5" className="empty-cart-message">
                                Your cart is empty
                            </td>
                        </tr>
                    }
                </tbody>
                <tr>
                 <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td> 
                <td>{`$${totalsum}`}</td> 
                </tr>
            </table>
            
            <div className="cart-summary">
                    <div className="total-section">
                    </div>
                    <div className="actions-section">
                    {user.user ? (
                      <Link to="payments" state={totalsum} className="proceed-payment-btn">
                        Proceed to Payment
                        </Link>
                   ) : (
                    <>
                        <button onClick={SignInFunc} className="login-btn">SignUp</button>
                        <Link to="payments" state={totalsum} className="guest-payment-btn">
                        Continue As Guest
                        </Link>
                        </>
                    )}
                  </div>
            </div>
        </div>
        </div>
    );
};

export default CartPage;
