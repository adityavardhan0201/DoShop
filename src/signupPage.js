import './signUp.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from './firebase/firebase_1';
import {createRefForEmail} from './firebase/userinfo';
import { useDispatch } from 'react-redux';
import { useContext } from "react";
import {CartContext} from '../src/context/cart_context'


const Signup = () => 
{  
  const {state} = useContext(CartContext);
  const dispatch = useDispatch();
  const[passReq ,setpassReq] = useState(false);
  const[passRereq ,setpassRreeq] = useState(false);
  const[passVal ,setpassVal] = useState(false);
  const[passlen ,setpasslen] = useState(false);
  const[passnum ,setpassnum] = useState(false);
  const[passlarge ,setpasslarge] = useState(false);
  const[passsmall ,setpasssmall] = useState(false);
  const[rePass,setRepass] = useState(false);
  const[rePassval,setRepassval] = useState("");
  const[pass ,setpass] = useState("");
  const[name ,setName] = useState("");
  const[mail ,setmail] = useState("");
  const[Buttonen ,setButtonen] = useState(false);
  const[checkPass,setcheckPass] = useState(false);
  const[typep,setTypep] = useState("password")
  useEffect(() => 
  {
      if(checkPass)
      {
        setTypep("text")
      }
      else
      {
        setTypep("password")
      }
  } ,[checkPass])
  const openReq= () =>
  {
    setpassReq(true);
  }
  const openreReq= () =>
  { 
      setpassRreeq(true);
  }
  const changefname= (event) =>
  {
    setName(event.target.value);
    setpassReq(false);
    setpassRreeq(false);
  }
  const changesname= (event) =>
  {
    setmail(event.target.value);
    setpassReq(false);
    setpassRreeq(false);
  }
  const entPass = (event) =>
  {
    setpass(event.target.value);
    if(event.target.value.length === "")
    {
      setpassVal(false);
    }
    if(event.target.value.length >=8 && event.target.value.length <=15 && /[a-z]/.test(event.target.value) && /[A-Z]/.test(event.target.value) && /[0-9]/.test(event.target.value))
    {
      setpassReq(false);
      setpassRreeq(false);
      setpassVal(true);
      
    }
    else
    {
      setpassReq(true);
      setpassRreeq(false);
      setpassVal(false);
    }
    if(event.target.value.length >=8 &&  event.target.value.length <=15)
    {
      setpasslen(true);
    }
    else
    {
      setpasslen(false);
    }

    if(/[a-z]/.test(event.target.value))
    {
      setpasssmall(true);
    }
    else
    {
      setpasssmall(false);
    }

    if(/[A-Z]/.test(event.target.value))
    {
      setpasslarge(true);
    }
    else
    {
      setpasslarge(false);
    }

    if(/[0-9]/.test(event.target.value))
    {
      setpassnum(true);
    }
    else
    {
      setpassnum(false);
    }
    
    if(event.target.value === rePassval)
    {
      setRepass(true);
    }
    else
    {
      setRepass(false);
    }
  }

  const reEntPass = (event) =>
  {
      if((event.target.value === pass))
      {
        setRepass(true);
      }
      
      else
      {
        setRepass(false);
      }
      setRepassval(event.target.value);
  }
  const buttonclick = async () =>
  {
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, mail, pass);
      const user = userCredential.user;
      createRefForEmail(user,name,dispatch,state)
      if (user) {
        //SetUser(userCredential)
      }
      setButtonen(true);
    }
    catch(error)
    {
      if(error.code === "auth/email-already-in-use")
      {
        alert("email-already-in-use")
      }
      if(error.code === "auth/invalid-email")
      {
        alert("invalid-email-address")
      }
      else
      {
        alert(error.code)
      }
    }
  }
  const clickvis = () =>
  {
    setcheckPass(!checkPass)
  }
  return (
    <div className='outerLayout'>

    <div className="create">
        {!Buttonen &&
        <div className="loginPage">
        <h1>Create Your Account</h1>
        <div className='enter_name'>
        <input className='name' placeholder='Enter Your Name' value={name} onClick={()=>{setpassReq(false)}} onChange={changefname}/>
        <input className='email' placeholder='Enter Your email' value={mail} onClick={()=>{setpassReq(false)}} onChange={changesname}/>
        </div>
        <div className='password'>
        <input className='passwordFirst' type={typep} placeholder='Enter your Password' value={pass} onClick={openReq} onChange={entPass}/>
        </div>
        <div className='PasswordVisible'>
          <label>
            <input type='checkbox' onClick={clickvis}/> Show Password
          </label>
        </div>
        <div className="requirements">
                <h4>Password Requirements:</h4>
                <h5 className={`length${passlen}`}>
                    • At least 8 characters and Lessthan 15
                </h5>
                <h5 className={`length${passlarge}`}>
                    • At least one uppercase letter (A-Z)
                </h5>
                <h5 className={`length${passsmall}`}>
                    • At least one lowercase letter 
                </h5>
                <h5 className={`length${passnum}`}>
                    • At least one number (0-9) 
                </h5>
        </div>
        {passVal && <h6> Password satisfies all the conditions</h6>}
        {passReq && !passVal && <h6 className='requirements'>  Password Doesn't satisfies all the conditions</h6>}
        <div className='passwordReEnter'>
        <input className='passwordReEnter' type='password' placeholder='Re Enter password' onClick={openreReq} onChange={reEntPass}/>
        
        {passVal && passRereq && !rePass &&<h6 className='requirements'>Password not Mathching</h6>}
        {passVal && passRereq && rePass &&<h6>Password Mathching</h6>}
        </div>
        <button className="submit_button"disabled={!(passVal &&  rePass && name.length!==0 && mail.length!==0)} onClick={buttonclick}>Create User</button>
        </div>
        }
        {Buttonen && 
        <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2 className="account-created">Account Has Been Created</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link to='/home' className='linkStyle'>Go to Home</Link>
            <Link to='/profile' className='linkStyle' >Add More Details</Link>
        </div>
      </div>
        }
    </div>
    </div>
  );
}

export default Signup;