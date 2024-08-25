import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import posts from './routes/posts.js';
import UserQuestionaires from './routes/userQuestionaires.js';

const port = process.env.PORT || 4000;
const app = express();


// Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/next', UserQuestionaires);

app.listen(port, () => console.log(`Server is running on port ${port}`));