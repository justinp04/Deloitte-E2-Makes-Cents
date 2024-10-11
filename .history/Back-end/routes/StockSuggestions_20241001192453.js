// /************************************************************************************************
//  * Author: Anna Duong
//  * Purpose: User Endpoint for fetching tailored stock suggestions
//  ************************************************************************************************/

// import express from 'express';
// import bodyParser from 'body-parser';
// import { get_recommendations, parse_recommendations } from './path_to_your_functions'; // Import your functions

// const app = express();
// const PORT = 4000; // Set your port number

// app.use(bodyParser.json());

// // Create the stock suggestions endpoint
// app.post('/stock-suggestions', async (req, res) => {
//     try {
//         const recommendations = await get_recommendations();
//         const [stock1, stock2, stock3] = parse_recommendations(recommendations);
        
//         res.status(200).json({ stocks: [stock1, stock2, stock3] });
//     } catch (error) {
//         console.error('Error fetching stock suggestions:', error);
//         res.status(500).json({ error: 'Failed to fetch stock suggestions' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });