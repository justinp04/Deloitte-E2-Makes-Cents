import express from 'express';
import axios from 'axios';
import dayjs from 'dayjs';

const router = express.Router();

// Your RapidAPI credentials
const RAPIDAPI_KEY = '27bdb1cd68msh871c2657ab88a5cp1437b8jsn2ff75a048f41';
const RAPIDAPI_HOST = 'real-time-finance-data.p.rapidapi.com';

// Utility function to filter news articles from the past week
const filterRecentNews = (newsArticles) => {
  const oneWeekAgo = dayjs().subtract(7, 'day');
  return newsArticles.filter(article => dayjs(article.post_time_utc).isAfter(oneWeekAgo));
};

// Route to get news based on company symbol
router.get('/news', async (req, res) => {
  const { symbol } = req.query;

  try {
    const response = await axios.get('https://real-time-finance-data.p.rapidapi.com/stock-news', {
      params: { symbol, language: 'en' },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    });

    const allNews = response.data.data.news;
    const recentNews = filterRecentNews(allNews);

    res.json({
      status: 'OK',
      request_id: response.data.request_id,
      data: {
        symbol: response.data.data.symbol,
        type: response.data.data.type,
        news: recentNews
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;
