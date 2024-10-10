/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for connecting chatbot with frontend 
 ************************************************************************************************/

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Define the /chat route to handle chatbot requests
router.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    const stockName = req.body.stockName;

    if (!userMessage) {
        console.error('No user message received');
        return res.status(400).json({ error: 'No message provided' });
    }

    console.log(`Received message: ${userMessage}`);

    // Call the Python script and pass the user message
    const pythonExecutable = 'python3';
    const pythonScriptPath = path.join(__dirname, '../../Rag/chatbot.py');
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, userMessage, stockName]);
    
    // Collect the Python script output
    let responseData = '';

    pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString(); // Collect the output
        console.log(`Python script output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString();
        console.error(`Python script error: ${errorMessage}`);
        if (errorMessage.includes('429')) {
            res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        } else {
            res.status(500).json({ error: `Python script error: ${errorMessage}` });
        }
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    
        if (code !== 0) {
            return res.status(500).json({ error: `Python script exited with code ${code}` });
        }
    
        try {
            // Ensure we're parsing the trimmed output
            const parsedData = JSON.parse(responseData.trim());
    
            // Send the parsed response and follow-up suggestions to the frontend
            res.json({
                response: parsedData.response,               // Main chatbot response
                followUpSuggestions: parsedData.followUpSuggestions // Follow-up suggestions
            });

            // Store the response in the mySQL database
        } catch (err) {
            console.error('Error parsing Python output:', err);
            res.status(500).json({ error: 'Failed to parse Python output.' });
        }
    });    

    pythonProcess.on('error', (err) => {
        console.error('Failed to start Python script:', err);
        res.status(500).json({ error: 'Failed to start Python script.' });
    });
});

export default router;