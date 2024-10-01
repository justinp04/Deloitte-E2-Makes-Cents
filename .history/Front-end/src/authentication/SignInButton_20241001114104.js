import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useNavigate } from "react-router-dom";

export const SignInButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      if (response) {
        const email = response.account.username;
  
        // Retry logic added to handle transient issues
        const res = await retryFetch(`http://localhost:4000/next/check-user?email=${email}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (res.status === 200) {
          // User exists, navigate to the /about page
          navigate('/about');
        } else if (res.status === 404) {
          // User does not exist, navigate to the questionnaire page
          navigate('/questionnaire');
        } else {
          throw new Error('Unexpected response status from server');
        }
      }
    } catch (error) {
      console.log('Error during login or user existence check:', error);
      alert('An error occurred during the login process. Please try again.');
    }
  };  

  return (
    <button
        className="green-btn"
        style={{width: '150px'}}
        onClick={() => handleLogin()}
    >
      Sign In
    </button>
  );
};