import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { useContext, useEffect, useState } from 'react';
import { auth } from './firebase/firebase_1';
import { signOut } from 'firebase/auth';
import { IoHome } from "react-icons/io5";
import { CartContext } from './context/cart_context';  
import {  useSelector } from "react-redux";

const Navigation = () => {

    const {dispatch} = useContext(CartContext);
    const navigate = useNavigate();
    const { count,setCount} = useContext(CartContext);
    const user = useSelector((state) => state.user)
    const [clicked,setClicked] = useState(false)
    const details = useSelector((state) => state.details)
    
    const click = (event) => {
            navigate('/cart');
    };

    const SignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
           alert('Error signing out:', error);
        }
    };

    return (
        <div className='outer'>
            <div className='NavigationBar'>
                <div className='Home_icon'>
                    <Link to='/'>
                    <div className='HomeIcon' style={{ display: 'flex', alignItems: 'center', gap: '8px' , borderRadius: '4px' }}>    
                        <IoHome style={{ fontSize: '24px' }} />
                        <h5 style={{ margin: 0 }}>Home</h5>
                    </div>

                    </Link>
                </div>
                <div className='ShopClassName'>
                    <Link to='/Shopping'>Shop</Link>
                </div>
                {!user.user && (
                    <div className='LoginClassName'>
                        <Link to='/Login'>Login</Link>
                    </div>
                )}
                {user && details && details && (
                    <div className='userNotNull'>
                        <div className='profile'>
                            <Link to='/profile'>{`Hi ${ details.display.toUpperCase()}`}</Link>
                        </div>
                        <div className='SignOutClassName'>
                            <h4 onClick={SignOut}>SignOut</h4>
                        </div>
                    </div>
                )}
                <div>
                <div className="CartContainer" onClick={click}>
                    <div className='CartIcon'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className='CartCount'  style={{ fontSize: '16px', fontWeight:'1000'}}>{count}</span>
                    </div>
                </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Navigation;
