/************************************************************************************************
 * Purpose: Profile insights form 
 * Fix: 
 ************************************************************************************************/

/************************************************************************************************
 * Purpose: User Endpoint for recording user insight questions
 * Modified by: Anna Duong
 ************************************************************************************************/



import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import RangeQuestion from './RangeQuestion';
import SelectQuestion from './SelectQuestion';
import Swal from 'sweetalert2';


const ProfileInsightsForm = ({isUpdating = false}) => {
  const { accounts } = useMsal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
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

 // Fetch email from logged-in user's account information and populate data if updating
 useEffect(() => {
    if (accounts.length > 0) {
      const userEmail = accounts[0].username;
      setEmail(userEmail);

      if (isUpdating) {
        // Fetch existing data for the user
        fetch(`http://localhost:4000/next/user-responses?email=${userEmail}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }
            return response.json();
          })
          .then(data => {
            const responses = data.response;
            setExperience(parseInt(responses[0]));
            setIncome(incomeOptions[parseInt(responses[1]) - 1]);
            setInvestmentDuration(parseInt(responses[2]));
            setRiskLevel(parseInt(responses[3]));
            setDeclineTolerance(parseInt(responses[4]));
            setInvestmentType(parseInt(responses[5]));
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }
    }
  }, [accounts, isUpdating]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const incomeIndex = incomeOptions.indexOf(income) + 1;

    const formData = {
      email: email,
      question_response_1: parseInt(experience),
      question_response_2: incomeIndex,
      question_response_3: parseInt(investmentDuration),
      question_response_4: parseInt(riskLevel),
      question_response_5: parseInt(declineTolerance),
      question_response_6: parseInt(investmentType)
    };

    if (isUpdating) {
      // Show a confirmation alert before updating
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update your profile insights?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.isConfirmed) {
            handleUpdate(formData);
        }
    });
    } else {
      handleCreate(formData);
    }
  };

  const handleCreate = (formData) => {
    fetch('http://localhost:4000/next/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        alert('Account created successfully!');
        navigate('/about');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create account. Please check the console for more details.');
      });
  };

  const handleUpdate = (formData) => {
    fetch('http://localhost:4000/next/update-responses', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update user');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully!',
      });
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update profile. Please check the console for more details.');
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
		<div className="center-button mt-3">
                    <button type="submit" className="btn btn-primary green-btn mb-3">Update</button>
                </div>

                <p className="text-center mb-5">
                    Have an account? <a href="/signin">Sign In Here.</a>
                </p>
		</form>
		
	);
};

export default ProfileInsightsForm;
