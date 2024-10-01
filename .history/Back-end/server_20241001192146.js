
/************************************************************************************************
 * Author: Anna Duong
 * Purpose: Endpoint registration
 ************************************************************************************************/

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import UserQuestionaires from './routes/UserQuestionnaires.js';
import StockAnalysisRoutes from './routes/StockAnalysis.js';
import StockSummary from './routes/StockSummary.js'
import NewsFeed from './routes/NewsFeed.js'
import FavouriteStocks from './routes/FavouriteStocks.js';
import StockSuggestions from './routes/StockSuggestions.js';

const port = process.env.PORT || 4000;
const app = express();


// Body parser middleware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/next', UserQuestionaires);
app.use('/chatbot', StockAnalysisRoutes);
app.use('/summary', StockSummary);
app.use('/news', NewsFeed);
app.use('/favorite-stocks', FavouriteStocks);
app.use('/', StockSuggestions);

app.listen(port, () => console.log(`Server is running on port ${port}`));