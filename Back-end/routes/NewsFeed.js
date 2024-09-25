/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for fetching stock article and AI Summary for article content 
 ************************************************************************************************/
import express from 'express';
import axios from 'axios';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper function to execute the Python script and get the summary
const generateSummaryForArticle = (userEmail, stock, article) => {
    return new Promise((resolve, reject) => {
        // Path to your Python script
        const pythonScriptPath = path.join(__dirname, '../../Rag/news_feed_summary.py');
        
        // Command to execute the Python script with necessary arguments
        const command = `python3 ${pythonScriptPath} --user_email ${userEmail} --stock ${stock} --article_title "${article.article_title}" --article_url "${article.article_url}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${stderr}`);
                return reject(new Error(`Error executing Python script: ${stderr}`));
            }
            resolve(stdout.trim());
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
                'x-rapidapi-key': 'c1d405efc5msh4cd9af5b8c04fcdp12246bjsn459993720c18',
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