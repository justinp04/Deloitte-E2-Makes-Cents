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
import LoadingAnimation from './LoadingAnimation.css';
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
    const [loading, setLoading] = useState(false); // State to manage loading


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
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'User Email Not Found',
                text: 'Please ensure you are logged in before searching for stocks.',
            });
            return;
        }

        setLoading(true);
    
        try {
            // Set the stock name in the state (this can be used for UI display purposes)
            setStockName(searchTerm);
            console.log("Stock name set to:", searchTerm);
    
            // Use the searchTerm directly in the fetch request to ensure we have the latest value
            const res = await fetch('http://localhost:4000/summary/stock-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stockName: searchTerm, user_email: email, response_depth: responseDepth })
            });
    
            const data = await res.json();
    
            if (res.ok) {
                // Update the summary and references state with the fetched data
                setStockData(data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Stock Not Found',
                    text: `The stock "${searchTerm}" could not be found. Please check the stock name and try again.`,
                });
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        } finally {
            setLoading(false);
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
            
        </div>
    );
}

export default StockAnalysis;
