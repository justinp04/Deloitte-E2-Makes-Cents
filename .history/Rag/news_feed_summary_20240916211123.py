import mysql.connector
import requests
from openai import OpenAI
from prompt_engineering import chatbot_experience, chatbot_income, chatbot_invest_length, chatbot_risk, chatbot_loss, chatbot_invest_type
from user_queries import get_llm_response


API_URL = 'http://localhost:4000/news'
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
    const email = req.query.email;

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


def fetch_user_profile(user_id):
    connection = mysql.connector.connect(
        host="make-cents-server.database.windows.net",
        user="gamer237",
        password="GamerBoy123!",
        database="make_cents_db"
    )
    
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM user_profiles WHERE user_id = {user_id}")
    
    user_profile = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    return user_profile if user_profile else None



def fetch_news_from_api(stock):
    try:
        response = requests.get(API_URL, params={"symbol": stock})
        response.raise_for_status()
        news_data = response.json()
        
        if 'data' in news_data and 'news' in news_data['data']:
            return news_data['data']['news'][:5]  # Fetch the 5 most recent articles
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news for {stock}: {e}")
    return []


def generate_gpt3_summary(articles, user_profile):
    # Generate the personalized instruction using the profile
    instruction = (
        "You are a financial assistant providing personalized summaries about current news events. "
        "You need to provide a short summary of the main points of the article, and about how the news article would affect the investment choices "
        f"of someone who is a {chatbot_experience(user_profile)} {chatbot_income(user_profile)} {chatbot_invest_length(user_profile)} "
        f"{chatbot_risk(user_profile)} {chatbot_loss(user_profile)} {chatbot_invest_type(user_profile)}. "
        "If the news would have a positive effect on the person, say: 'This has a positive impact'. "
        "If the news would have a negative effect, say: 'This has a negative impact'."
    )

    summaries = []
    for article in articles:
        content = f"Title: {article['article_title']}\nContent: {article['article_summary']}"
        
        # Call the LLM with the article content and the user's profile
        messages = [
            {"role": "system", "content": instruction},
            {"role": "user", "content": content}
        ]
        
        # Get GPT-3.5 response (pseudo-code, depends on your actual integration)
        response = get_llm_response(messages, max_response_tokens=300)
        summary = response.choices[0].message.content.strip()
        summaries.append(summary)

    return summaries


def main(user_id, stock):
    # Step 1: Fetch the user's profile from MySQL
    user_profile = fetch_user_profile(user_id)
    if not user_profile:
        print(f"User profile not found for user ID: {user_id}")
        return
    
    # Step 2: Fetch news articles related to the stock
    news_articles = fetch_news_from_api(stock)
    if not news_articles:
        print(f"No recent news found for stock: {stock}")
        return

    # Step 3: Generate personalized summaries using GPT-3.5
    summaries = generate_gpt3_summary(news_articles, user_profile)

    # Print or store the summaries
    for summary in summaries:
        print(summary)

if __name__ == "__main__":
    main(user_id=1, stock="BHP")  # Example usage
