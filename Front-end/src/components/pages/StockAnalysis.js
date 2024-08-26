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
import ToggleList from '../ToggleList';
import FavoriteButton from '../stockanalysis-components/FavouriteButton';
import ChatBox from '../stockanalysis-components/ChatBox';
import ToggleSwitch from '../ToggleSwitch';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';
import StockSummary from '../stockanalysis-components/StockSummary';
import SummaryReferences from '../stockanalysis-components/SummaryReferences';

function StockAnalysis({ isSignedIn }) {
    const [isChecked, setChecked] = useState(true);
    const [messages, setMessages] = useState([]);

    // State to manage typing indicator
    const [typing, setTyping] = useState(false); 
    const chatEndRef = useRef(null);

    const handleChange = () => {
        setChecked(!isChecked);
    };

    // Send query here ~~
    const handleSendMessage = async (newMessage) => {

        if (!newMessage.trim()) {
            // Prevent sending empty messages
            return;
        }

        setMessages([...messages, { sender: 'user', message: newMessage }]);
        
        // Show typing indicator
        setTyping(true); 

        // Simulate a delay before sending the request to backend
        const simulateTyping = new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

        await simulateTyping; // Wait for the simulated typing delay


        try {
            const res = await fetch('http://localhost:4000/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
            });

            const data = await res.json();
            
            // Hide typing indicator when response is received
            setTyping(false); 
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: data.response }]);

        } catch (error) {
            console.error('Error:', error);

            // Hide typing indicator on error
            setTyping(false);
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: 'An error occurred while sending your message' }]);
        }
    };

    // Scroll to the latest message when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]); // Re-run effect when typing state changes

    return (
        <div className="page-container">
            <div className="sidebar">
                <SASidebar />
            </div>
            <div className="content" style={{ paddingTop: '200px' }}>
                <div className="position-fixed" style={{ top: 0, left: '300px', top: '70px', width: 'calc(100% - 300px)', backgroundColor: 'white', zIndex: 1000 }}>
                    <div className="ms-3 mt-3 mb-1 title-container">
                        <h1 className="page-header ms-3">Stock Analysis</h1>
                    </div>
                    <div className="toggle-title-container">
                        <div className="title-button-container">
                            {/* <StockSummary
                // <ToggleList 
                  title="BEGA CHEESE LIMITED (BGA)" 
                  items={["Recommendation 1", "Recommendation 2", "Recommendation 3"]}
                />
                <FavoriteButton />
                 */}
                            <SummaryReferences
                                title="References"
                                references={[
                                    { text: 'Bega Annual Report 2023', link: 'https://example.com/report' },
                                    { text: 'Industry Analysis', link: 'https://example.com/industry' }
                                ]}
                            />
                            {/* <ToggleSwitch
                  checked={isChecked}
                  onChange={handleChange}
                  id="detaildSummarySwitch"
                /> */}
                        </div>
                    </div>
                    {/* <StockSummary /> */}
                    <div className="blue-line"></div>
                </div>
                {/* Placeholder text for user-bot chat*/}
                <div style={{ marginTop: '50px' }}>
                    <ChatBox message="Howdy! 🤠" sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                    <ChatBox message="What is Bega Cheese Limited's revenue growth trend and profit margins, and how does it indicate stability and growth?" sender="user" senderName="You" avatar="./images/UserProfile.jpg" />
                    <ChatBox message="Bega Cheese Limited's financial performance in FY2023 showed both positive and negative aspects. The company's revenue grew by 12% to $3.4 billion, which is a good sign for potential investors. 
            However, the normalised EBITDA, which stands for Earnings Before Interest, Taxes, Depreciation, and Amortization, decreased by 11% to $160.2 million in the same period, which may raise some concerns about profitability 1 .  
            Despite the decrease in EBITDA, the company's branded segment demonstrated resilience by maintaining its #1 positions in various categories and growing volume despite cost pressures. This indicates stability and growth potential for the company 2 .  
            The company's commitment to strategic initiatives, such as managing the portfolio for growth in targeted segments, increasing supply chain competitiveness, and progressing sustainability objectives, also indicates stability and growth potential. 
            These initiatives can provide stability and growth potential for the company, which are favorable factors for potential investors .  In summary, while the revenue growth trend is positive, the decrease in EBITDA may raise some concerns. However, 
            the company's strategic initiatives and commitment to sustainable growth indicate stability and growth potential, which could positively impact your decision to invest in Bega Cheese Limited ." sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
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
                    {/* A reference div to keep the chat view scrolled to the latest message */}
                    <div ref={chatEndRef} />

                    <QueryInputBar onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}

export default StockAnalysis;
