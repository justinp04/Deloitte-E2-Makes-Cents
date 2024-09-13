
/************************************************************************************************
 * Purpose: About Page - Information on application
 * Fix: 
 *  - Nav bar gets smaller on this page for some reason
 *  - Remove create account button when user is signed in
 ************************************************************************************************/

import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authentication/authConfig";

import './About.css';

function About() 
{
    const boxes = [
        { id: 1, content: 'Monitoring of social media and news for real-time insights', image: '/images/newspaper.jpg' },
        { id: 2, content: 'Simplifying of complex financial information into easy-to-understand bites', image: '/images/lightbulb.jpg' },
        { id: 3, content: 'Providing tailored recommendations just for you', image: '/images/person.jpg' }
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
    
          {/* Dynamic Boxes Section */}
          <div className="container mt-5">
            <div className="row justify-content-center">
              {boxes.map(box => (
                <div key={box.id} className="col-md-3 mb-4">
                  <div className="box feature-box d-flex flex-column justify-content-center align-items-center text-center" style={{backgroundColor:"white", height:"23rem", borderRadius:"40px"}}>
                    <img src={box.image} className="img-fluid mb-5"/>
                    <p>{box.content}</p>
                  </div>
                </div>
              ))}
            </div>
                <button className="green-btn" onClick={() => handleLogin()}>
                    Create An Account
                </button>
            </div>
        </div>
    );
}

export default About;