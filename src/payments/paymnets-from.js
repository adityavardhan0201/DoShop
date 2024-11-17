import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './payments.css';

const Payments = () => {
    const noUserDetails = {
        name: "",
        street: "",
        city: "",
        state: "",
        postal: "",
        country: "",
    };

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

    const handleChange = (event) => {
        SetnoUserDet({ ...noUserDet, [event.target.name]: event.target.value });
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
            body: JSON.stringify({ amount: 1000 }),
        }).then((res) => res.json());
        const clientSecret = response.paymentIntent.client_secret;
        let n  = "";
        if(details && details.display)
        {
            n = details.display;
        }
        else
        {
            n = noUserDet.name;
        }
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: n ,
                },
            },
        });

        if (paymentResult.error) {
            e.target.disabled = false;
            alert(paymentResult.error.message);
        } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
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
                             <h2 className="address-title">Select Address for Shipment <span style={{ color: 'red' }}>*</span></h2>
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
                    
                    {(!(details && details.address) || (details && details.address && details.address.length === 0)) && <h4 className='NoAdress' style={{ color: "red" }}>Note: Please add an address.</h4>}
                    {(details&& details.address && details.address.length>0) && addressState && <h4 style={{color:"red"}}>Note: Please select an address.</h4>}
                    
                    {!addressState && select && (
                        <div className="selected-address">
                            <h2 className="address-heading">Address</h2>
                            <p className="address-details">
                                {select.street}, {select.city}, {select.state}, {select.postal},{' '}
                                {select.country}
                            </p>
                            <button className="change-address-button" onClick={changeAddress}>
                                Select Other Address
                            </button>
                        </div>
                    )}
                    <button className="address-add-button" onClick={addnewADD}>
                                Click Here to Add New Address or Edit Address
                    </button>
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
                    </div>
                    <button className="submit-address-button" onClick={submitNoUseraddress}>
                        Submit Address
                    </button>
                </div>
            )}
            {!user?.user && amount>0 && !noUserDetState && (
                <div className="guest-address-display">
                    <h1 className="guest-address-name">{noUserDet.name}</h1>
                    <h2 className="guest-address-heading">Address</h2>
                    <p className="guest-address-details">
                        {noUserDet.street}, {noUserDet.city}, {noUserDet.state}, {noUserDet.postal},{' '}
                        {noUserDet.country}
                    </p>
                    <button className="edit-address-button" onClick={noUserEditAdress}>
                        Edit Address
                    </button>
                </div>
            )}
            <div className="payment-section">
                {amount>0 && (
                    <div className="payment-form">
                        <h2 className='totalAmount'>Total amount : {amount}</h2>
                        <button className='Check_Cart' onClick={checkCart}> Click here to Check Cart </button>
                        <h6> 
                            <span style={{ color: "blue", fontSize: "12px", lineHeight: "1.5" }}>
                                *Sample Test Card: 4242 4242 4242 4242, Expiry Date: Any Future Date, (CVC, POSTAL): Any Valid Value
                            </span>
                        </h6>
                        <h2 className="payment-title">Credit Card Payment</h2>
                        <CardElement className="card-element" />
                        { user.user && 
                        <div>
                        <button disabled= {addressState} className="pay-now-button" onClick={paymentHandler}>
                            Pay Now
                        </button></div>}
                        {!user.user &&
                        <button disabled= { noUserDetState} className="pay-now-button" onClick={paymentHandler}>
                            Pay Now
                        </button>}
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
