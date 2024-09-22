import React, { useState, useRef, useEffect } from 'react';

import SASidebar from '../stockanalysis-components/SASidebar';
import FavoriteButton from '../stockanalysis-components/FavouriteButton';
import ChatBox from '../stockanalysis-components/ChatBox';
import ToggleSwitch from '../ToggleSwitch';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';
import StockSummary from '../stockanalysis-components/StockSummary';
import SearchBar from '../SearchBar';
import QuestionSuggestions from '../stockanalysis-components/QuestionSuggestions';

function StockAnalysis({ isSignedIn }) {
    const [messages, setMessages] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [favouriteStocks, setFavouriteStocks] = useState([]);
    const [quickSummary, setQuickSummary] = useState('');
    const [detailedSummary, setDetailedSummary] = useState('')
    const [references, setReferences] = useState([]);
    const [responseDepth, setResponseDepth] = useState('quick');
    const [stockName, setStockName] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [summaryHeight, setSummaryHeight] = useState(300); // Initial height for summary
    const [isDragging, setIsDragging] = useState(false); // To handle drag state

    const chatEndRef = useRef(null);
    const dividerRef = useRef(null); // Reference for the divider element

    // Manage typing indicator
    const [typing, setTyping] = useState(false);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newHeight = e.clientY - 70; // 70px to account for the top margin
            setSummaryHeight(Math.max(100, newHeight)); // Ensure minimum height of 100px
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Attach and detach event listeners for mouse movement
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleToggleChange = () => {
        setResponseDepth(responseDepth === 'quick' ? 'detailed' : 'quick');
    };

    // Function to update stock data (summary and references)
    const setStockData = (data) => {
        setQuickSummary(data.quick_summary);
        setDetailedSummary(data.detailed_summary);
        setReferences(data.references);
    };

    // Send user message to backend
    const handleSendMessage = async (newMessage) => {
        if (!newMessage.trim()) return;

        setMessages([...messages, { sender: 'user', message: newMessage }]);
        setTyping(true);

        try {
            const response = await fetch('http://localhost:4000/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });

            const data = await response.json();

            // Append bot's response to the chat
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', message: data.response }
            ]);

            // Update the suggestions if provided
            if (data.followUpSuggestions) {
                setSuggestions(data.followUpSuggestions);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'bot', message: 'An error occurred while sending your message' }
            ]);
        } finally {
            setTyping(false);
        }
    };

    const handleSearch = async (searchTerm) => {
        try {
            const res = await fetch('http://localhost:4000/summary/stock-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stockName: searchTerm, response_depth: responseDepth }),
            });

            const data = await res.json();

            if (res.ok) {
                setStockData(data);
                setStockName(searchTerm);
            } else {
                alert('Stock not found.');
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
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
                    addFavourite={addFavourite}
                    removeFavourite={removeFavourite}
                    onSearch={handleSearch}
                />
            </div>
            <div className="content" style={{ paddingTop: '200px' }}>
                <div className="position-fixed" style={{ top: 0, left: '300px', width: 'calc(100% - 300px)', backgroundColor: 'white', zIndex: 1000 }}>
                    <h1 className="page-header ms-3 mt-3 mb-2 me-5 ps-4" style={{ marginRight: '62%' }}>Stock Analysis</h1>
                    <div className="toggle-title-container">
                        <div className="title-button-container">
                            <StockSummary
                                accordionOpen={accordionOpen}
                                setAccordionOpen={setAccordionOpen}
                                addFavourite={addFavourite}
                                removeFavourite={removeFavourite}
                                favouriteStocks={favouriteStocks}
                                summary={responseDepth === 'quick' ? quickSummary : detailedSummary}
                                references={references}
                                stockName={stockName}
                                responseDepth={responseDepth}
                                onToggleChange={handleToggleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Draggable Divider */}
                <div
                    className="divider"
                    ref={dividerRef}
                    onMouseDown={handleMouseDown}
                    style={{
                        height: '5px',
                        backgroundColor: 'blue',
                        cursor: 'ns-resize',
                        position: 'relative',
                        zIndex: 1000,
                    }}
                ></div>

                {/* Chatbot Section */}
                <div style={{ height: `calc(100vh - ${summaryHeight + 75}px)`, overflowY: 'auto' }}>
                    {!typing && (
                        <div className="content">
                            <QuestionSuggestions onQuestionClick={handleSuggestedQuestionClick} />
                        </div>
                    )}

                    <div style={{ marginBottom: '70px' }}>
                        {messages.map((msg, index) => (
                            <ChatBox key={index} message={msg.message} sender={msg.sender} senderName={msg.sender === 'user' ? 'You' : 'Gerry'} avatar={msg.sender === 'user' ? './images/UserProfile.jpg' : './images/GerryProfile.jpg'} />
                        ))}

                        {typing && (
                            <ChatBox
                                message={
                                    <div className="typing-indicator">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                }
                                sender="bot"
                                senderName="Gerry"
                                avatar="./images/GerryProfile.jpg"
                            />
                        )}

                        {!typing && suggestions.length > 0 && (
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
            </div>
        </div>
    );
}

export default StockAnalysis;