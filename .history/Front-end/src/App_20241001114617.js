/***********************************************
 *  Author: Alyssha Kwok                       *                       
 *  Purpose: Deloitte Capstone E2 Project      *
 *  Date Created: 24/07/24                     *
 * ********************************************/

import React from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';

import NavbarComponent from './components/pages/NavbarComponent';
import About from './components/pages/About';
import UserQuestionaire from './components/pages/UserQuestionaire';
import StockAnalysis from './components/pages/StockAnalysis';
import NewsFeed from './components/pages/NewsFeed';
import Settings from './components/pages/Settings';

function App() 
{
  return (
		<div>
			<NavbarComponent />
			<Routes>
				<Route path="/" element={<About />} />
				<Route path="/about" element={<About />} />
				<Route path="/questionaire" element={<UserQuestionaire />} />
				<Route path="/stock-analysis" element={<StockAnalysis />} />
				<Route path="/news-feed" element={<NewsFeed />} />
				<Route path="/settings/*" element={<Settings />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</div>
  );
}
export default App;