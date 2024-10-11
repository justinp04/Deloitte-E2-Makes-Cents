import express from 'express';
import axios from 'axios';
import { exec } from 'child_process';

const router = express.Router();

// Helper function to execute Python script and get the summary
const generateSummary = (article, userEmail, stock) => {
    return new Promise((resolve, reject) => {
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
            resolve(stdout.trim()); // This should be the generated summary from the Python script
        });
    });
};

router.get('/', async (req, res) => {
    const { symbol, email } = req.query;

    if (!symbol) {
        return res.status(400).json({ error: 'Company symbol is required' });
    }
    if (!email) {
        return res.status(400).json({ error: 'User email is required' });
    }

    try {
        // Fetch news data from the news API
        const response = await axios.get('https://real-time-finance-data.p.rapidapi.com/stock-news', {
            params: { symbol: symbol, language: 'en' },
            headers: {
                'x-rapidapi-key': 'your-rapidapi-key', // Replace with your RapidAPI key
                'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
            }
        });

        const articles = response.data.data.news || [];

        // Generate summaries for each article using the Python script
        const articlesWithSummaries = await Promise.all(
            articles.map(async (article) => {
                const summary = await generateSummary(article, email, symbol);
                return { ...article, article_summary: summary };
            })
        );

        res.json({
            status: 'OK',
            data: {
                symbol: response.data.data.symbol,
                type: response.data.data.type,
                news: articlesWithSummaries
            }
        });

    } catch (error) {
        console.error('Error fetching news data or generating summaries:', error);
        res.status(500).json({ error: 'Failed to fetch news data or generate summaries' });
    }
});

export default router;
