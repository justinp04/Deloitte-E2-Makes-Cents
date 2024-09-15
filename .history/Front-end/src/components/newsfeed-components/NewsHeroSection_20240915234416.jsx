import React from 'react';
import { Image, Carousel } from 'react-bootstrap';
import '../pages/NewsFeed.css';

const NewsHeroSection = ({ articles }) => {
    return (
        <div className="mb-4">
            <Carousel className="hero-section mx-auto">
                {articles.map((article, index) => (
                    <Carousel.Item key={index}>
                        {article.article_photo_url ? (
                            <Image src={article.article_photo_url} className="d-block hero-image" fluid />
                        ) : (
                            <Image src="./images/placeholder_img.jpeg" className="d-block hero-image" fluid />
                        )}
                        <div className="hero-text-container">
                            <div className="hero-title">
                                {article.article_title}
                            </div>
                            <div className="hero-subtitle">
                                {article.article_summary || article.subtitle}
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default NewsHeroSection;
