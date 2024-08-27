import express from 'express';
import sql from 'mssql'

const router = express.Router();


const sqlConfig = {
    user: 'gamer237',
    password: 'GamerBoy123!',
    server: 'make-cents-server.database.windows.net',
    database: 'make_cents_db',
    options: {
        encrypt: true,
        enableArithAbort: true,
    },
};


sql.connect(sqlConfig)
    .then(() => {
        console.log('Connected to the SQL Server database.');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });

// Define the registration endpoint
router.post('/register', async (req, res) => {
    console.log(req.body);

    const {
        email,
        question_response_1,
        question_response_2,
        question_response_3,
        question_response_4,
        question_response_5,
        question_response_6
    } = req.body;

    if (!email | !question_response_1 || !question_response_2 || !question_response_3 || !question_response_4 || !question_response_5 || !question_response_6) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('question_response_1:', question_response_1);

    try {
        // SQL query to insert user data into the Users table
        const query = `
            INSERT INTO Users (email, question_response_1, question_response_2, question_response_3, question_response_4, question_response_5, question_response_6)
            VALUES (@Email, @Response1, @Response2, @Response3, @Response4, @Response5, @Response6)
        `;

        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('Email', sql.VarChar, email)
            .input('Response1', sql.TinyInt, question_response_1)
            .input('Response2', sql.TinyInt, question_response_2)
            .input('Response3', sql.TinyInt, question_response_3)
            .input('Response4', sql.TinyInt, question_response_4)
            .input('Response5', sql.TinyInt, question_response_5)
            .input('Response6', sql.TinyInt, question_response_6)
            .query(query);
        console.log('Database operation successful:', result);
        res.status(201).json({ message: 'User data successfully inserted' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Failed to insert data into database' });
    }
});

export default router;