import React from 'react';
import { FaEye, FaChartLine, FaDollarSign, FaChartPie } from 'react-icons/fa';
import './QuestionSuggestions.css'; 

const QuestionSuggestions = ({ onQuestionClick }) => {
    const suggestedQuestions = [
        { text: "What are some upcoming ASX stock trends to keep an eye on?", icon: <FaChartLine /> },
        { text: "What sectors are growing in the ASX market?", icon: <FaChartPie /> },
        { text: "Which ASX companies have strong profit margins?", icon: <FaDollarSign /> },
        { text: "What are key metrics to evaluate ASX stocks?", icon: <FaEye /> }
    ];

    return (
        <div className="suggestions-wrapper">
            {/* Gerry's Image */}
            <div className="gerry-image-container">
                <img src="./images/GerryProfile.jpg" alt="Gerry" className="gerry-image" />
            </div>

            {/* Suggested Questions */}
            <div className="suggestions-container">
                {suggestedQuestions.map((question, index) => (
                    <button
                        key={index}
                        className="suggested-question-button"
                        onClick={() => onQuestionClick(question.text)}
                    >
                        <div className="icon">{question.icon}</div>
                        <div className="text">{question.text}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionSuggestions;