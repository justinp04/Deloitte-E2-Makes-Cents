import express from 'express';
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper function to execute the Python script and get the summary
const generateSummary = (article, userEmail, stock) => {
    return new Promise((resolve, reject) => {
        // Command to execute the Python script
        const pythonScript = `python3 news_feed_summary.py --article "${article.article_title}" --url "${article.article_url}" --user "${userEmail}" --stock "${stock}"`;

        exec(pythonScript, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return reject(stderr);
            }
            // The stdout will contain the summary, return it
            resolve(stdout.trim());
        });
    });
};

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