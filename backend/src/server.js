import mongoose from 'mongoose';
import { app } from './app.js';

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGO_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection failed', error.message));
} else {
  console.warn('MONGO_URI is not configured; API will start without a database connection.');
}

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
