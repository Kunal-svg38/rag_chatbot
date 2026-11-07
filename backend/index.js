import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/route.js';
import { connectDB } from './db/db.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', router);

const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).send('healthy');
});

app.listen(port, async () => {
  console.log(`Server is running on ${port}`);
  await connectDB();
});