import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import {signInWithEmailAndPassword, signInWithPopup,} from "firebase/auth";
import {auth,provider} from './firebase/firebase_1';
import {createref} from './firebase/userinfo';
import {StyledButton} from '../src/styled-components/button'
import './loginpage.css';
import { useDispatch } from 'react-redux';
import { useContext } from "react";
import {CartContext} from '../src/context/cart_context'

const Login = () => {
    const dispatch = useDispatch();
    const {state} = useContext(CartContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [type,setType] = useState("password");
    const [showpass ,setShowpass] = useState(false);

    useEffect(() => 
    {
        if(showpass)
        {
            setType("text")
        }
        else
        {
            setType("password")
        }
    },[showpass])

    const email_id = (event) => {
        setEmail(event.target.value);
    };

    const Password = (event) => {
        setPassword(event.target.value);
    };
    const onGoogleclick = async () => {
        try {
            //dispatch({type:"SIGN_IN_GOOGLE" , payload:{auth,provider}})
            const response = await signInWithPopup(auth, provider);
            await createref(response.user,dispatch,state);
            
            navigate('/home')
        } catch (error) {
            alert("Error during sign-in: ", error); 
        }
    };
    
    const onLogclick = async() => 
    {
        try{
        await signInWithEmailAndPassword(auth,email,password)
        
        navigate('/home')
        }
        catch(error)
        {
            if(error.code === "auth/invalid-email")
            {
                alert("email id dosen't have an account");
            }
            if( error.code === "auth/invalid-credential")
            {
                alert("Wrong password");
            }
        }

    }

    const Toogle = () =>
    {
        setShowpass(!showpass)
    }

    return (
        <div>
            <div className="LoginContainer">
                <h4>Log in</h4>
                <div className="login_email">
                    <h5>Email:</h5>
                    <input type="email" className="emailInput" placeholder="Enter your email ID" onChange={email_id} />
                </div>
                <div className="login_password">
                    <h5>Password:</h5>
                    <input type={type} className="passwordInput" placeholder="Enter your Password" onChange={Password} />
                </div>
               <div className="showPss">
                <input className="checkbox" type='checkbox' onClick={Toogle}/> Show Password</div>
                <div className="login_button">
                    <div>
                        <button className="buttonNow" disabled={email.length === 0 || password.length === 0} onClick={onLogclick}>
                            Login
                        </button>

                        <button className="buttonNow google" onClick={onGoogleclick}>
                            Login With Google
                        </button>
                    </div>
                </div>
                <div className="create_account">
                    <Link to='/SignUp'>Join Us and Set Up Your Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
