/************************************************************************************************
 * Purpose: Stock Analysis Page
 * Fix: 
 *  - Need to update so that the latest chat is scrolled down to at the bottom
 *  - warning disclaimer, need to work on positioning when window size changes
 *  - when toggles open, it covers chat, need to figure out how to push content down
 *  - fix the blue line placement when the summary is opened
 ************************************************************************************************/

import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SASidebar from '../stockanalysis-components/SASidebar';
import StockSummary from '../stockanalysis-components/StockSummary';
import ChatBox from '../stockanalysis-components/ChatBox';
import QueryInputBar from '../stockanalysis-components/QueryInputBar';
import QuestionSuggestions from '../stockanalysis-components/QuestionSuggestions';
import { useMsal } from '@azure/msal-react';
import Swal from 'sweetalert2';


function StockAnalysis() {
    const [messages, setMessages] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState(false); // State to control whether an accordion (presumably in the UI) is open or closed
    const [favouriteStocks, setFavouriteStocks] = useState([]); // State to manage the list of favourite stocks
    const [quickSummary, setQuickSummary] = useState('');
    const [detailedSummary, setDetailedSummary] = useState('')
    const [references, setReferences] = useState([]); // State for references array
    const [responseDepth, setResponseDepth] = useState('quick');
    const [stockName, setStockName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Tracks if the sidebar is open or closed

    // State to manage typing indicator
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Get current login user
    const { accounts } = useMsal();
    const [email, setEmail] = useState('');

    // Fetch email from logged-in user's account information
    useEffect(() => {
        if (accounts.length > 0) {
            const user_email = accounts[0].username;  // Fetch user's email
            setEmail(user_email);
        }
    }, [accounts]);

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

        setSuggestions([]); 
        setMessages([...messages, { sender: 'user', message: newMessage }]);
        setTyping(true);

        try {
            const response = await fetch('http://localhost:4000/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage, stockName: stockName })
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
        // Make sure email is loaded before attempting a search
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'User Email Not Found',
                text: 'Please ensure you are logged in before searching for stocks.',
            });
            return;
        }
        try {

            setStockName(searchTerm);
            console.log("Stock name set to:", searchTerm);
            
            // Fetch stock summary from the backend
            const res = await fetch('http://localhost:4000/summary/stock-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stockName, user_email: email, response_depth: responseDepth })
            });

            const data = await res.json();

            if (res.ok) {
                // Update the summary and references state with the fetched data
                setStockData(data);
                setStockName(searchTerm); // Update the stockName state for display purposes
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Stock Not Found',
                    text: `The stock "${searchTerm}" could not be found. Please check the stock name and try again.`,
                });
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    const handleSuggestedQuestionClick = (question) => {
        handleSendMessage(question);
    };

    const addFavourite = (companyTitle) => {

        if (companyTitle === "Unknown") {
            console.log("Not a valid stock. Cannot add to favorites.");
            return; // Prevent adding if the stock name is "Unknown"
        }

        // Check if the stock already exists
        if (!favouriteStocks.some(stock => stock.title === companyTitle)) {
            const newFavourite = { id: favouriteStocks.length + 1, title: companyTitle, status: "Favourite" };
            setFavouriteStocks(prevFavourites => [...prevFavourites, newFavourite]);
            addFavouritetoDatabase(companyTitle); // Call function to add to database
        } else {
            // If the stock already exists in local state, show a warning using Swal
            Swal.fire({
                icon: 'warning',
                title: 'Duplicate Stock',
                text: 'This stock is already in your favourites.',
            });
        }
    };    

    const removeFavourite = async (companyTitle) => {
        // Remove from local state
        setFavouriteStocks(prevFavourites => prevFavourites.filter(stock => stock.title !== companyTitle));
    
        // Now call the database function to remove
        await removeFavouriteFromDatabase(companyTitle);
    };

    // Function to add a stock to the list of favourites
    const addFavouritetoDatabase = async (companyTitle) => {
        try {
            const userIdResponse = await fetch(`http://localhost:4000/favorite-stocks/get-userid?email=${email}`);
            const userIdData = await userIdResponse.json();
            const userId = userIdData.userId;

            const response = await fetch('http://localhost:4000/favorite-stocks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    stockSymbol: companyTitle,
                }),
            });
            
            if (response.status === 409) {
                // If the stock already exists in the database, show a pop-up alert
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Stock',
                    text: 'This stock is already in your favourites.',
                });
            } else if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `${companyTitle} has been added to your favourites.`,
                });
            } else {
                throw new Error('Failed to add the stock to your favourites.');
            }
        } catch (error) {
            console.error('Error adding favourite stock:', error);
            alert("Error occurred while adding favourite stock.");
        }
    };

    const removeFavouriteFromDatabase = async (companyTitle) => {
        try {
            const userIdResponse = await fetch(`http://localhost:4000/favorite-stocks/get-userid?email=${email}`);
            const userIdData = await userIdResponse.json();
            const userId = userIdData.userId;
    
            const response = await fetch('http://localhost:4000/favorite-stocks/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    stockSymbol: companyTitle,
                }),
            });
    
            if (response.ok) {
                setFavouriteStocks(prevFavourites =>
                    prevFavourites.filter(stock => stock.title !== companyTitle)
                );
            } else {
                alert("Failed to remove favourite stock.");
            }
        } catch (error) {
            console.error('Error removing favourite stock:', error);
            alert("Error occurred while removing favourite stock.");
        }
    };    

    // Scroll to the latest message when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]); // Re-run effect when typing state changes

    // Toggle sidebar open/close state
    const toggleSidebar = (isOpen) => {
        setSidebarOpen(isOpen);
    };

    return (
        <div className="page-container">
            {/* Sidebar */}
            <div className="mt80" style={{ zIndex: 1000 }}>
                <SASidebar
                    favouriteStocks={favouriteStocks}
                    addFavourite={addFavourite}
                    addFavouriteToDatabase={addFavouritetoDatabase}
                    removeFavourite={removeFavourite}
                    onSearch={handleSearch}
                    email={email}
                    toggleSidebar={toggleSidebar}
                />
            </div>
            <div className="content content-margining pt-0" style={{marginTop:"80px"}}>
                <StockSummary
                    accordionOpen={accordionOpen}
                    setAccordionOpen={setAccordionOpen}
                    addFavourite={addFavourite}
                    removeFavourite={removeFavourite}
                    favouriteStocks={favouriteStocks}
                    summary={responseDepth === 'quick' ? quickSummary : detailedSummary}
                    references={references}
                    stockName={stockName}
                    email={email || null}
                    responseDepth={responseDepth}
                    onToggleChange={handleToggleChange}
                />
                <div id="chatbox-area-div" className="scroll-container">
                      {/* Chat Messages */}
                    {/* need to chnage the positioning for this, styling for this is temp */}
                    <div className="content">
                        <QuestionSuggestions onQuestionClick={handleSuggestedQuestionClick} />
                    </div>
                    {/* Placeholder text for user-bot chat*/}
                    {/* <div style={{ marginTop: accordionOpen ? '10px' : '30px' }}>  
                        <ChatBox message="Howdy! 🤠" sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                        <ChatBox message="What is Bega Cheese Limited's revenue growth trend and profit margins, and how does it indicate stability and growth?" sender="user" senderName="You" avatar="./images/UserProfile.jpg" />
                        <ChatBox message="Bega Cheese Limited's financial performance in FY2023 showed both positive and negative aspects. The company's revenue grew by 12% to $3.4 billion, which is a good sign for potential investors. 
                        However, the normalised EBITDA, which stands for Earnings Before Interest, Taxes, Depreciation, and Amortization, decreased by 11% to $160.2 million in the same period, which may raise some concerns about profitability 1 .  
                        Despite the decrease in EBITDA, the company's branded segment demonstrated resilience by maintaining its #1 positions in various categories and growing volume despite cost pressures. This indicates stability and growth potential for the company 2 .  
                        The company's commitment to strategic initiatives, such as managing the portfolio for growth in targeted segments, increasing supply chain competitiveness, and progressing sustainability objectives, also indicates stability and growth potential. 
                        These initiatives can provide stability and growth potential for the company, which are favorable factors for potential investors .  In summary, while the revenue growth trend is positive, the decrease in EBITDA may raise some concerns. However, 
                        the company's strategic initiatives and commitment to sustainable growth indicate stability and growth potential, which could positively impact your decision to invest in Bega Cheese Limited ." sender="bot" senderName="Gerry" avatar="./images/GerryProfile.jpg" />
                    </div> */}
                    {/* Chat Messages */}
                    {/* need to chnage the positioning for this, styling for this is temp */}
                    {/* <div className="content" style={{ marginTop: "100px" }}>
                        <QuestionSuggestions onQuestionClick={handleSuggestedQuestionClick} />
                    </div> */}

                    {/* Chat Messages */}
                    <div style={{ marginTop: accordionOpen ? '10px' : '10px', paddingBottom: '120px' }}>
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
                    </div>
                </div>
                <Container className="query-bar-container">
                    <QueryInputBar onSendMessage={handleSendMessage} />
                </Container>
            </div>
        </div>
    );
}

export default StockAnalysis;
