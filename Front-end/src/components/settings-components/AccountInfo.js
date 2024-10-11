/************************************************************************************************
 * Purpose: Account Info Page
 * Fix: 
 ************************************************************************************************/
import React, { useState } from 'react';
import '../Components.css';

const AccountInfo = () => {
    const [isEditMode, setIsEditMode] = useState(false);

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
        <div className="d-flex justify-content-center align-items-center"> 
                <div className="col-md-8 col-lg-6">
                    <form onSubmit={handleSaveClick}>
                        <div className="mb-3">
                            <label className="page-subtitle3-text">First Name</label>
                            <input
                                type="text"
                                className="form-control text-input-box"
                                value={formData.firstName}
                                name="firstName"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="page-subtitle3-text">Last Name</label>
                            <input
                                type="text"
                                className="form-control text-input-box"
                                value={formData.lastName}
                                name="lastName"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="page-subtitle3-text">Email</label>
                            <input
                                type="email"
                                className="form-control text-input-box"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="page-subtitle3-text">Password</label>
                            <input
                                type="password"
                                className="form-control text-input-box"
                                value={formData.password}
                                name="password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="page-subtitle3-text">Date of Birth</label>
                            <input
                                type="text"
                                className="form-control text-input-box"
                                value={formData.dateOfBirth}
                                name="dateOfBirth"
                                onChange={handleChange}
                            />
                        </div>
                        {isEditMode && (
                            <div className='d-flex justify-content-center mt-5'>
                                <button type="submit" className="green-btn me-2">Save</button>
                                <button type="button" className="green-btn" onClick={handleDiscardClick}>Discard Changes</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
    );
};

export default AccountInfo;