import React from 'react';
import { FaEye, FaChartLine, FaDollarSign, FaChartPie } from 'react-icons/fa';
import './QuestionSuggestions.css'; 

const QuestionSuggestions = ({ onQuestionClick }) => {
    const suggestedQuestions = [
        { text: "What is the 52-week high for this stock?", icon: <FaChartLine /> },
        { text: "What is the current price of this stock?", icon: <FaChartPie /> },
        { text: "What are some key economic indicators that can impact stock prices?", icon: <FaDollarSign /> },
        { text: "What are the current trends in this stock I should be aware of?", icon: <FaEye /> }
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