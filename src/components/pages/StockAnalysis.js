/************************************************************************************************
 * Purpose: Stock Analysis Page
 * Fix: Added Tutorial button to activate TutorialOverlay
 ************************************************************************************************/
import React, { useState } from 'react';
import SASidebar from '../stockanalysis-components/SASidebar';
import ChatBox from '../stockanalysis-components/ChatBox';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';
import StockSummary from '../stockanalysis-components/StockSummary';
import TutorialOverlay from '../stockanalysis-components/TutorialOverlay';

function StockAnalysis() {
    const [messages, setMessages] = useState([]); // State to hold the list of messages exchanged in the application
    const [accordionOpen, setAccordionOpen] = useState(false); // State to control whether an accordion (presumably in the UI) is open or closed
    const [favouriteStocks, setFavouriteStocks] = useState([]); // State to manage the list of favourite stocks

    const [tutorialActive, setTutorialActive] = useState(false); // State to handle tutorial activation
    const [tutorialStep, setTutorialStep] = useState(1); // State to track the current tutorial step

    // Function to handle sending a new message
    const handleSendMessage = (newMessage) => {
        // Adds the new message to the list of messages. Each message object includes a sender and the message content.
        setMessages([...messages, { sender: 'user', message: newMessage }]);
    };

    // Function to add a stock to the list of favourites
    const addFavourite = (companyTitle) => {
        if (!favouriteStocks.some(stock => stock.title === companyTitle)) {
            setFavouriteStocks(prevFavourites => [
                ...prevFavourites, 
                { id: favouriteStocks.length + 1, title: companyTitle, status: "Favourite" }
            ]);
        }
    };

    // Function to remove a stock from the list of favourites
    const removeFavourite = (companyTitle) => {
        setFavouriteStocks(prevFavourites =>
            prevFavourites.filter(stock => stock.title !== companyTitle)
        );
    };

    // Function to handle moving to the next tutorial step
    const handleNextTutorialStep = () => {
        if (tutorialStep < 3) { // Assuming there are 3 steps in the tutorial
            setTutorialStep(tutorialStep + 1);
        } else {
            setTutorialActive(false); // End the tutorial after the last step
        }
    };

    // Function to close the tutorial
    const handleCloseTutorial = () => {
        setTutorialActive(false);
    };

    return (
        <div className="page-container">
            <div className="sa-sidebar">
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

                {/* Button to start the tutorial */}
                <button 
                    onClick={() => setTutorialActive(true)} 
                    style={{ position: 'absolute', top: '120px', right: '50px', zIndex: 1500 }}
                >
                    Start Tutorial
                </button>

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

            {/* Conditionally render the TutorialOverlay when the tutorial is active */}
            {tutorialActive && (
                <TutorialOverlay 
                    step={tutorialStep} 
                    onNext={handleNextTutorialStep} 
                    onClose={handleCloseTutorial} 
                />
            )}
        </div>
    );
}
export default StockAnalysis;
