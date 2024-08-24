/***********************************************
 *  Author: Alyssha Kwok                       *                       
 *  Purpose: Deloitte Capstone E2 Project      *
 *  Date Created: 24/07/24                     *
 * ********************************************/

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import './index.css';
import NavbarComponent from './components/pages/NavbarComponent';
import About from './components/pages/About';
import SignIn from './components/pages/SignIn';
import Register from './components/pages/Register';
import UserQuestionaire from './components/pages/UserQuestionaire';
import StockAnalysis from './components/pages/StockAnalysis';
import NewsFeed from './components/pages/NewsFeed';
import Settings from './components/pages/Settings';

function App() {

  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
      <div>
        <NavbarComponent isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn setIsSignedIn={setIsSignedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/next" element={<UserQuestionaire />} />
          <Route path="/stock-analysis" element={<StockAnalysis />} />
          <Route path="/news-feed" element={<NewsFeed />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
  );
}

export default App;
