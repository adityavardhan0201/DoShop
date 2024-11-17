
import { Routes , Route } from 'react-router-dom';
import Signup from './signupPage';
import Shoping from './shopping/shopping.js';
import Login from './LoginPage.js';
import Catmap from './categories_map';
import Navigation from './NavigationBar';
import CartPage from './cart/cartContent.js';
import Sneakers from './category/sneakers.js';
import Hats from './category/hats.js';
import Jacket from './category/jackets.js';
import Womens from './category/womens.js';
import Mens from './category/mens.js';
import ProfileDetails from '../src/profile/ProfiePage.js';
import Courosel from './courosel.js';
import './App.css';

import {auth , db} from '../src/firebase/firebase_1.js';
import { getDoc,doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection,getDocs, query} from 'firebase/firestore';
import Payments from './payments/paymnets-from.js';

const App= () => {
  
  const dispatch = useDispatch();

   const pulldb = async () =>
  {
    const collectionsRef = collection(db,"categories");
    const q = query(collectionsRef);
    const pr = await getDocs(q);
    const tot = pr.docs.map((mp)=>
    {
        return(
        mp.data())
    })
    
    return tot
  }

  useEffect(() => {
      
     const detailsret =  async(user) =>
    {
      const getdoc = await doc(db, "users",user.uid);
      const docs = await getDoc(getdoc,user.uid)
      return docs;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        console.log('User is signed out');
        dispatch({ type: 'CLEAR_USER' });
      }

      if(user)
      {
        console.log("userinAPP: ",user);
        dispatch({ type: "FETCH_USER_DETAILS_REQUEST", payload: user }); 
        /*const userDetails = await detailsret(user);
        console.log("details :",userDetails.data())
        if(userDetails.data() )
        {
          dispatch({ type: 'FETCH_DETAILS', payload: userDetails.data() });
        }*/
        
      }

    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => 
  {

    const fetchData = async () => {
            const fetchedItems = await pulldb(); 
            dispatch({type:"FETCH_ITEMS",payload:fetchedItems})
        };

        fetchData();
  },[])

      

  return (
    <div className='MainBox'> 
      <Routes>
          <Route path='/' element ={<Navigation />} >
              <Route index element ={<Catmap />}/>   
              <Route path='Home' element ={<Catmap />}/>  
              <Route path='Shopping' element ={<Shoping />}/>
              <Route path='Cart' element ={<CartPage />} />
              <Route path='Shopping/Sneakers' element ={<Sneakers />} />
              <Route path='Shopping/Hats' element ={<Hats />} />
              <Route path='Shopping/Jackets' element ={<Jacket />} />
              <Route path='Shopping/Womens' element ={<Womens />} />
              <Route path='Shopping/Mens' element ={<Mens />} />
              <Route path='profile' element ={<ProfileDetails />} />
              <Route path='Cart/payments' element ={<Payments />} />
          </Route>
          <Route path='SignUp' element ={<Signup />}/> 
          <Route path='Login' element ={<Login />}/> 
          <Route path='courosel' element ={<Courosel />}/> 
      </Routes> 
    </div>
  );
}

export default App;
