import express from 'express';
import mysql from 'mysql2';
const router = express.Router();


// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'StockGenAI' // Replace with your MySQL database name
});


db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Define the registration endpoint
router.post('/register', (req, res) => {
    console.log(req.body);

    const {
        question_response_1,
        question_response_2,
        question_response_3,
        question_response_4,
        question_response_5,
        question_response_6
    } = req.body;

    if (!question_response_1 || !question_response_2 || !question_response_3 || !question_response_4 || !question_response_5 || !question_response_6) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('question_response_1:', question_response_1);

    // SQL query to insert user responses into the UserQuestionaires table
    const query = `
        INSERT INTO UserQuestionaires (question_response_1, question_response_2, question_response_3, question_response_4, question_response_5, question_response_6)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(query, [
        question_response_1,
        question_response_2,
        question_response_3,
        question_response_4,
        question_response_5,
        question_response_6
    ], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Failed to insert data into database' });
            return;
        }
        res.status(201).json({ message: 'User data successfully inserted' });
    });
});

export default router;