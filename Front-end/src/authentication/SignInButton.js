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
	
			// Check if the user is new or existing
			const res = await fetch(`http://localhost:4000/next/check-user?email=${email}`);
	
			// Using `res.ok` for better readability, checking for `404` explicitly
			if (res.status === 200) {
			// User exists, navigate to the /about page
			navigate('/about');
			} else if (res.status === 404) {
			// User does not exist, navigate to the questionnaire page
			navigate('/questionnaire');
			} else {
			// Handle unexpected statuses here
			throw new Error(`Unexpected response status: ${res.status}`);
			}
		}
		} catch (error) {
		console.error('Error during login or user existence check:', error);
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