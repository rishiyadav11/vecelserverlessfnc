import { connectToDatabase } from '../lib/db';

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db('gym');
  const collection = db.collection('bookings');

  if (req.method === 'POST') {
    const { name, email, phone, selectedPlan } = req.body;
    await collection.insertOne({ name, email, phone, selectedPlan, createdAt: new Date() });
    return res.status(200).json({ message: 'Booking received' });
  }

  if (req.method === 'GET') {
    const bookings = await collection.find().toArray();
    return res.status(200).json(bookings);
  }

  return res.status(405).end();
}
