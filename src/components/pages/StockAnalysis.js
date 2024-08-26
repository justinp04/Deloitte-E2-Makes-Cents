/************************************************************************************************
 * Purpose: Stock Analysis Page
 * Fix: 
 *  - Need to update so that the latest chat is scrolled down to at the bottom
 *  - warning disclaimer, need to work on positioning when window size changes
 *  - when toggles open, it covers chat, need to figure out how to push content down
 *  - fix the blue line placement when the summary is opened
 ************************************************************************************************/
import React, { useState } from 'react';
import SASidebar from '../stockanalysis-components/SASidebar';
import ChatBox from '../stockanalysis-components/ChatBox';
import ToggleSwitch from '../ToggleSwitch';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';
import StockSummary from '../stockanalysis-components/StockSummary';

function StockAnalysis({ isSignedIn }) {
    const [messages, setMessages] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [favouriteStocks, setFavouriteStocks] = useState([]); // Manage favourite stocks

    const handleSendMessage = (newMessage) => {
        setMessages([...messages, { sender: 'user', message: newMessage }]);
    };

    const addFavourite = (companyTitle) => {
        if (!favouriteStocks.some(stock => stock.title === companyTitle)) {
            setFavouriteStocks(prevFavourites => [
                ...prevFavourites, 
                { id: favouriteStocks.length + 1, title: companyTitle, status: "Favourite" }
            ]);
        }
    };

    const removeFavourite = (companyTitle) => {
        setFavouriteStocks(prevFavourites =>
            prevFavourites.filter(stock => stock.title !== companyTitle)
        );
    };

    return (
        <div className="page-container">
            <div className="sidebar">
                <SASidebar 
                    favouriteStocks={favouriteStocks} 
                    addFavourite={addFavourite} 
                    removeFavourite={removeFavourite}
                />
            </div>

            <div className="content" style={{ paddingTop: '200px' }}>
                <div className="position-fixed" style={{ top: 0, left: '300px', top: '70px', width: 'calc(100% - 300px)', backgroundColor: 'white', zIndex: 1000 }}>
                    <h1 className="page-header ms-3 mt-3 mb-2 me-5 ps-4" style={{ marginRight: '62%' }}>Stock Analysis</h1>

                    <div className="toggle-title-container">
                        <div className="title-button-container">
                            <StockSummary
                                accordionOpen={accordionOpen}
                                setAccordionOpen={setAccordionOpen}
                                addFavourite={addFavourite}
                                removeFavourite={removeFavourite}
                                favouriteStocks={favouriteStocks} // Pass favourite stocks to check if already favourited
                            />
                        </div>
                    </div>
                    <div className="blue-line"></div>
                </div>

                <div style={{ marginTop: accordionOpen ? '10px' : '190px' }}>  
                    <ChatBox message="Howdy! 🤠" sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                    <ChatBox message="What is Bega Cheese Limited's revenue growth trend and profit margins, and how does it indicate stability and growth?" sender="user" senderName="You" avatar="./images/UserProfile.jpg" />
                    <ChatBox message="Bega Cheese Limited's financial performance in FY2023 showed both positive and negative aspects..." sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                </div>
                <div style={{ marginBottom: '70px' }}>
                    {messages.map((msg, index) => (
                        <ChatBox key={index} message={msg.message} sender={msg.sender} senderName={msg.sender === 'user' ? 'You' : 'Gerry'} avatar={msg.sender === 'user' ? './images/UserProfile.jpg' : './images/GerryProfile.jpg'} />
                    ))}
                    <QueryInputBar onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}
export default StockAnalysis;

