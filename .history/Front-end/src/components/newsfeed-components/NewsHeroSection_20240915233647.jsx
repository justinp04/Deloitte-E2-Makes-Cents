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


// const NewsHeroSection = ({ newsArticles = [] }) => { // Default to empty array if not provided
//     if (!Array.isArray(newsArticles)) {
//         console.error('Invalid data type for newsArticles. Expected an array.');
//         return null; // or a fallback UI component
//     }

//     return (
//         <div className="mb-4">
//             <Carousel className="hero-section mx-auto">
//                 {newsArticles.length > 0 ? (
//                     newsArticles.map((article, index) => (
//                         <Carousel.Item key={index}>
//                             <Image 
//                                 src={article.article_photo_url} 
//                                 className="d-block hero-image" 
//                                 fluid 
//                                 alt={`Image for ${article.article_title}`}
//                             />
//                             <div className="hero-text-container">
//                                 <div className="hero-title">
//                                     {article.article_title}
//                                 </div>
//                                 <div className="hero-subtitle">
//                                     {article.article_summary || 'No summary available'}
//                                 </div>
//                             </div>
//                         </Carousel.Item>
//                     ))
//                 ) : (
//                     <Carousel.Item>
//                         <div className="d-block text-center">
//                             No news available.
//                         </div>
//                     </Carousel.Item>
//                 )}
//             </Carousel>
//         </div>
//     );
// };

// export default NewsHeroSection;

const NewsHeroSection = ({ articles }) => {
    return (
        <div className="mb-4">
            <Carousel className="hero-section mx-auto">
                {articles.map((article, index) => (
                    <Carousel.Item key={index}>
                        {article.article_photo_url ? (
                            <Image src={article.article_photo_url} className="d-block hero-image" fluid />
                        ) : null}
                        <div className="hero-text-container">
                            <div className="hero-title">
                                {article.article_title}
                            </div>
                            <div className="hero-subtitle">
                                {article.article_summary}
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default NewsHeroSection;