
import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/route.js';
import { connectDB } from './db/db.js';

dotenv.config();

const app = express();

app.use(express.json());

// API routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Backend is running'
    });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
