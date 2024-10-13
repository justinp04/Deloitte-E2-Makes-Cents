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

const port = process.env.PORT || 8080;
const app = express();

// Configure CORS middleware properly
const allowedOrigins = ['https://gray-water-0d8d28700.5.azurestaticapps.net'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow the request
        } else {
            callback(new Error('CORS policy error: Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow cookies or authentication headers
}));

// Handle preflight requests
app.options('*', cors()); 

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

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));