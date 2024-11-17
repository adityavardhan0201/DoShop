import { useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase_1";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import FormAddress from './formAddress';
import { useNavigate } from "react-router-dom";
import './ProfilePage.css';
import _ from "lodash";

const ProfileDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const details = useSelector((state) => state.details);
    const [changename, setName] = useState(false);
    const [newName, setnewName] = useState("");
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postal, setPostal] = useState('');
    const [country, setCountry] = useState('');
    const [add, setAdd] = useState(false);
    const [addADD , setAddADD]  = useState({});
    const addAdd = () => {
        setAddADD({});
        setAdd(true);
    };

    const handleSubmit = async (e) => {
        setAddADD({});
        if (!street || !city || !state || !postal || !country) 
        {
            alert("All fields must be filled!");
            return;
        }
        else if (user != null) {
            const ref = await doc(db, "users", user.uid);
            const get = await getDoc(ref);
            const set = get.data();
            const bool = 'address' in set;
            if (!bool) {
                const setsend = { ...set, address: [{ street, city, state, postal, country }] };
                await setDoc(ref, setsend);
                dispatch({ type: 'FETCH_DETAILS', payload: setsend });
            } else {
                let isThere = false;
                const setsend = set.address;
                setsend.forEach(element => {
                    if (_.isEqual(element, { street, city, state, postal, country })) {
                        isThere = true;
                    }
                });
                if (!isThere) {
                    setsend.push({ street, city, state, postal, country });
                    const setsend2 = { ...set, address: setsend };
                    await setDoc(ref, setsend2);
                    dispatch({ type: 'FETCH_DETAILS', payload: setsend2 });
                } else {
                    alert('Address Already Exists');
                }
            }
        }
        setAdd(false);
    };

    const editAdress = async (prev, pres) => {
        if (user != null) {
            const ref = await doc(db, "users", user.uid);
            const get = await getDoc(ref);
            const set = get.data();
            const addressList = set.address;
            const index = addressList.findIndex((addr) => _.isEqual(addr, prev));
            addressList[index] = pres;
            const updatedData = { ...set, address: addressList };
            await setDoc(ref, updatedData);
            dispatch({ type: 'FETCH_DETAILS', payload: updatedData });
            setAddADD({});
        }
    };

    const TochangeName = () => {
        setName(true);
    };

    const changeNameinput = (event) => {
        setnewName(event.target.value);
    };

    const buttonSubmit = async () => {
        if (newName.length === 0) {
            alert("Name is In-Valid");
        } else {
            if (user != null) {
                const ref = await doc(db, "users", user.uid);
                const get = await getDoc(ref);
                const set = get.data();
                const setsend = { ...set, display: newName };
                await setDoc(ref, setsend);
                setName(false);
                dispatch({ type: 'FETCH_DETAILS', payload: setsend });
            }
        }
    };

    const clickEdit = (event, index) => {
        setAddADD(event);
    };

    const deleteADD = async (event,index) =>
    {
        if (user != null) 
        {
            const ref = doc(db,"users",user.uid);
            const get = await getDoc(ref);
            const set = get.data();
            const addArr = set.address;
            
            const filterArr = addArr.filter((map) => !_.isEqual(map,event));
            const updatedData = { ...set, address: filterArr };
            await setDoc(ref, updatedData);
            dispatch({ type: 'FETCH_DETAILS', payload: updatedData });
        }
    }
    return (
        <div className="ProfileContainer">
            {user != null && <h1 className="ProfileHeader">{details && details.display}</h1>}
            <button className="changeNameButton" onClick={TochangeName}>Click to Change Name</button>
            {changename && user != null && (
                <div className="nameChangeSection">
                    <input
                        className="nameInput"
                        placeholder="Enter New Name"
                        onChange={changeNameinput}
                    />
                    <button className="submitNameButton" onClick={buttonSubmit}>Submit New Name</button>
                </div>
            )}
            {details?.address && details.address.length > 0 && (
                <div className="addressSection">
                    <h2 className="addressHeader">Saved Addresses:</h2>
                    <ul className="addressList">
                        {details.address.map((addr, index) => (
                            <div key={index} className="addressItemWrapper">
                                <li className="addressItem">
                                    {!_.isEqual(addr, addADD) && (
                                        <div className="addressContent">
                                            {addr.street}, {addr.city}, {addr.state}, {addr.postal}, {addr.country}
                                        </div>
                                    )}
                                </li>
                                <div className="addressActions">
                                    {!_.isEqual(addr, addADD) && (
                                        <div className="editDelete">
                                            <button className="editButton" onClick={() => clickEdit(addr, index)}>Edit</button>
                                            <button className="deleteButton" onClick={()=> deleteADD(addr, index)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                                {_.isEqual(addr, addADD) && (
                                    <div className="editFormWrapper">
                                        <FormAddress editAdress={editAdress} addr={addr} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </ul>
                </div>
            )}
            {(!(details && details.address) || (details && details.address && details.address.length === 0)) && <h4 style={{ color: "red", textAlign: "center", fontSize: "14px" }}>No Address Present</h4>}
            <button className="addAddressButton" onClick={addAdd}>Add New Address</button>
            {add && (
                <div className="addAddressForm">
                    <label className="formLabel">
                        Street:
                        <input
                            className="formInput"
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                        />
                    </label>
                    <label className="formLabel">
                        City:
                        <input
                            className="formInput"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label className="formLabel">
                        State/Province:
                        <input
                            className="formInput"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                    <label className="formLabel">
                        Postal Code:
                        <input
                            className="formInput"
                            type="text"
                            value={postal}
                            onChange={(e) => setPostal(e.target.value)}
                            required
                        />
                    </label>
                    <label className="formLabel">
                        Country:
                        <input
                            className="formInput"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <button className="submitAddressButton" onClick={handleSubmit}>Submit Address</button>
                </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', paddingTop: '30px'}}>
                <button className = "cartAndHomebut" onClick={() => { navigate('/Shopping') }}>Do Shopping</button>
                <button className = "cartAndHomebut" onClick={() => { navigate('/Cart') }}>Checkout Cart</button>
            </div>
        </div>
    );
};

export default ProfileDetails;
