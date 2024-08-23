/************************************************************************************************
 * Purpose: Sign In Page
 * Fix: 
 * Future Ideas:
 *  - Set up forgot password page
 ************************************************************************************************/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TextInputBox from '../TextInputBox';

function SignIn({ setIsSignedIn }) {
    const [emailAddress, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Submitted');
        console.log('Email:', emailAddress);
        console.log('Password:', password);

        if (emailAddress && password) {
            try {
                console.log('Before setting sign-in state');
                setIsSignedIn(true);
                console.log('Signed In State Set to True');
                console.log('Before navigating to /stock-analysis');
                navigate('/stock-analysis');
                console.log('Navigating to /stock-analysis');
            } catch (error) {
                console.error('Error during sign-in process:', error);
            }
        } else {
            alert('Email and password must be filled out');
        }
    };

    return (
        <div className='container'>
            <h1 className="text-center mb-0 page-title">SIGN IN</h1>
            <div className="d-flex justify-content-center align-items-center mt-5">
                <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
                    {/* Email input */}
                    <TextInputBox
                        label="Email"
                        type="email"
                        id="inputEmail"
                        placeholder="Eg. Example@outlook.com"
                        value={emailAddress}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {/* Password input */}
                    <TextInputBox
                        label="Password"
                        type="password"
                        id="inputPassword"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div className="text-end mb-3">
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <div className="center-button">
                        <button type="submit" className="btn btn-primary green-btn w-50">Sign In</button>
                    </div>
                    <p className="text-center mt-3">
                        Don’t have an account? <a href="/register">Register Here.</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignIn;

