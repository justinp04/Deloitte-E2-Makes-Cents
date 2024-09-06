/************************************************************************************************
 * Purpose: Spotlight news article
 * Fix: 
 ************************************************************************************************/
import React from "react";
import { Image } from "react-bootstrap";
import '../pages/NewsFeed.css';

const NewsHeroSection = () => {
    return (
        <div className="mb-4">
            <a>
                <div className="hero-section mx-auto">
                    <Image src="./images/hero_img.jpeg" className="d-block hero-image" fluid />
                    <div className="hero-text-container">
                        <div className="hero-title">
                            Insert news title here
                        </div>
                        <div className="hero-subtitle">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}
export default NewsHeroSection;
