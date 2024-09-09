import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// Route to fetch the stock summary and references by calling summary.py
router.post('/stock-summary', (req, res) => {
    const { stockName } = req.body; // Get the stock name from the request

    if (!stockName) {
        console.error('No stock name received');
        return res.status(400).json({ error: 'No stock name provided' });
    }

    console.log(`Received stock name: ${stockName}`);

    // Call the Python script and pass the stock name
    const pythonExecutable = '/Users/anna/Desktop/MakeCents/E2_GenAI-3/venv/bin/python3';
    const pythonScriptPath = '/Users/anna/Desktop/MakeCents/E2_GenAI-3/Rag/summary.py'; // Absolute path to your Python script
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, stockName]);

    // Collect the Python script output
    let responseData = '';

    pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString(); // Collect the output
        console.log(`Python script output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorMessage = data.toString();
        console.error(`Python script error: ${errorMessage}`);
        res.status(500).json({ error: `Python script error: ${errorMessage}` });
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);

        if (!res.headersSent) {
            try {
                // Attempt to extract JSON from the output
                const jsonStartIndex = responseData.indexOf('{');
                const jsonString = responseData.slice(jsonStartIndex).trim(); // Extract the JSON part
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