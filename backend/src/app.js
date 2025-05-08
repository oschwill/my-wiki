import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { router as userRouter } from './routes/userRoute.js';
import { router as adminRouter } from './routes/adminRoute.js';
import { router as creatorRouter } from './routes/creatorRoute.js';
import { router as contentRouter } from './routes/contentRoute.js';
import { router as oAuthRouter } from './routes/oAuthRouter.js';
import passport from 'passport';
import session from 'express-session';
import './utils/oAuthHelper.js';
import { globalMiddlewareErrorHandling } from './utils/globalErrorHandler.js';

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

// oAuth Passport Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 1 }, // 1 Tag
  })
);
app.use(passport.initialize());
app.use(passport.session());

// DB connecten
await connectDB();

// Routes
app.use('/auth', oAuthRouter); //# oAuth
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/creator', creatorRouter);
app.use('/api/v1/content', contentRouter);

// Errorhandling
app.use(globalMiddlewareErrorHandling);
