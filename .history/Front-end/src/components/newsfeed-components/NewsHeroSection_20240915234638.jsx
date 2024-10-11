import React from "react";
import PropTypes from "prop-types";
import { Image, Carousel } from "react-bootstrap";
import '../pages/NewsFeed.css';

const NewsHeroSection = ({ articles }) => {
    // Provide default value to avoid issues if articles is undefined
    const articlesToDisplay = articles || [];

    return (
        <div className="mb-4">
            <Carousel className="hero-section mx-auto">
                {articlesToDisplay.length > 0 ? (
                    articlesToDisplay.map((article, index) => (
                        <Carousel.Item key={index}>
                            <Image 
                                src={article.article_photo_url || "./images/placeholder_img.jpeg"} 
                                className="d-block hero-image" 
                                fluid 
                            />
                            <div className="hero-text-container">
                                <div className="hero-title">
                                    {article.article_title}
                                </div>
                                <div className="hero-subtitle">
                                    {article.article_summary || article.subtitle}
                                </div>
                            </div>
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <Image 
                            src="./images/placeholder_img.jpeg" 
                            className="d-block hero-image" 
                            fluid 
                        />
                        <div className="hero-text-container">
                            <div className="hero-title">
                                No news available
                            </div>
                            <div className="hero-subtitle">
                                Please try again later.
                            </div>
                        </div>
                    </Carousel.Item>
                )}
            </Carousel>
        </div>
    );
}

// Prop type checking
NewsHeroSection.propTypes = {
    articles: PropTypes.arrayOf(
        PropTypes.shape({
            article_title: PropTypes.string,
            article_photo_url: PropTypes.string,
            article_summary: PropTypes.string,
            subtitle: PropTypes.string,
        })
    )
};

// Default props
NewsHeroSection.defaultProps = {
    articles: []
};

export default NewsHeroSection;