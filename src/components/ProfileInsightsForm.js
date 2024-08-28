/************************************************************************************************
 * Purpose: Profile insights form 
 * Fix: 
 * 
 ************************************************************************************************/
import React, { useState } from 'react';

import RangeQuestion from './RangeQuestion';
import SelectQuestion from './SelectQuestion';

const ProfileInsightsForm = () => 
{
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
		var incomeIndex = incomeOptions.indexOf(income) + 1;
		console.log(incomeIndex);
		
		const formData = {
		question_response_1: parseInt(experience),
		question_response_2: incomeIndex,
		question_response_3: parseInt(investmentDuration),
		question_response_4: parseInt(riskLevel),
		question_response_5: parseInt(declineTolerance),
		question_response_6: parseInt(investmentType)
	};
	
		console.log(formData);

		fetch('http://localhost:4000/next/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
		})
		.then(response => {
			if (!response.ok) {
			throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			console.log(data);
			alert('Request successful! Check console for response.');
		})
		.catch(error => {
			console.error('Error:', error);
			alert('Request failed. Check console for error details.');
		});
	};

	return (
		<form onSubmit={handleSubmit} className='w-100' style={{ maxWidth: '800px' }}>
		{/* Question One */}
		<div style={{ marginBottom: '70px' }}>
			<RangeQuestion
			label="Q1. How experienced are you with stock investing?"
			min="1"
			max="5"
			value={experience}
			onChange={setExperience}
			labels={rangeLabelsQ1}
			/>
		</div>
		{/* Question Two */}
		<div style={{ marginBottom: '20px' }}>
			<SelectQuestion
			label="Q2. What is your annual income range?"
			options={incomeOptions}
			value={income}
			onChange={setIncome}
			/>
		</div>
		{/* Question Three */}
		<div style={{ marginBottom: '70px' }}>
			<RangeQuestion
			label="Q3. How long do you plan to hold your investments?"
			min="1"
			max="3"
			value={investmentDuration}
			onChange={setInvestmentDuration}
			labels={rangeLabelsQ3}
			/>
		</div>
		{/* Question Four */}
		<div style={{ marginBottom: '70px' }}>
			<RangeQuestion
			label="Q4. How much risk are you willing to take for higher returns?"
			min="1"
			max="5"
			value={riskLevel}
			onChange={setRiskLevel}
			labels={rangeLabelsQ4}
			/>
		</div>
		{/* Question Five */}
		<div style={{ marginBottom: '70px' }}>
			<RangeQuestion
			label="Q5. How much short-term decline can you handle financially?"
			min="1"
			max="5"
			value={declineTolerance}
			onChange={setDeclineTolerance}
			labels={rangeLabelsQ5}
			/>
		</div>
		{/* Question Six */}
		<div style={{ marginBottom: '70px' }}>
			<RangeQuestion
			label="Q6. Do you prefer investing a lump sum or recurring investments?"
			min="1"
			max="3"
			value={investmentType}
			onChange={setInvestmentType}
			labels={rangeLabelsQ6}
			/>
		</div>
		</form>
	);
};

export default ProfileInsightsForm;
