
/************************************************************************************************
 * Purpose: About Page - Information on application
 * Fix: 
 *  - Nav bar gets smaller on this page for some reason
 *  - Remove create account button when user is signed in
 ************************************************************************************************/

import React, {Component, startTransition} from "react";
import { Link } from "react-router-dom";

import './About.css';

function About() {
    return (
        <div className="container">
            <div className="text-center">
                <h1 className="main-title">Makes Cents</h1>
                <h4 className="text-primary mb-3">Invest with Clarity, Confidence and Conviction</h4>
                <h5 className="my-4 mx-5" >
                    We get it. Investing can feel overwhelming, but it doesn't have to be.
                    Our cutting-edge solution utilises generative AI to deliver personalised investment
                    recommendations that fit YOUR goals and preferences. With our platform, you'll
                    ditch the guesswork and trade uncertainty for clarity. Join us now and unlock the
                    power of informed investing!
                </h5>
                <h4 className="fw-bold pb-3 mt-5">Here's what sets us apart:</h4>
                <div className="row justify-content-center">
                    <div className="col-md-4 justify-content-center">
                        <div className="feature-box">
                            <img src="/images/increase.jpg" alt="Feature Icon" />
                            <p>Analysing past stock performance to present accurate futures</p>
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

                <Link to="/register">
                    <button className="btn green-btn my-1 mt-3 mb-5">Create An Account</button>
                </Link>

            </div>
        </div>
    );
}

export default About;