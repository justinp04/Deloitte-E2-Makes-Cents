/************************************************************************************************
 * Purpose: Query bar for user questions to chatbot
 * Fix: 
 ************************************************************************************************/
import React, { useState } from 'react';

import '../pages/StockAnalysis.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const QueryInputBar = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
  
    const handleInputChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleSend = () => {
      if (message.trim()) {
        onSendMessage(message);
        setMessage(''); // Clear the input after sending
      }
    };
  
    return (
      <div>
        <div className="query-input-bar">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Ask a query..."
            className="input-field"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
        <div className='d-flex warning'>
            <FontAwesomeIcon icon={faTriangleExclamation}/>
            <p>Makes Cents is not a financial advisor, investing is a risky venture and your actions are done at your own risk</p>
            <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>
      </div>
    );
  };
  
  export default QueryInputBar;