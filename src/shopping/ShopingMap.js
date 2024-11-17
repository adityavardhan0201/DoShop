import './shopping.css';
import { Fragment, useState } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cart_context';
import { useSelector } from 'react-redux';
import {db , auth} from '../firebase/firebase_1';
import { getDoc,doc,setDoc } from 'firebase/firestore';

const Shopping = (props) => {
    
    const { setCount, count,state,dispatch } = useContext(CartContext);
    const details = useSelector((state) => state.details)
    const { shopData,shopDat } = props;
    const [addCart, setAddCart] = useState("");

    const mouseOver = (event) => {
        setAddCart(event);
    };

    const addCartButton = async (obj) => 
    {    
        setCount(count + 1);
        const array = [...state];
        let found = false;

        array.forEach((item) => {
            if (item.name === obj.name) {
                found = true;
                item.count += 1;
            }
        });

        if (!found) {
            array.push({ ...obj, count: 1 });
        }
        if(auth.currentUser!=null)
        {
                const ref = await doc(db,"users",auth.currentUser.uid);
                const get = await getDoc(ref);
                const info = get.data();
                setDoc(ref,{...details,cart:array})
        }
        dispatch({type:"FETCH_CART_DETAILS",cart:array})
        
    };

    return (
        <div className="shopping-container">
            {shopData != null &&
                shopData.map((maps) => (
                    <div key={maps.title} className="category-section">
                        <Link to={maps.title} className="category-title">{maps.title}</Link>
                        <div className="items-container">
                            {maps.items.slice(0, 4).map((mp) => (
                                <div onMouseOver={() => mouseOver(mp.imageUrl)} onMouseLeave={()=>{ setAddCart()}} key={mp.id} className="shopping-item">
                                    <Fragment>
                                        <div className="image-container">
                                            <img
                                                src={mp.imageUrl}
                                                alt={mp.title}
                                                className="product-image"
                                            />
                                            {addCart === mp.imageUrl && (
                                                <div>
                                                    <button
                                                        className="add-to-cart-button"
                                                        onClick={() => addCartButton(mp)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="price-and-name">
                                            <h4 className="product-name">{mp.name}</h4>
                                            <h4 className="product-price">${mp.price}</h4>
                                        </div>
                                    </Fragment>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to={maps.title} style={{ fontSize: '16px', fontWeight:'600'}}>more....</Link>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default Shopping;