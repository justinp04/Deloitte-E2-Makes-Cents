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

// GET endpoint to fetch current investment companies for a user
router.get('/current-investments', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const pool = await sql.connect(sqlConfig);

        // Fetch the user_id based on email
        const userResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT id FROM [dbo].[Users] WHERE email = @email');

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.recordset[0].id;

        // Fetch current investment companies for the user
        const investmentResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT company_name, stock_symbol 
                FROM [dbo].[CurrentInvestmentStocks] 
                WHERE user_id = @userId
            `);

        const investments = investmentResult.recordset.map(record => ({
            companyTitle: `${record.company_name} (${record.stock_symbol})`
        }));

        res.status(200).json({ currentInvestments: investments });
    } catch (error) {
        console.error('Error fetching current investments:', error);
        res.status(500).json({ error: 'Failed to fetch current investments' });
    }
});

// POST endpoint to add a new stock to current investments
router.post('/add-current-investment', async (req, res) => {
    const { email, company_name, stock_symbol } = req.body;

    if (!email || !stock_symbol) {
        return res.status(400).json({ error: 'Email and stock symbol are required' });
    }

    // Set company_name to a default value if it's not provided
    const companyName = company_name || 'Unknown Company';

    try {
        const pool = await sql.connect(sqlConfig);

        // Fetch the user_id based on email
        const userResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT id FROM [dbo].[Users] WHERE email = @email');

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.recordset[0].id;

        // Insert the new stock into CurrentInvestmentStocks
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('companyName', sql.VarChar, companyName)
            .input('stockSymbol', sql.VarChar, stock_symbol)
            .query(`
                INSERT INTO [dbo].[CurrentInvestmentStocks] (user_id, company_name, stock_symbol)
                VALUES (@userId, @companyName, @stockSymbol)
            `);

        res.status(200).json({ message: 'Stock added to current investments successfully' });
    } catch (error) {
        console.error('Error adding stock to current investments:', error);
        res.status(500).json({ error: 'Failed to add stock to current investments' });
    }
});


export default router;