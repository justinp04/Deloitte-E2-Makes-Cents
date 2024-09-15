import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
    const { symbol } = req.query;

    if (!symbol) {
        return res.status(400).json({ error: 'Company symbol is required' });
    }

    try {
        const response = await axios.get('https://real-time-finance-data.p.rapidapi.com/stock-news', {
            params: { symbol: symbol, language: 'en' },
            headers: {
                'x-rapidapi-key': '2bba6f4c05msh7b07c6a998f76bdp1768ffjsn9e6242b769a0',
                'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news data:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

export default router;
