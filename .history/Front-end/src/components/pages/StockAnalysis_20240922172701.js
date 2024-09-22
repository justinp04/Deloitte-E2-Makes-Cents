/************************************************************************************************
 * Purpose: Stock Analysis Page
 * Fix: 
 *  - Need to update so that the latest chat is scrolled down to at the bottom
 *  - warning disclaimer, need to work on positioning when window size changes
 *  - when toggles open, it covers chat, need to figure out how to push content down
 *  - fix the blue line placement when the summary is opened
 ************************************************************************************************/

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
    const [accordionOpen, setAccordionOpen] = useState(false); // State to control whether an accordion (presumably in the UI) is open or closed
    const [favouriteStocks, setFavouriteStocks] = useState([]); // State to manage the list of favourite stocks

    const [quickSummary, setQuickSummary] = useState('');
    const [detailedSummary, setDetailedSummary] = useState('')
    const [references, setReferences] = useState([]); // State for references array
    const [responseDepth, setResponseDepth] = useState('quick');
    const [stockName, setStockName] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [summaryHeight, setSummaryHeight] = useState(300);
    const [isDragging, setIsDragging] = useState(false);

    // State to manage typing indicator
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);
    const dividerRef = useRef(null);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newHeight = e.clientY - 70; // 70px to account for the top margin
            setSummaryHeight(Math.max(100, newHeight)); // Set a minimum height of 100px for the summary
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

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
        setResponseDepth(responseDepth === 'quick' ? 'detailed' : 'quick'); // Toggle between quick and detailed
    };

    // Function to update stock data (summary and references)
    const setStockData = (data) => {
        setQuickSummary(data.quick_summary);
        setDetailedSummary(data.detailed_summary);
        setReferences(data.references); // Update references state
    };

    // Send query here ~~
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

    // Function to handle stock search and update summary/references
    const handleSearch = async (searchTerm) => {
        try {
            // Fetch stock summary from the backend
            const res = await fetch('http://localhost:4000/summary/stock-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stockName: searchTerm, response_depth: responseDepth }),
            });

            const data = await res.json();

            if (res.ok) {
                // Update the summary and references state with the fetched data
                setStockData(data);
                setStockName(searchTerm); // Update the stockName state for display purposes
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



    // Function to add a stock to the list of favourites
    const addFavourite = (companyTitle) => {
        // Check if the stock is already in the favourites list
        if (!favouriteStocks.some(stock => stock.title === companyTitle)) {
            // If not, add it to the list by updating the state
            // Uses the previous state (prevFavourites) to add the new favourite to the list
            setFavouriteStocks(prevFavourites => [
                ...prevFavourites,
                { id: favouriteStocks.length + 1, title: companyTitle, status: "Favourite" }
            ]);
        }
    };

    // Function to remove a stock from the list of favourites
    const removeFavourite = (companyTitle) => {
        // Filters out the stock that matches the companyTitle from the favourites list
        // Updates the state with the new list of favourites that no longer includes the removed stock
        setFavouriteStocks(prevFavourites =>
            prevFavourites.filter(stock => stock.title !== companyTitle)
        );
    };

    // Scroll to the latest message when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]); // Re-run effect when typing state changes

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
                <div style={{ height: `${summaryHeight}px`, overflow: 'auto' }}>
                    <h1 className="page-header ms-3 mt-3 mb-2 me-5 ps-4" style={{ marginRight: '62%' }}>Stock Analysis</h1>
                    <div className="toggle-title-container">
                        <div className="title-button-container">
                            <StockSummary
                                accordionOpen={accordionOpen}
                                setAccordionOpen={setAccordionOpen}
                                addFavourite={addFavourite}
                                removeFavourite={removeFavourite}
                                favouriteStocks={favouriteStocks} // Pass favourite stocks to check if already favourited
                                summary={responseDepth === 'quick' ? quickSummary : detailedSummary} // Pass summary as prop
                                references={references} // Pass references as prop
                                stockName={stockName}
                                responseDepth={responseDepth}
                                onToggleChange={handleToggleChange}
                            />
                        </div>
                    </div>
                    {/* Draggable Divider */}
                    <div
                        className="divider"
                        onMouseDown={handleMouseDown}
                    ></div>
                </div>
                {/* Placeholder text for user-bot chat*/}
                {/* <div style={{ marginTop: accordionOpen ? '10px' : '190px' }}>  
                    <ChatBox message="Howdy! 🤠" sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                    <ChatBox message="What is Bega Cheese Limited's revenue growth trend and profit margins, and how does it indicate stability and growth?" sender="user" senderName="You" avatar="./images/UserProfile.jpg" />
                    <ChatBox message="Bega Cheese Limited's financial performance in FY2023 showed both positive and negative aspects. The company's revenue grew by 12% to $3.4 billion, which is a good sign for potential investors. 
                    However, the normalised EBITDA, which stands for Earnings Before Interest, Taxes, Depreciation, and Amortization, decreased by 11% to $160.2 million in the same period, which may raise some concerns about profitability 1 .  
                    Despite the decrease in EBITDA, the company's branded segment demonstrated resilience by maintaining its #1 positions in various categories and growing volume despite cost pressures. This indicates stability and growth potential for the company 2 .  
                    The company's commitment to strategic initiatives, such as managing the portfolio for growth in targeted segments, increasing supply chain competitiveness, and progressing sustainability objectives, also indicates stability and growth potential. 
                    These initiatives can provide stability and growth potential for the company, which are favorable factors for potential investors .  In summary, while the revenue growth trend is positive, the decrease in EBITDA may raise some concerns. However, 
                    the company's strategic initiatives and commitment to sustainable growth indicate stability and growth potential, which could positively impact your decision to invest in Bega Cheese Limited ." sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                </div> */}

                <div className="content">
                    <QuestionSuggestions onQuestionClick={handleSuggestedQuestionClick} />
                </div>

                {/* Div for user input */}
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
                    {/* A reference div to keep the chat view scrolled to the latest message */}
                    <div ref={chatEndRef} />

                    <QueryInputBar onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}

export default StockAnalysis;
