require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    throw new Error('❌ JWT_SECRET_KEY is missing');
}

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userFeedBackRouter = require('./routes/userFeedBackRoutes');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const adminRouter = require('./routes/adminRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL;

const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

app.use('/', userFeedBackRouter);
app.use('/', userRouter);
app.use('/', adminRouter);
app.use('/', taskRouter);
app.use('/', authRouter);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log('❌ Connection Error:', err.message);
        process.exit(1);
    }
};

startServer();