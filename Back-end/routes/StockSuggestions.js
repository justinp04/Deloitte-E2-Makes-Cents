/************************************************************************************************
 * Author: Anna Duong
 * Purpose: User Endpoint for extracting stock suggestions based on user profile 
 ************************************************************************************************/

import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import levenshtein from 'fast-levenshtein';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// to pass stock ticker along with stock name
const __filePath = path.join(__filename, '../..', 'public', 'asxStockList.csv');


const router = express.Router();



router.post('/stock-suggestions', async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Fetch user responses from the specified endpoint
        const userResponse = await axios.get(`http://localhost:4000/next/user-responses?email=${email}`);
        const userData = userResponse.data.response;

        const responseComplexity = userData[0];
        const userIncome = userData[1]; 
        const userHorizon = userData[2]; 
        const userRisk = userData[3]; 
        const userLoss = userData[4]; 
        const userPreference = userData[5]; 

        // Call the Python script with the user profile data
        const pythonExecutable = 'python3';
        const pythonScriptPath = path.join(__dirname, '../../Rag/stock_suggestion.py'); 
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

            // do the stock logic here, before sending the json off

            //res.status(200).json({ stocks }); // Send the stock names as JSON

            addTickersToStocks(stocks, __filePath, updatedStocks => {

                console.log(updatedStocks);

                // Send the updated stocks array as JSON
                res.status(200).json({ stocks: updatedStocks });
            });

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

// Function to add ticker symbols to stocks
function addTickersToStocks(stocks, csvFilePath, callback) {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the CSV file:', err);
            callback(stocks); // Return the original stocks if there's an error
            return;
        }

        // Split the CSV content by new lines
        const lines = data.split('\n');

        // Create a mapping from company names to ticker symbols
        const companyToTicker = {};
        lines.forEach(line => {
            const [companyName, tickerSymbol] = line.split(',');
            if (companyName && tickerSymbol) {
                companyToTicker[companyName.trim().toLowerCase()] = tickerSymbol.trim();
            }
        });

        // Now, process the stocks array
        const updatedStocks = [];
        stocks.forEach(stockEntry => {
            // Extract possible company names from stockEntry
            const possibleNames = extractCompanyNames(stockEntry);

            // Try to find a match in the companyToTicker mapping
            let tickerSymbol = findTickerSymbol(possibleNames, companyToTicker);

            updatedStocks.push(stockEntry);
            if (tickerSymbol) {
                updatedStocks.push(tickerSymbol);
            } else {
                console.warn(`Ticker symbol not found for stock entry: ${stockEntry}`);
            }
        });

        // Callback with the updated stocks array
        callback(updatedStocks);
    });
}

function extractCompanyNames(stockEntry) {
    // Split on '(', ')', '-', ',', and various dash characters
    let substrings = stockEntry.split(/[\(\)\-,–—]/);

    // Trim whitespace and filter out empty strings
    substrings = substrings.map(s => s.trim()).filter(s => s.length > 0);

    return substrings;
}

function findTickerSymbol(possibleNames, companyToTicker) {
    // Try exact match first (case-insensitive)
    for (let name of possibleNames) {
        const lowerName = name.toLowerCase();
        if (companyToTicker[lowerName]) {
            return companyToTicker[lowerName];
        }
    }

    // Try substring match (case-insensitive)
    for (let name of possibleNames) {
        const lowerName = name.toLowerCase();
        for (let companyName in companyToTicker) {
            if (
                lowerName.includes(companyName) ||
                companyName.includes(lowerName)
            ) {
                return companyToTicker[companyName];
            }
        }
    }

    // Use Levenshtein distance for fuzzy matching
    let closestMatch = null;
    let smallestDistance = Infinity;

    for (let name of possibleNames) {
        const lowerName = name.toLowerCase();
        for (let companyName in companyToTicker) {
            const distance = levenshtein.get(lowerName, companyName);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestMatch = companyName;
            }
        }
    }

    // Set a threshold for acceptable distance
    const maxDistance = 3; // Adjust this value as needed
    if (smallestDistance <= maxDistance) {
        return companyToTicker[closestMatch];
    }

    // If no match found, return null
    return null;
}

export default router;