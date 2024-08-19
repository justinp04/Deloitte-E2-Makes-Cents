
/************************************************************************************************
 * Purpose: Registration Page 1/2 - Personal Details
 * Fix: 
 *  - parameters for input
 *  - dob logic and css
 ************************************************************************************************/

import React, { useState } from 'react';
import { Link } from "react-router-dom";

import TextInputBox from '../TextInputBox';
import './Register.css';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // Handler for form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Continuing registration:', { firstName, lastName, emailAddress, password, repassword, day, month, year });
        // Add registration logic
    };

    return (
        <div className='container'>
            <div>
                <h1 className="text-center mb-0 page-title">REGISTER</h1>
                <h2 className='fw-bold'>Personal Details</h2>
                <p>Please complete all fields marked with an asterisk (*) as they are required.</p>
            </div>
            
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '7vh' }}>
                <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                    {/* First Name input */}
                    <TextInputBox
                        label="First Name"
                        type="firstName"
                        id="inputFirstName"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                    {/* Last Name input */}
                    <TextInputBox
                        label="Last Name"
                        type="lastName"
                        id="inputLastName"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                    {/* Email input */}
                    <TextInputBox
                        label="Email Address"
                        type="emailAddress"
                        id="inputEmailAddress"
                        placeholder="Eg. JohnDoe123@outlook.com"
                        value={emailAddress}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    {/* password input */}
                    <TextInputBox
                        label="Set a Password"
                        type="password"
                        id="inputPassword"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {/* re-password input */}
                    <TextInputBox
                        label="Re-enter Password"
                        type="password"
                        id="inputRepassword"
                        value={repassword}
                        onChange={e => setRepassword(e.target.value)}
                        required
                    />

                    {/* dob input */}
                    {/* Need to add logic that validates dob + need to improve box styling for dob */}
                    <label htmlFor="dob">Date of Birth *</label>
                        <div className="dob-inputs">
                        <input 
                            type="text" 
                            value={day} 
                            onChange={e => setDay(e.target.value)} 
                            placeholder="DD" 
                            maxLength="2" 
                            className="dob text-input-box ddmm" 
                            required 
                        />
                        <span>  /  </span>
                        <input 
                            type="text" 
                            value={month} 
                            onChange={e => setMonth(e.target.value)} 
                            placeholder="MM" 
                            maxLength="2" 
                            className="dob text-input-box ddmm" 
                            required 
                        /> 
                        <span>  /  </span>
                        <input 
                            type="text" 
                            value={year} 
                            onChange={e => setYear(e.target.value)} 
                            placeholder="YYYY" 
                            maxLength="4" 
                            className="dob text-input-box yyyy" 
                            required 
                        />
                    </div>

                    <div className="d-flex justify-content-center pt-4">
                        <Link to="/next">
                            <button type="submit" className="green-btn w-300">Next</button>
                        </Link>
                    </div>
                    
                    <p className="text-center mt-3 pb-4">
                        Already have an account? <a href="/signin">Sign in Here.</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
