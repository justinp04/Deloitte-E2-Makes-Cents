/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for adding and updating favourite stocks
 ************************************************************************************************/

import express from 'express';
import sql from 'mssql';

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

/// CREATE Route to add a favourite stock
router.post('/add', async (req, res) => {
    const { userId, stockSymbol } = req.body;

    if (!userId || !stockSymbol) {
        return res.status(400).json({ error: 'User ID and Stock Symbol are required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);

        // Check if the stock already exists for this user
        const checkResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('stockSymbol', sql.VarChar, stockSymbol)
            .query(`
                SELECT COUNT(*) AS count 
                FROM FavoriteStocks 
                WHERE user_id = @userId AND stock_symbol = @stockSymbol
            `);

        const stockExists = checkResult.recordset[0].count > 0;

        if (stockExists) {
            return res.status(409).json({ error: 'This stock is already added to your favorites' });
        }

        // Insert the stock if it doesn't exist
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('stockSymbol', sql.VarChar, stockSymbol)
            .query(`
                INSERT INTO FavoriteStocks (user_id, stock_symbol)
                VALUES (@userId, @stockSymbol)
            `);

        res.status(200).json({ message: 'Favorite stock added successfully' });
    } catch (error) {
        console.error('Error adding favorite stock:', error);
        res.status(500).json({ error: 'Failed to add favorite stock' });
    }
});


// DELETE Route to remove a favorite stock for a user
router.delete('/remove', async (req, res) => {
    const { userId, stockSymbol } = req.body;

    if (!userId || !stockSymbol) {
        return res.status(400).json({ error: 'User ID and Stock Symbol are required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('stockSymbol', sql.VarChar, stockSymbol)
            .query(`
                DELETE FROM FavoriteStocks
                WHERE user_id = @userId AND stock_symbol = @stockSymbol
            `);

        res.status(200).json({ message: 'Favorite stock removed successfully' });
    } catch (error) {
        console.error('Error removing favorite stock:', error);
        res.status(500).json({ error: 'Failed to remove favorite stock' });
    }
});

// favoriteStocksRoutes.js (or your users routes file)
router.get('/get-userid', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT id FROM [dbo].[Users] WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = result.recordset[0].id;
        res.status(200).json({ userId });
    } catch (error) {
        console.error('Error fetching user id:', error);
        res.status(500).json({ error: 'Failed to fetch user id' });
    }
});


export default router;