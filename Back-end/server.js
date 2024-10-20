import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import UserQuestionnaires from './routes/UserQuestionnaires.js';
import StockAnalysisRoutes from './routes/StockAnalysis.js';
import StockSummary from './routes/StockSummary.js';
import NewsFeed from './routes/NewsFeed.js';
import FavouriteStocks from './routes/FavouriteStocks.js';
import StockSuggestions from './routes/StockSuggestions.js';
import CurrentInvestments from './routes/CurrentInvestmentsRoutes.js';

const port = process.env.PORT || 8080;
const app = express();

// Configure CORS middleware properly
const allowedOrigins = ['https://ashy-beach-0b9678500.5.azurestaticapps.net/news-feed'];

const corsOptions = {
  origin: '*', // For testing purpose
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
};



// Handle preflight requests
app.use(cors(corsOptions));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/next', UserQuestionnaires);
app.use('/chatbot', StockAnalysisRoutes);
app.use('/summary', StockSummary);
app.use('/news', NewsFeed);
app.use('/favorite-stocks', FavouriteStocks);
app.use('/', StockSuggestions);
app.use('/investment', CurrentInvestments);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));