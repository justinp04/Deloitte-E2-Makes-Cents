/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for extracting Detailed and Quick Summary based on Stock search 
 ************************************************************************************************/

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Route to fetch the stock summary and references by calling summary.py
router.post('/stock-summary', (req, res) => {
    const { stockName, response_depth } = req.body; // Get the stock name from the request

    if (!stockName) {
        console.error('No stock name received');
        return res.status(400).json({ error: 'No stock name provided' });
    }

    if (!response_depth) {
        console.error('No response depth received');
        return res.status(400).json({ error: 'No response depth provided' });
    }

    console.log(`Received stock name: ${stockName}`);
    console.log(`Received response depth: ${response_depth}`);

    // Call the Python script and pass the stock name
    const pythonExecutable = 'python3';
    const pythonScriptPath = path.join(__dirname, '../../Rag/summary.py');
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, stockName, response_depth]);

    const userEmail = req.body.userEmail;

    // Collect the Python script output
    let responseData = '';

    pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString(); // Collect the output
        console.log(`Python script output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString();
        console.error(`Python script error: ${errorMessage}`);
        if (!res.headersSent) {
            res.status(500).json({ error: `Python script error: ${errorMessage}` });
        }
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);

        if (!res.headersSent) {
            try {
                // Attempt to extract JSON from the output
                const jsonStartIndex = responseData.indexOf('{');
                const jsonEndIndex = responseData.lastIndexOf('}');
                if (jsonStartIndex === -1 || jsonEndIndex === -1) {
                    throw new Error('No JSON found in the response.');
                }
                const jsonString = responseData.slice(jsonStartIndex, jsonEndIndex + 1).trim();
                const result = JSON.parse(jsonString); // Parse the JSON
                
                res.json(result); // Send the JSON result back to the client
            } catch (parseError) {
                console.error(`Error parsing Python output: ${parseError.message}`);
                res.status(500).json({ error: 'Error parsing script output' });
            }
        }
    });

    pythonProcess.on('error', (err) => {
        console.error('Failed to start Python script:', err);
        res.status(500).json({ error: 'Failed to start Python script.' });
    });
});

export default router;