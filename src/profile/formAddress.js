import { useState } from "react";
import './formAddress.css';
import {Countries} from'../context/country';

const FormAddress = (props) => {
    const [address, setAddress] = useState(props.addr);
    const [dropDown,setDropdown] = useState(false);
    const [coutArr,setcoutArr] = useState([]);
    const [addSel,setAddSel] = useState(true);
    const submitCountry = (e)=>
    {
        const { Name, Code } = e;
        const add = Name +" ("+Code+")";
        setAddress({ ...address, country: add});
        setDropdown(false)
        setAddSel(true)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });

        if(name === "country")
        {
            if(e.target.value !== address.country)
            {
                console.log(e.target.value)
                console.log(address.country)
                setAddSel(false)
            }
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
    
    const { city, country, postal, state, street } = address;
    const SubmitEdit = (add)=>
    {
        if (!add.street || !add.city || !add.state || !add.postal || !add.country) {
            alert("All fields must be filled!");
            return;
        }
        if( !addSel) 
        {
            alert("Select A country from Dropdown");
            return;
        }
        props.editAdress(props.addr,add);
    }
    return (
        <div className="address-container">
            <h2 className="address-header">Address Details</h2>
            <div className="address-input-container">
                <label>Street:</label>
                <input
                    type="text"
                    name="street"
                    value={street}
                    onChange={handleChange}
                />
            </div>
            <div className="address-input-container">
                <label>City:</label>
                <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleChange}
                />
            </div>
            <div className="address-input-container">
                <label>State:</label>
                <input
                    type="text"
                    name="state"
                    value={state}
                    onChange={handleChange}
                />
            </div>
            <div className="address-input-container">
                <label>Postal Code:</label>
                <input
                    type="text"
                    name="postal"
                    value={postal}
                    onChange={handleChange}
                />
            </div>
            <div className="address-input-container">
                <label>Country:</label>
                <input
                    type="text"
                    name="country"
                    value={country}
                    onChange={handleChange}
                />
            </div>
            {dropDown &&
                <div className="dropdown-content">
                {coutArr.map((map, index) => (
                <div key={index} className="dropdown-item">
                    <button onClick={() => submitCountry(map)}>
                        {map.Name}
                    </button>
                </div>))}
                </div>}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' , gap: '70px'}}>
                <button className="submit-button" onClick={()=>SubmitEdit(address)}>
                    Submit Edited Address
                </button>
            </div>
        </div>
    );
};

export default FormAddress;
