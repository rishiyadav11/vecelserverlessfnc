import { connectToDatabase } from '../lib/db.js';

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db('gym');
  const collection = db.collection('discounts');

  if (req.method === 'POST') {
    const { code, discount, durationInHours } = req.body;
    const expiresAt = new Date(Date.now() + durationInHours * 60 * 60 * 1000);
    await collection.insertOne({ code, discount, expiresAt });
    return res.status(200).json({ message: 'Discount created' });
  }

  if (req.method === 'GET') {
    const now = new Date();
    const discounts = await collection.find({ expiresAt: { $gt: now } }).toArray();
    return res.status(200).json(discounts);
  }

  return res.status(405).end();
}
