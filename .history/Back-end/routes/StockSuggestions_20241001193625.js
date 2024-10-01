/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for extracting stock suggestions based on user profile 
 ************************************************************************************************/

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/stock-suggestions', (req, res) => {
    const { userIncome, userHorizon, userRisk, userLoss, userPreference } = req.body;

    // Check for required inputs
    if (!userIncome || !userHorizon || !userRisk || !userLoss || !userPreference) {
        console.error('Missing required inputs for stock suggestions');
        return res.status(400).json({ error: 'All user profile inputs are required' });
    }

    console.log(`Received user profile inputs: Income: ${userIncome}, Horizon: ${userHorizon}, Risk: ${userRisk}, Loss: ${userLoss}, Preference: ${userPreference}`);

    // Call the Python script and pass the user profile data
    const pythonExecutable = 'python3'; // Change to 'python' if you're on Windows
    const pythonScriptPath = path.join(__dirname, '../../path_to_your_script/stock_suggestion.py'); // Adjust the path
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, userIncome, userHorizon, userRisk, userLoss, userPreference]);

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