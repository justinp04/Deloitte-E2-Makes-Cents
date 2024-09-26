import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authentication/authConfig";
import './About.css';

function About() {
    // handling user login logic
    const { instance, accounts } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch((e) => {
            console.log(e);
        });
    };

    // state to track if user is signed in
    const [isSignedIn, setIsSignedIn] = useState(false);

    // update isSignedIn whenever accounts change
    useEffect(() => {
        setIsSignedIn(accounts.length > 0);
    }, [accounts]);

    return (
        <div className="container">
            <div className="text-center">
                <h1 className="main-title">Makes Cents</h1>
                <h4 className="text-primary mb-3">Invest with Clarity, Confidence and Conviction</h4>
                <h5 className="my-4 mx-5">
                    We get it. Investing can feel overwhelming, but it doesn't have to be.
                    Our cutting-edge solution utilizes generative AI to deliver personalized investment
                    recommendations that fit YOUR goals and preferences. With our platform, you'll
                    ditch the guesswork and trade uncertainty for clarity. Join us now and unlock the
                    power of informed investing!
                </h5>
                <h4 className="fw-bold pb-3 mt-5">Here's what sets us apart:</h4>
                <div className="row justify-content-center">
                    <div className="col-md-4 justify-content-center">
                        <div className="feature-box">
                            <img src="/images/increase.jpg" alt="Feature Icon" />
                            <p>Analyzing past stock performance to present accurate futures</p>
                        </div>
                        <div className="feature-box">
                            <img src="/images/lightbulb.jpg" alt="Feature Icon" />
                            <p>Simplifying complex financial information for easy-to-understand data</p>
                        </div>
                    </div>
                    <div className="col-md-4 justify-content-center">
                        <div className="feature-box">
                            <img src="/images/newspaper.jpg" alt="Feature Icon" />
                            <p>Monitoring social media sentiment for real-time insights</p>
                        </div>
                        <div className="feature-box">
                            <img src="/images/person.jpg" alt="Feature Icon" />
                            <p>Providing tailored recommendations just for you</p>
                        </div>
                    </div>
                </div>

                {/* conditionally render "Create An Account button" if user is not signed in */}
                {!isSignedIn && (
                    <button className="green-btn" onClick={handleLogin}>
                        Create An Account
                    </button>
                )}
            </div>
        </div>
    );
}

export default About;
