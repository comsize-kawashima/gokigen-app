import { NextApiRequest, NextApiResponse } from 'next';

let moodDatabase: { [key: string]: number } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { date, mood } = req.body;
    if (!date || mood === undefined) {
      return res.status(400).json({ error: 'Date and mood are required' });
    }
    moodDatabase[date] = mood;
    return res.status(200).json({ message: 'Mood recorded successfully' });
  }

  if (req.method === 'GET') {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    const filteredMoods = Object.entries(moodDatabase)
      .filter(([date]) => date >= start_date && date <= end_date)
      .reduce((acc, [date, mood]) => ({ ...acc, [date]: mood }), {});
    return res.status(200).json(filteredMoods);
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 