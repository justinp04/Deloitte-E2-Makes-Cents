import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import './NewsHeroSection.css';

const NewsHeroSection = ({ title, subtitle, image }) => {
    return (
        <div className="mb-4">
            <Carousel className="hero-section mx-auto">
                <Carousel.Item>
                    {image ? <Image src={image} className="d-block hero-image" fluid /> : null}
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
};

export default NewsHeroSection;