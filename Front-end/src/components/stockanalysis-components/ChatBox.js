/************************************************************************************************
 * Purpose: chat box for each message sent buy either the user(You) or the bot(Gerry)
 * Fix: 
 ************************************************************************************************/
import React from 'react';

import '../pages/StockAnalysis.css';

function ChatBox({ message, sender, avatar, senderName }) {
    return (
        <div className={`chat-box ${sender === 'user' ? 'user' : 'bot'}`}>
            {sender === 'bot' && <img src={avatar} alt={`${senderName} avatar`} className="avatar" />}
            <div className="message-container">
                <span className="sender-name">{senderName}</span>
                <div className="message-card">
                    <p className="chat-message">{message}</p>
                </div>
            </div>
            {sender === 'user' && <img src={avatar} alt={`${senderName} avatar`} className="avatar" />}
        </div>
    );
}
export default ChatBox;
