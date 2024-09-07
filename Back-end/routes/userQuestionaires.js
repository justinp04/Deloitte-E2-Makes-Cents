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

// CREATE new user entries
router.post('/register', async (req, res) => {
    const {
        email,
        question_response_1,
        question_response_2,
        question_response_3,
        question_response_4,
        question_response_5,
        question_response_6
    } = req.body;

    // Check if all required fields are present
    if (!email || question_response_1 < 1 || question_response_3 < 1 || question_response_4 < 1 || question_response_5 < 1 || question_response_6 < 1) {
        return res.status(400).json({ error: 'All fields are required and must have valid values' });
    }

    try {
        const pool = await sql.connect(sqlConfig);

        // Check if email already exists
        const emailCheckResult = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT COUNT(*) as count FROM Users WHERE email = @Email');

        const emailExists = emailCheckResult.recordset[0].count > 0;

        // If email exists, return an error message
        if (emailExists) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email or log in.' });
        }

        // If email does not exist, proceed to insert the user
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .input('Response1', sql.TinyInt, question_response_1)
            .input('Response2', sql.TinyInt, question_response_2)
            .input('Response3', sql.TinyInt, question_response_3)
            .input('Response4', sql.TinyInt, question_response_4)
            .input('Response5', sql.TinyInt, question_response_5)
            .input('Response6', sql.TinyInt, question_response_6)
            .query(`
                INSERT INTO Users (email, question_response_1, question_response_2, question_response_3, question_response_4, question_response_5, question_response_6)
                VALUES (@Email, @Response1, @Response2, @Response3, @Response4, @Response5, @Response6)
            `);

        // If insertion is successful, send a success response
        if (result.rowsAffected[0] > 0) {
            res.status(201).json({ message: 'User data successfully inserted' });
        } else {
            res.status(500).json({ error: 'Failed to insert data into database' });
        }
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Failed to insert data into database' });
    }
});

// READ user responses
router.get('/user-responses', async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query(`
                SELECT question_response_1, question_response_2, question_response_3, question_response_4, question_response_5, question_response_6 
                FROM Users 
                WHERE email = @Email
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.recordset[0];
        const responseString = `${user.question_response_1}${user.question_response_2}${user.question_response_3}${user.question_response_4}${user.question_response_5}${user.question_response_6}`;

        res.status(200).json({ response: responseString });
    } catch (err) {
        console.error('Error fetching user responses:', err);
        res.status(500).json({ error: 'Failed to retrieve user responses' });
    }
});

// UPDATE user responses
router.put('/update-responses', async (req, res) => {
    const {
        email,
        question_response_1,
        question_response_2,
        question_response_3,
        question_response_4,
        question_response_5,
        question_response_6
    } = req.body;

    // Check if all required fields are present
    if (!email || question_response_1 < 1 || question_response_2 < 1 || question_response_3 < 1 || question_response_4 < 1 || question_response_5 < 1 || question_response_6 < 1) {
        return res.status(400).json({ error: 'All fields are required and must have valid values' });
    }

    try {
        const pool = await sql.connect(sqlConfig);

        // Check if user exists
        const emailCheckResult = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT COUNT(*) as count FROM Users WHERE email = @Email');

        const emailExists = emailCheckResult.recordset[0].count > 0;

        if (!emailExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user responses
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .input('Response1', sql.TinyInt, question_response_1)
            .input('Response2', sql.TinyInt, question_response_2)
            .input('Response3', sql.TinyInt, question_response_3)
            .input('Response4', sql.TinyInt, question_response_4)
            .input('Response5', sql.TinyInt, question_response_5)
            .input('Response6', sql.TinyInt, question_response_6)
            .query(`
                UPDATE Users 
                SET question_response_1 = @Response1, question_response_2 = @Response2, question_response_3 = @Response3, question_response_4 = @Response4, question_response_5 = @Response5, question_response_6 = @Response6
                WHERE email = @Email
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'User data successfully updated' });
        } else {
            res.status(500).json({ error: 'Failed to update user data' });
        }
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).json({ error: 'Failed to update user data' });
    }
});

// DELETE users
router.delete('/delete-user', async (req, res) => {
    const email = req.query.email; // Assume email is passed as a query parameter

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);

        // Check if user exists
        const emailCheckResult = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT COUNT(*) as count FROM Users WHERE email = @Email');

        const emailExists = emailCheckResult.recordset[0].count > 0;

        if (!emailExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('DELETE FROM Users WHERE email = @Email');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'User successfully deleted' });
        } else {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});




// Endpoint to check if a user already exists
router.get('/check-user', async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT COUNT(*) as count FROM Users WHERE email = @Email');

        const userExists = result.recordset[0].count > 0;

        if (userExists) {
            res.status(200).json({ message: 'User exists' });
        } else {
            res.status(404).json({ message: 'User does not exist' });
        }
    } catch (err) {
        console.error('Error checking user existence:', err);
        res.status(500).json({ error: 'Failed to check user existence' });
    }
});




export default router;