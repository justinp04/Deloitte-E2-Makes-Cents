/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for extracting stock suggestions based on user profile 
 ************************************************************************************************/

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();



router.post('/stock-suggestions', async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {

        // Add CORS headers here explicitly
        res.setHeader('Access-Control-Allow-Origin', 'https://ashy-beach-0b9678500.5.azurestaticapps.net');
        res.setHeader('Access-Control-Allow-Credentials', 'true');  // Allow credentials
        console.log(`Fetching stock suggestions for: ${email}`);
        // Fetch user responses from the specified endpoint
        const userResponse = await axios.get(`https://makecentsbackenddocker-eve2hec3bmhvf5bk.australiaeast-01.azurewebsites.net/next/user-responses?email=${email}`);
        // const userResponse = await axios.get(`http://localhost:8080/next/user-responses?email=${email}`);
        const userData = userResponse.data.response;

        const responseComplexity = userData[0];
        const userIncome = userData[1]; 
        const userHorizon = userData[2]; 
        const userRisk = userData[3]; 
        const userLoss = userData[4]; 
        const userPreference = userData[5]; 

        // Call the Python script with the user profile data
        const pythonExecutable = 'python3';
        const pythonScriptPath = path.join(__dirname, '../Rag/stock_suggestion.py'); 
        const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, responseComplexity, userIncome, userHorizon, userRisk, userLoss, userPreference]);

        let responseData = '';

        pythonProcess.stdout.on('data', (data) => {
            responseData += data.toString(); 
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data}`);
            res.status(500).json({ error: `Python script error: ${data.toString()}` });
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                return res.status(500).json({ error: 'Python script exited with an error' });
            }

            // Process the output
            const stocks = responseData.trim().split('\n').map(stock => stock.trim());
            res.status(200).json({ stocks }); // Send the stock names as JSON
        });
        
        pythonProcess.on('error', (err) => {
            console.error('Failed to start Python script:', err);
            res.status(500).json({ error: 'Failed to start Python script.' });
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile data.' });
    }
});

export default router;