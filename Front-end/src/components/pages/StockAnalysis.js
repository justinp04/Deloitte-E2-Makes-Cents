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
import StockSummary from '../stockanalysis-components/StockSummary';
import ChatBox from '../stockanalysis-components/ChatBox';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';

function StockAnalysis({ isSignedIn }) {
    const [messages, setMessages] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [favouriteStocks, setFavouriteStocks] = useState([]);
    const [quickSummary, setQuickSummary] = useState('');
    const [detailedSummary, setDetailedSummary] = useState('');
    const [references, setReferences] = useState([]);
    const [responseDepth, setResponseDepth] = useState('quick');
    const [stockName, setStockName] = useState('');
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Tracks if the sidebar is open or closed

    const handleToggleChange = () => {
        setResponseDepth(responseDepth === 'quick' ? 'detailed' : 'quick');
    };

    const setStockData = (data) => {
        setQuickSummary(data.quick_summary);
        setDetailedSummary(data.detailed_summary);
        setReferences(data.references);
    };

    const handleSendMessage = async (newMessage) => {
        if (!newMessage.trim()) {
            return;
        }
    
        setMessages([...messages, { sender: 'user', message: newMessage }]);
        setTyping(true);
    
        try {
            const chatResponse = await fetch('http://localhost:4000/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });

            const chatData = await chatResponse.json();

            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', message: chatData.response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', message: 'An error occurred while sending your message' },
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

    const addFavourite = (companyTitle) => {
        if (!favouriteStocks.some((stock) => stock.title === companyTitle)) {
            setFavouriteStocks((prevFavourites) => [
                ...prevFavourites,
                { id: favouriteStocks.length + 1, title: companyTitle, status: 'Favourite' },
            ]);
        }
    };

    const removeFavourite = (companyTitle) => {
        setFavouriteStocks((prevFavourites) =>
            prevFavourites.filter((stock) => stock.title !== companyTitle)
        );
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    // Toggle sidebar open/close state
    const toggleSidebar = (isOpen) => {
        setSidebarOpen(isOpen);
    };

    return (
        <div className={`page-container me-3 ${sidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Sidebar */}
            
            <SASidebar
                    favouriteStocks={favouriteStocks}
                    addFavourite={addFavourite}
                    removeFavourite={removeFavourite}
                    onSearch={handleSearch}
                    toggleSidebar={toggleSidebar} // Pass toggle function to the sidebar
                />

            {/* Main Content */}
            <div className={`content ${sidebarOpen ? 'shift-content' : ''}`}  >
                <div
                    className="position-sticky"
                    style={{ top: '0', width: '100%', backgroundColor: 'white', zIndex: 1000 }}
                >
                    <h1 className="page-header ms-4 mb-2 me-5" style={{ marginRight: '62%'}}>INVESTMENT INSIGHT</h1>
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
                     <hr className='blue-line' />
                </div>
                   {/* Placeholder text for user-bot chat*/}
                   <div style={{ marginTop: accordionOpen ? '50px' : '50px' }}>  
                    <ChatBox message="Howdy! 🤠" sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                    <ChatBox message="What is Bega Cheese Limited's revenue growth trend and profit margins, and how does it indicate stability and growth?" sender="user" senderName="You" avatar="./images/UserProfile.jpg" />
                    <ChatBox message="Bega Cheese Limited's financial performance in FY2023 showed both positive and negative aspects. The company's revenue grew by 12% to $3.4 billion, which is a good sign for potential investors. 
                    However, the normalised EBITDA, which stands for Earnings Before Interest, Taxes, Depreciation, and Amortization, decreased by 11% to $160.2 million in the same period, which may raise some concerns about profitability 1 .  
                    Despite the decrease in EBITDA, the company's branded segment demonstrated resilience by maintaining its #1 positions in various categories and growing volume despite cost pressures. This indicates stability and growth potential for the company 2 .  
                    The company's commitment to strategic initiatives, such as managing the portfolio for growth in targeted segments, increasing supply chain competitiveness, and progressing sustainability objectives, also indicates stability and growth potential. 
                    These initiatives can provide stability and growth potential for the company, which are favorable factors for potential investors .  In summary, while the revenue growth trend is positive, the decrease in EBITDA may raise some concerns. However, 
                    the company's strategic initiatives and commitment to sustainable growth indicate stability and growth potential, which could positively impact your decision to invest in Bega Cheese Limited ." sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                </div>
                {/* Chat Messages */}
                <div style={{ marginTop: accordionOpen ? '10px' : '10px', paddingBottom:'120px' }}>
                    {messages.map((msg, index) => (
                        <ChatBox
                            key={index}
                            message={msg.message}
                            sender={msg.sender}
                            senderName={msg.sender === 'user' ? 'You' : 'Gerry'}
                            avatar={msg.sender === 'user' ? './images/UserProfile.jpg' : './images/GerryProfile.jpg'}
                        />
                    ))}
                    {typing && (
                        <ChatBox
                            message={<div className="typing-indicator"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>}
                            sender="bot"
                            senderName="Gerry"
                            avatar="./images/GerryProfile.jpg"
                        />
                    )}
                    <div ref={chatEndRef} />
                </div>
                    <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000, backgroundColor: 'white' }}>
                        <QueryInputBar onSendMessage={handleSendMessage} />
                    </div>
            </div>
        </div>
    );
}

export default StockAnalysis;
