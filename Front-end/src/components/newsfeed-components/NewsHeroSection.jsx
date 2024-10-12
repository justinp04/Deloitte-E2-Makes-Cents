import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Image, Carousel, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import '../pages/NewsFeed.css';

const NewsHeroSection = ({ title, subtitle, image, articles, showSpinner }) => {
    return (
        <div className="mt-0">
            {
                !showSpinner ?
                    <Container className="d-flex justify-content-center">
                        <Spinner animation="border" variant="success" hidden={showSpinner} />
                    </Container>
                    :
                    <Carousel className="hero-section mx-auto">
                        {articles.length > 0 ? (
                            articles.map((article, index) => (
                                <Carousel.Item key={index}>
                                    <Image
                                        src={article.article_photo_url}
                                        loading="lazy"
                                        className="d-block hero-image"
                                        fluid
                                    />
                                    <div className="hero-text-container">
                                        <div className="hero-title">
                                            {article.article_title || "No Title"}
                                        </div>
                                        <div className="hero-subtitle">
                                            {article.source || "No Source"}
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
            }
        </div>
    );
}

NewsHeroSection.propTypes = {
    articles: PropTypes.arrayOf(
        PropTypes.shape({
            article_title: PropTypes.string.isRequired,
            article_summary: PropTypes.string.isRequired,
            article_photo_url: PropTypes.string.isRequired,
        })
    ).isRequired
};

export default NewsHeroSection;