import React from "react";
import { useMsal } from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Renders a sign out button 
 */
export const SignOutButton = () => {
	const { instance } = useMsal();

	const handleLogout = (logoutType) => {

		instance.logoutPopup({
			postLogoutRedirectUri: "/",
			mainWindowRedirectUri: "/",
		});
	};

	return (
		<button
			className="green-btn"
			style={{width: '150px'}}
			onClick={() => handleLogout()}
		>
		Sign Out
		</button>
);
};