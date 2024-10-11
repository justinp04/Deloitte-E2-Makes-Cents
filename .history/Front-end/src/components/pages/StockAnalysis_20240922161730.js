import React, { useState, useRef, useEffect } from 'react';
import SASidebar from '../stockanalysis-components/SASidebar';
import StockSummary from '../stockanalysis-components/StockSummary';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';
import QuestionSuggestions from '' // Import the new component
import ChatBox from '../stockanalysis-components/ChatBox';

function StockAnalysis({ isSignedIn }) {
    const [messages, setMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]); // State to hold follow-up suggestions
    const chatEndRef = useRef(null);
    const [typing, setTyping] = useState(false);

    const handleSendMessage = async (newMessage) => {
        if (!newMessage.trim()) {
            return;
        }
        setMessages([...messages, { sender: 'user', message: newMessage }]);
        setTyping(true);

        try {
            const chatResponse = await fetch('http://localhost:4000/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
            });

            const chatData = await chatResponse.json();

            // Separate the main response and the suggestions
            const { response, followUpSuggestions } = chatData;

            setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: response }]);

            // Update the follow-up suggestions
            setSuggestions(followUpSuggestions || []);

        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: 'An error occurred while sending your message' }]);
        } finally {
            setTyping(false);
        }
    };

    const handleSuggestedQuestionClick = (question) => {
        handleSendMessage(question);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    return (
        <div className="page-container">
            <div className="sa-sidebar">
                <SASidebar
                    favouriteStocks={favouriteStocks}
                    addFavourite={(companyTitle) => setFavouriteStocks([...favouriteStocks, companyTitle])}
                    removeFavourite={(companyTitle) => setFavouriteStocks(favouriteStocks.filter(stock => stock !== companyTitle))}
                    onSearch={handleSearch}
                />
            </div>
            <div className="content" style={{ paddingTop: '200px' }}>
                {/* Chat Messages */}
                {messages.map((msg, index) => (
                    <ChatBox key={index} message={msg.message} sender={msg.sender} />
                ))}

                {/* Follow-up suggestions */}
                {suggestions.length > 0 && (
                    <div className="suggestions-box">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="suggested-question-chip"
                                onClick={() => handleSuggestedQuestionClick(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={chatEndRef} />
                <QueryInputBar onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}

export default StockAnalysis;