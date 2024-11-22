import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cart_context';
import { useContext } from 'react';
import {db , auth} from '../firebase/firebase_1';
import { setDoc , doc } from 'firebase/firestore';
import './payments.css';
import {StyledButton} from '../styled-components/button';
import { Countries } from '../context/country';

const Payments = () => {
    const noUserDetails = {
        name: "",
        street: "",
        city: "",
        state: "",
        postal: "",
        country: "",
    };

    const [dropDown,setDropdown] = useState(false);
    const [coutArr,setcoutArr] = useState([]);
    const [addSel,setAddSel] = useState(false);


    const submitCountry = (e)=>
    {
        const { Name, Code } = e;
        const add = Name +" ("+Code+")";
        SetnoUserDet({ ...noUserDet, country: add})
        setDropdown(false)
        setAddSel(true)
    }


    const navigate = useNavigate();
    const [paysuc,setpaysuc] = useState(true)
    const [noUserDetState, SetnoUserDetState] = useState(true);
    const [noUserDet, SetnoUserDet] = useState(noUserDetails);
    const [addressState, setAddressState] = useState(true);
    const [select, SetSelect] = useState({});
    const location = useLocation();
    const amount = location.state;
    const stripe = useStripe();
    const elements = useElements();
    const user = useSelector((state) => state.user);
    const details = useSelector((state) => state.details);
    const {count,setCount,dispatch,state} = useContext(CartContext);

    const changeAddress = () => {
        SetSelect({});
        setAddressState(true);
    };

    const selectadd = (event) => {
        SetSelect(event);
        setAddressState(false);
    };

    const addnewADD = () => {
        navigate('/profile');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        SetnoUserDet({ ...noUserDet, [e.target.name]: e.target.value });
        if(name === "country")
        {
            setAddSel(false)
            let coun = e.target.value.toUpperCase();
            const arr = Countries.filter((map) => map.Name.toUpperCase().includes(coun))
            setcoutArr(arr);
        }
        if(e.target.value !== "")
        {
            setDropdown(true)
        }
        else
        {
            setDropdown(false)
        }
    };

    const paymentHandler = async (e) => {
        e.preventDefault();
        e.target.disabled = true;
        if (!stripe || !elements) {
            return;
        }
        const response = await fetch('/.netlify/functions/payments-intent', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: (amount*100)}),
        }).then((res) => res.json());
        const clientSecret = response.paymentIntent.client_secret;
        let name = "";
        let billingDetails = {};
        
        if (user?.user) {
            name = details?.display || noUserDet.name;
            billingDetails = {
                name: name,
                address: {
                    line1: select?.street || details?.address?.[0]?.street || noUserDet.street,
                    city: select?.city || details?.address?.[0]?.city || noUserDet.city,
                    state: select?.state || details?.address?.[0]?.state || noUserDet.state,
                    postal_code: select?.postal || details?.address?.[0]?.postal || noUserDet.postal
                },
            };
        }
        else {
            name = noUserDet.name;
            billingDetails = {
                name: name,
                address: {
                    line1: noUserDet.street,
                    city: noUserDet.city,
                    state: noUserDet.state,
                    postal_code: noUserDet.postal,
                },
            };
        }



        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: billingDetails,
            },
        });
        if (paymentResult.error) {
            e.target.disabled = false;
            alert(paymentResult.error.message);
        } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
                dispatch({type:"FETCH_CART_DETAILS",cart:[]})
                if(user.user)
                {
                    const ref = await doc(db,"users",auth.currentUser.uid);
                    setDoc(ref,{...details,cart:[]})
                }
                setCount(0);
                setpaysuc(false)
            }
        }
    };

    const submitNoUseraddress = () => {
        if(noUserDet.city==='' || noUserDet.name==='' || noUserDet.state==='' || noUserDet.street==='' || noUserDet.postal==='' || noUserDet.country==='')
        {
            alert("fill All details")
            return;
        }
        if( !addSel) 
        {
            alert("Select A country from Dropdown");
            return;
        }
        SetnoUserDetState(false);
    };

    const noUserEditAdress = () => {
        SetnoUserDetState(true);
    };

    const checkCart = () =>
    {
        navigate('/cart')
    }
    return (
        <div>
        { paysuc &&
        <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {(amount === null || amount === 0) && (
             <h4
                onClick={() => { navigate('/'); }}
                style={{
                cursor: 'pointer',
                display: 'inline-block',
                textDecoration: 'none',
                color: 'black',
                fontSize: '16px',
                color: "red"
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
                <Link to="/Home" className="thank-you-link">Go to Home</Link>
            </h4>)}
        </div>
        { amount!=null && amount>0 &&
        <div className="payments-container">
            {user && amount && details && (
                <div className="user-section">
                    <h2>Name: {details.display.toUpperCase()}</h2>
                    {addressState &&  details.address && details.address.length>0 &&
                        <div className="address-selection">
                             <h4 className="address-title">Select Address <span style={{ color: 'red' }}>*</span></h4>
                            {details.address.map((m) => (
                                <div key={m.street} className="address-item">
                                    <input
                                        className="address-checkbox"
                                        onClick={() => selectadd(m)}
                                        type="checkbox"
                                    />
                                    <span className="address-text">
                                        {m.street}, {m.city}, {m.state}, {m.postal}, {m.country}
                                    </span>
                                </div>
                            ))}
                    
                        </div>
                    }
                    
                    {/*{(!(details && details.address) || (details && details.address && details.address.length === 0)) && <h4 className='NoAdress' style={{ color: "red" }}>Note: Please add an address.</h4>}
                    {(details&& details.address && details.address.length>0) && addressState && <h4 style={{color:"red"}}>Note: Please select an address.</h4>}*/}
                    
                    {!addressState && select && (
                        <div className="selected-address" style={{display:"flex" , gap:"20px" ,padding:"2px"}}>
                            <h3 className="address-heading">Address:</h3>
                            <p className="address-details">
                                {select.street}, {select.city}, {select.state}, {select.postal},{' '}
                                {select.country}
                            </p>
                            <div>
                            <StyledButton className="change-address-button" onClick={changeAddress}>
                                CHANGE ADDRESS
                            </StyledButton>
                            </div>
                        </div>
                    )}
                     <div style = {{ display: "flex" , justifyContent: 'center',alignItems: 'center'}}>
                    <StyledButton className="address-add-button" onClick={addnewADD}>
                            ADD/EDIT ADDRESS
                    </StyledButton>
                    </div>
                </div>
            )}

            {!user?.user && amount>0 && noUserDetState && (
                <div className="guest-address-section">
                    <h2 className="guest-address-title">Enter Your Name <span style={{ color: 'red' }}>*</span></h2>
                    <input
                            className="address-input"
                            type="text"
                            name="name"
                            value={noUserDet.name}
                            onChange={handleChange}
                        />
                    <h2 className="guest-address-title">Enter Address <span style={{ color: 'red' }}>*</span></h2>
                    <div className="guest-address-fields">
                        <label className="address-label">Street:</label>
                        <input
                            className="address-input"
                            type="text"
                            name="street"
                            value={noUserDet.street}
                            onChange={handleChange}
                        />
                        <label className="address-label">City:</label>
                        <input
                            className="address-input"
                            type="text"
                            name="city"
                            value={noUserDet.city}
                            onChange={handleChange}
                        />
                        <label className="address-label">State:</label>
                        <input
                            className="address-input"
                            type="text"
                            name="state"
                            value={noUserDet.state}
                            onChange={handleChange}
                        />
                        <label className="address-label">Postal:</label>
                        <input
                            className="address-input"
                            type="text"
                            name="postal"
                            value={noUserDet.postal}
                            onChange={handleChange}
                        />
                        <label className="address-label">Country:</label>
                        <input
                            className="address-input"
                            type="text"
                            name="country"
                            value={noUserDet.country}
                            onChange={handleChange}
                        />
                        {
                            dropDown &&
                            <div className="dropdown-content">
                            {coutArr.map((map, index) => (
                                <div key={index} className="dropdown-item">
                                <button onClick={() => submitCountry(map)}>
                                    {map.Name}
                                </button>
                            </div>))}
                            </div>
                        }
                    
                    </div>
                    <div style = {{ display: "flex" , justifyContent: 'center',alignItems: 'center',padding:"20px"}}>
                    <StyledButton className="submit-address-button" onClick={submitNoUseraddress}>
                        Submit Address
                    </StyledButton>
                    </div>
                </div>
            )}
            {!user?.user && amount>0 && !noUserDetState && (
                <div className="guest-address-display">
                    <h1 className="guest-address-name">{noUserDet.name}</h1>
                    <h3 className="guest-address-heading">Address</h3>
                    <div style={{display : "flex" ,gap : "20px"}}>
                    <p className="guest-address-details" style = {{borderRight: '0.1px solid #333'}}>
                    <div className="addressContent">{noUserDet.street}, {noUserDet.city}, {noUserDet.state}, {noUserDet.postal},{' '}
                        {noUserDet.country}</div>
                    </p>
                    <div style={{paddingTop: '7px'}}>
                    <StyledButton style={{ height: '30px', padding: '5px 5px 5px 5px', fontSize: '14px' ,color:"black", background:"none"  }} className="edit-address-button" onClick={noUserEditAdress}>
                        Edit
                    </StyledButton>
                    </div>
                    </div>
                </div>
            )}
            <div className="payment-section">
                {amount>0 && (
                    <div className="payment-form">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , gap: '70px'}}>
                            <h3 className='totalAmount'>Amount : {`${amount} USD`}</h3>
                        <div><StyledButton style={{ padding: '5px 10px', fontSize: '14px' }} className='Check_Cart' onClick={checkCart}> CHECK CART </StyledButton></div></div>
                        <h6> 
                            <span style={{ color: "red", fontSize: "12px", lineHeight: "1.5" }}>
                                *Sample Test Card: 4242 4242 4242 4242, Expiry Date: Any Future Date, (CVC, POSTAL): Any Valid Value
                            </span>
                        </h6>
                        <h2 className="payment-title">Credit Card Payment</h2>
                        <CardElement className="card-element" />
                        { user.user && 
                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , gap: '70px'}}>
                        <StyledButton disabled= {addressState} className="pay-now-button" onClick={paymentHandler}>
                            Pay Now
                        </StyledButton></div>}
                        {!user.user &&
                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , gap: '70px'}}>
                        <StyledButton disabled= { noUserDetState} className="pay-now-button" onClick={paymentHandler}>
                            Pay Now
                        </StyledButton>
                        </div>}
                    </div>
                )}
            </div>
        </div>}
        </div>}
        {
            !paysuc &&
            <div className="thank-you-container">
                <h2 className="thank-you-header">Thank You for Shopping with Us!</h2>
                <p className="thank-you-message">Your order has been successfully placed. We hope to see you again soon!</p>
                <div className="thank-you-links">
                <Link to="/Home" className="thank-you-link">Go to Home</Link>
                </div>
            </div>
        }
    </div>);
};

export default Payments;
