import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance
      .loginPopup(loginRequest)
      .then(() => {
        // user successfully signed in
        localStorage.setItem('isSignedIn', 'true'); // save the status in localStorage
      })
      .catch(() => {
        // do nothing otherwise
      });
  };

  return (
    <button
      className="green-btn"
      style={{ width: '150px' }}
      onClick={() => handleLogin()}
    >
      Sign In
    </button>
  );
};
