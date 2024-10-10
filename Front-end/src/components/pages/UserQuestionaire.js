
/************************************************************************************************
 * Purpose: Registration Page 2/2 - Profile Insights (questionaire for user)
 * Fix: 
 *  - Button width
 *  - range labels positioning
 ************************************************************************************************/

import React, { useState } from 'react';

import ProfileInsightsForm from '../ProfileInsightsForm';
import './UserQuestionaire.css';

function UserQuestionaire() {

     // State to store form data from ProfileInsightsForm
     const [formData, setFormData] = useState({
        question_response_1: 1,
        question_response_2: 1,
        question_response_3: 1,
        question_response_4: 1,
        question_response_5: 1,
        question_response_6: 1
    });
    
    return (
        <div id="questionnaire-container" className='container questionnaire-width'>
            <div className="mb-4">
                <h1 className="text-center mb-0 page-title fw-bold">REGISTER</h1>
                <h2 className='fw-bold'>Profile Insights</h2>
                <p>To provide you with the most relevant stock recommendations, please fill out the 'Profile Insights' section.
                    This information will help us tailor our suggestions to match your investment experience, financial goals, and risk tolerance.</p>
            </div>
            <hr/>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '7vh' }}>
                <ProfileInsightsForm />
                {/* <div className="center-button mt-3">
                    <button type="submit" className="btn btn-primary green-btn mb-3">Create Account</button>
                </div>

                <p className="text-center mb-5">
                    Have an account? <a href="/signin">Sign In Here.</a>
                </p> */}
            </div>
        </div>
    );
}

export default UserQuestionaire;