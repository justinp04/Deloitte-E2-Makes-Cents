/************************************************************************************************
 * Authors: Justin Pan
 * Purpose: Spotlight news article
 ************************************************************************************************/
import React from "react";
import { Image, Carousel } from "react-bootstrap";
import '../pages/NewsFeed.css';

// let newsTitles = [
//     "News title 1",
//     "News title 2",
//     "News title 3"
// ];
// let newsCaptions = [
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
// ];


const NewsHeroSection = ({ title, subtitle, image }) => {
    return (
        <div className="mb-4">
            <Carousel className="hero-section mx-auto">
                <Carousel.Item>
                    <Image src=image className="d-block hero-image" fluid />
                    <div className="hero-text-container">
                        <div className="hero-title">
                            {title}
                        </div>
                        <div className="hero-subtitle">
                            {subtitle}
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default NewsHeroSection;