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

// Route to add a favorite stock for a user
router.post('/favorite-stocks/add', async (req, res) => {
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
                INSERT INTO FavoriteStocks (user_id, stock_symbol)
                VALUES (@userId, @stockSymbol)
            `);

        res.status(200).json({ message: 'Favorite stock added successfully' });
    } catch (error) {
        console.error('Error adding favorite stock:', error);
        res.status(500).json({ error: 'Failed to add favorite stock' });
    }
});

// Route to remove a favorite stock for a user
router.delete('/favorite-stocks/remove', async (req, res) => {
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

export default router;