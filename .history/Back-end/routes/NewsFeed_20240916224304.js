import express from 'express';
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper function to execute the Python script and get the summary
// Function to call the Python script for article summaries
const generateSummaryForArticle = (userEmail, stock, article) => {
    return new Promise((resolve, reject) => {
        // Path to your Python script
        const pythonScriptPath = path.join(__dirname, '../../Rag/news_feed_summary.py');
        
        // Command to execute the Python script with necessary arguments
        const pythonProcess = spawn('python3', [
            pythonScriptPath,
            '--user_email', userEmail,
            '--stock', stock,
            '--article_title', article.article_title,
            '--article_url', article.article_url
        ]);

        let scriptOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data}`);
            reject(new Error(data));
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(scriptOutput.trim());
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
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
        const response = await axios.get('https://real-time-finance-data.p.rapidapi.com/stock-news', {
            params: { symbol: symbol, language: 'en' },
            headers: {
                'x-rapidapi-key': '2bba6f4c05msh7b07c6a998f76bdp1768ffjsn9e6242b769a0',
                'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
            }
        });
        
        const articles = response.data.data.news || [];

        // For each article, generate a summary using the Python script
        const articlesWithSummaries = await Promise.all(
            articles.map(async (article) => {
                const summary = await generateSummaryForArticle(email, symbol, article).catch(() => 'Summary not available.');
                return { ...article, article_summary: summary };  // Append the summary to the article
            })
        );

        // Send the response back to the frontend
        res.json({
            ...response.data,
            data: {
                ...response.data.data,
                news: articlesWithSummaries  // Add summaries to the articles
            }
        });
    } catch (error) {
        console.error('Error fetching news data:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

export default router;