import connectDB from '../../utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { passCode } = req.body;

    if (!passCode) {
      return res.status(400).json({ message: 'Pass code is required' });
    }

    try {
      const client = await connectDB();
      const database = client.db('parko-data');
      const invoicesCollection = database.collection('invoices');

      const invoice = await invoicesCollection.findOne({ _id: new ObjectId(passCode) });

      if (!invoice) {
        return res.status(404).json({ message: 'No matching invoice found' });
      }

      if (invoice.parkingDetails?.entrystatus === 'Done') {
        return res.status(400).json({ message: 'QR Invalid: Already Scanned' });
      }

      const updatedInvoice = await invoicesCollection.updateOne(
        { _id: new ObjectId(passCode) },
        { $set: { 'parkingDetails.entrystatus': 'Done' } }
      );

      return res.status(200).json({
        message: 'QR Valid: Exit Granted',
        invoice: updatedInvoice,
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
