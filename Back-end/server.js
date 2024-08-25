import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import posts from './routes/posts.js';
import UserQuestionaires from './routes/userQuestionaires.js';
import stockAnalysisRoutes from './routes/StockAnalysis.js';

const port = process.env.PORT || 4000;
const app = express();


// Body parser middleware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/next', UserQuestionaires);
app.use('/chatbot', stockAnalysisRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));