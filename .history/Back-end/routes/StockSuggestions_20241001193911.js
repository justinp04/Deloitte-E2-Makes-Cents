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

    if (!userIncome || !userHorizon || !userRisk || !userLoss || !userPreference) {
        console.error('Missing required inputs for stock suggestions');
        return res.status(400).json({ error: 'All user profile inputs are required' });
    }

    console.log(`Received user profile inputs: Income: ${userIncome}, Horizon: ${userHorizon}, Risk: ${userRisk}, Loss: ${userLoss}, Preference: ${userPreference}`);

    // Call the Python script and pass the user profile data
    const pythonExecutable = 'python3';
    const pythonScriptPath = path.join(__dirname, 'y'); // Adjust the path to your script
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
                // Process the responseData to get stock names
                const stockNames = responseData.trim().split('\n').map(stock => stock.trim());
                res.status(200).json({ stocks: stockNames }); // Send the stock names as JSON
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