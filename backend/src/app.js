import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { router as userRouter } from './routes/userRoute.js';

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

export const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());

// DB connecten
await connectDB();

// Routes
app.use('/api/v1/user', userRouter);
