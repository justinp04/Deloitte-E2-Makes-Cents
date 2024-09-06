import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useNavigate } from "react-router-dom";

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 * Note the [useMsal] package 
 */

export const SignInButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then((response) => {
        // Assuming successful login, navigate to the questionnaire
        // TODO: Replace the conditional check below with actual API call when backend is set up
        const isNewUser = true; 

        if (isNewUser) {
          navigate('/questionnaire');
        } else {
          navigate('/');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <button
        className="green-btn"
        onClick={() => handleLogin()}
    >
      Sign In
    </button>
  );
};
