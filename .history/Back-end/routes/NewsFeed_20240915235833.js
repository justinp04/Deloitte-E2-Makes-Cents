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
                'x-rapidapi-key': '27bdb1cd68msh871c2657ab88a5cp1437b8jsn2ff75a048f41',
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
