
/************************************************************************************************
 * Purpose: Registration Page 2/2 - Profile Insights (questionaire for user)
 * Fix: 
 *  - Button width
 *  - range labels positioning
 ************************************************************************************************/

import React, { useState } from 'react';
import { Placeholder } from 'react-bootstrap';

import RangeQuestion from '../RangeQuestion';
import SelectQuestion from '../SelectQuestion';

function UserQuestionaire() {
    const [experience, setExperience] = useState(1);
    const [income, setIncome] = useState('');
    const [investmentDuration, setInvestmentDuration] = useState(1);
    const [riskLevel, setRiskLevel] = useState(1);
    const [declineTolerance, setDeclineTolerance] = useState(1);
    const [investmentType, setInvestmentType] = useState(1);

    // income options
    const incomeOptions = [
        "Less than $18,000",
        "$18,000 - $45,000",
        "$45,000 - $135,000",
        "$135,000 - $190,000",
        "More than $190,000"
    ];
    // range options
    const rangeLabelsQ1 = ["Novice", "Beginner", "Intermediate", "Advanced", "Expert"];
    const rangeLabelsQ3 = ["Less than 3 years", "3-10 years", "10+ years"];
    const rangeLabelsQ4 = ["No Risk", "Slightly Uncomfortable", "Neutral", "Comfortable", "Very Comfortable"];
    const rangeLabelsQ5 = ["Can't Afford", "Can Barely Afford", "Can Somewhat Afford", "Can Comfortably Afford", "Can Easily Afford"];
    const rangeLabelsQ6 = ["Lump Sum", "Mix of Both", "Recurring Investments"];

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            experience,
            income,
            investmentDuration,
            riskLevel,
            declineTolerance,
            investmentType
        };
        console.log(formData);
        // Submit these values to backend
    };

    return (
        <div className='container'>
            <div>
                <h1 className="text-center mb-0 page-title">REGISTER</h1>
                <h2 className='fw-bold'>Profile Insights</h2>
                <p>To provide you with the most relevant stock recommendations, please fill out the 'Profile Insights' section.
                    This information will help us tailor our suggestions to match your investment experience, financial goals, and risk tolerance.</p>
            </div>

            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '7vh' }}>
                <form onSubmit={handleSubmit} className='w-100' style={{ maxWidth: '800px' }}>
                     {/* Question One */}
                     <RangeQuestion 
                        label="Q1. How experienced are you with stock investing?" 
                        min="1" 
                        max="5" 
                        value={experience} 
                        onChange={setExperience} 
                        labels={rangeLabelsQ1}
                    />
                    {/* Question Two */}
                    <SelectQuestion 
                        label="Q2. What is your annual income range?" 
                        options={incomeOptions} 
                        value={income} 
                        onChange={setIncome} 
                    />
                    {/* Question Three */}
                    <RangeQuestion 
                        label="Q3. How long do you plan to hold your investments?" 
                        min="1" 
                        max="3" 
                        value={investmentDuration} 
                        onChange={setInvestmentDuration} 
                        labels={rangeLabelsQ3}
                    />
                    {/* Question Four */}
                    <RangeQuestion 
                        label="Q4. How much risk are you willing to take for higher returns?" 
                        min="1" 
                        max="5" 
                        value={riskLevel} 
                        onChange={setRiskLevel} 
                        labels={rangeLabelsQ4}
                    />
                    {/* Question Five */}
                    <RangeQuestion 
                        label="Q5. How much short-term decline can you handle financially?" 
                        min="1" 
                        max="5" 
                        value={declineTolerance} 
                        onChange={setDeclineTolerance} 
                        labels={rangeLabelsQ5}
                    />
                    {/* Question Six */}
                    <RangeQuestion 
                        label="Q6. Do you prefer investing a lump sum or recurring investments?" 
                        min="1" 
                        max="3" 
                        value={investmentType} 
                        onChange={setInvestmentType} 
                        labels={rangeLabelsQ6}
                    />

                    <div className="center-button">
                        <button type="submit" className="btn btn-primary green-btn w-50 mb-3">Create Account</button>
                    </div>

                    <p className="text-center mb-5">
                    Have an account? <a href="/register">Sign In Here.</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default UserQuestionaire;
