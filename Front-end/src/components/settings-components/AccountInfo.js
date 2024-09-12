/************************************************************************************************
 * Purpose: Account Info Page
 * Fix: 
 ************************************************************************************************/
import React, { useState } from 'react';
import '../Components.css';

const AccountInfo = () => {
    const [isEditMode, setIsEditMode] = useState(false);

    // Placeholder text for user information. Link with mySQL or EntraID.
    const initialData = {
        firstName: 'Joe',
        lastName: 'Bloggs',
        email: 'joebloggs@outlook.com',
        password: '**********',
        dateOfBirth: '08/05/1980'
    };

    const [savedData, setSavedData] = useState(initialData);
    const [formData, setFormData] = useState(savedData);

    const handleSaveClick = (e) => {
        e.preventDefault();
        setSavedData(formData); // Save the changes
        setIsEditMode(false);
    };

    const handleDiscardClick = () => {
        setFormData(savedData); // Revert form data to the last saved state
        setIsEditMode(false);
    };

    // Get the name and the current value of the input field where the user is typing
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (!isEditMode) {
            setIsEditMode(true);
        }
    };

    return (
        <div>
            <h2 className='fw-bold ms-3'>Account Information</h2>
            <form onSubmit={handleSaveClick}>
                <div className="mb-3 ps-3 pe-5 mt-4">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control text-input-box text-box-size"
                        value={formData.firstName}
                        name="firstName"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 ps-3 pe-5">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control text-input-box text-box-size"
                        value={formData.lastName}
                        name="lastName"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 ps-3 pe-5">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control text-input-box text-box-size"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 ps-3 pe-5">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control text-input-box text-box-size"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-5 ps-3 pe-5">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="text"
                        className="form-control text-input-box text-box-size"
                        value={formData.dateOfBirth}
                        name="dateOfBirth"
                        onChange={handleChange}
                    />
                </div>
                {isEditMode && (
                    <div className='ps-3 mt-5'>
                        <button type="submit" className="green-btn">Save</button>
                        <button type="button" className="green-btn ms-2" onClick={handleDiscardClick}>Discard Changes</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AccountInfo;
