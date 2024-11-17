// userinfo.js
import { db } from './firebase_1';
import { doc, getDoc , setDoc } from 'firebase/firestore';

import { useDispatch } from 'react-redux';

export const createref = async (user,dispatch,state) => 
{
   const ref = doc(db, "users", user.uid);
   const getref = await(getDoc(ref));
   if(!getref.exists())
   {
    const display = user.displayName;
    const email = user.email;
    const cart =state
    const date = new Date();
    try{
      await setDoc(ref,{display,email,date,cart})
      dispatch({ type: 'FETCH_DETAILS', payload: {display,email,date,cart} });
      return display;
    }
    catch(e)
    {
      console.log(e)
    }
   }
   return user.displayName;
};

export const createRefForEmail = async (user,name,dispatch,state) => {
  const ref = doc(db, "users", user.uid);
  const getref = await(getDoc(ref));
  if(!getref.exists())
  {
   const display = name;
   const email = user.email;
   const cart =state
   const date = new Date();
   try{
     await setDoc(ref,{display,email,date,cart})
     dispatch({ type: 'FETCH_DETAILS', payload: {display,email,date,cart} });
   }
   catch(e)
   {
     console.log(e)
   }
  }
};