
/************************************************************************************************
 * Purpose: About Page - Information on application
 * Fix: 
 *  - Nav bar gets smaller on this page for some reason
 *  - Remove create account button when user is signed in
 ************************************************************************************************/
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authentication/authConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faWandMagicSparkles, faPerson } from '@fortawesome/free-solid-svg-icons';

import './About.css';

function About() {
    const boxes = [
        { id: 1, title: 'Column 1', content: 'Monitoring of social media and news for real-time insights', icon: faNewspaper },
        { id: 2, title: 'Column 2', content: 'Simplifying complex financial information into easy-to-understand bites', icon: faWandMagicSparkles },
        { id: 3, title: 'Column 3', content: 'Providing tailored recommendations just for you', icon: faPerson }
    ];

    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch((e) => {
            console.log(e);
        });
    };

    return (
        <div className="container text-center mb-3">
            <h1 className="main-title">Makes Cents</h1>
            <h4 className="text-primary mb-3">Invest with Clarity, Confidence and Conviction</h4>
            <h6 className="my-4 mx-5 px-5">
                Investing can feel overwhelming, but it doesn't have to be. <br />
                Our AI-powered solution delivers personalised investment recommendations tailored to your goals. Say goodbye to guesswork and gain clarity with our platform. <br />
                <br />
                Join us and start investing with confidence!
            </h6>

            <div className="container mt-5">
                {/* Dynamically render the boxes */}
                <div className="row">
                    {boxes.map((box) => (
                        <div key={box.id} className="col-lg">
                            <div className="card p-5">
                                <FontAwesomeIcon icon={box.icon} size="3x" className="mb-3" />
                                <h3>{box.title}</h3>
                                <p>{box.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="green-btn mt-5" onClick={handleLogin}>
                    Create An Account
                </button>
            </div>
        </div>
    );
}

export default About;

