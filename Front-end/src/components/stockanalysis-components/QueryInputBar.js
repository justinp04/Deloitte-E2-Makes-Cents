/************************************************************************************************
 * Purpose: Query bar for user questions to chatbot
 * Fix: 
 ************************************************************************************************/
import React, { useState } from 'react';

import '../pages/StockAnalysis.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const QueryInputBar = ({ onSendMessage }) => {
	const [message, setMessage] = useState('');

	const handleInputChange = (e) => {
		setMessage(e.target.value);
	};

	// When user requests to send message
	const handleSend = () => {
		if (message.trim()) {
		onSendMessage(message);
		setMessage(''); // Clear the input after sending
		}
	};

	// When enter/return key is clicked, message is sent
	const handleEnterKey = (e) => {
		if (e.key === 'Enter') {
		handleSend();
		}
	};

	return (
		<div>
			<div className="query-input-bar">
				<input
				type="text"
				value={message}
				onChange={handleInputChange}
				onKeyDown={handleEnterKey}
				placeholder="Ask Gerry a question!"
				className="input-field px-4"
				/>
				<button onClick={handleSend} className="send-button">
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</div>
			<div className='d-flex warning'>
				<FontAwesomeIcon icon={faTriangleExclamation} />
				<p>Makes Cents is not a financial advisor, investing is a risky venture and your actions are done at your own risk</p>
				<FontAwesomeIcon icon={faTriangleExclamation} />
			</div>
		</div>
	);
};

export default QueryInputBar;