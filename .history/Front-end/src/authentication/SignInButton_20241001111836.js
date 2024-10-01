import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { useNavigate } from "react-router-dom";

export const SignInButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).then((response) => {
      if (response) {
        const email = response.account.username;

        // Check if the user is new or existing
        fetch(`http://localhost:4000/next/check-user?email=${email}`)
          .then(res => {
            if (res.status === 200) {
              // User exists, navigate to the /about page
              navigate('/about');
            } else {
              // User does not exist, navigate to the UserQuestionaire page
              navigate('/questionnaire');
            }
          })
          .catch(error => {
            console.error('Error checking user existence:', error);
            alert('An error occurred while checking user status. Please try again.');
          });
      }
    }).catch((e) => {
      console.log(e);
    });
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