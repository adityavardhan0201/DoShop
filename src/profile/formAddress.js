import { useState } from "react";

const FormAddress = (props) => {
    const [address, setAddress] = useState(props.addr);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };
    
    const { city, country, postal, state, street } = address;
    const SubmitEdit = (add)=>
    {
        if (!add.street || !add.city || !add.state || !add.postal || !add.country) {
            alert("All fields must be filled!");
            return;
        }
        props.editAdress(props.addr,add);
    }
    return (
        <div className="address-box">
            <h2 className="address-title">Address Details</h2>
            <div className="address-field">
                <label>Street:</label>
                <input
                    type="text"
                    name="street"
                    value={street}
                    onChange={handleChange}
                />
            </div>
            <div className="address-field">
                <label>City:</label>
                <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleChange}
                />
            </div>
            <div className="address-field">
                <label>State:</label>
                <input
                    type="text"
                    name="state"
                    value={state}
                    onChange={handleChange}
                />
            </div>
            <div className="address-field">
                <label>Postal Code:</label>
                <input
                    type="text"
                    name="postal"
                    value={postal}
                    onChange={handleChange}
                />
            </div>
            <div className="address-field">
                <label>Country:</label>
                <input
                    type="text"
                    name="country"
                    value={country}
                    onChange={handleChange}
                />
            </div>
            <div>
                <button className = "disbutton" onClick={()=>SubmitEdit(address)}>
                    Submit edited Adress
                </button>
            </div>
        </div>
    );
};

export default FormAddress;
