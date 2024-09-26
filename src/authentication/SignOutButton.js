import React from "react";
import { useMsal } from "@azure/msal-react";

/**
 * Renders a sign out button 
 */
export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
      // set 'isSignedIn' flag to false in local storage
      localStorage.setItem('isSignedIn', 'false');

      // proceed with Azure AD sign-out
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
  };

  return (
      <button
          className="green-btn"
          style={{width: '150px'}}
          onClick={handleLogout}
      >
        Sign Out
      </button>
  );
};
