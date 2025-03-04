import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from '@prisma/client';
import departmentRoutes from './routes/departments';
import employeeRoutes from './routes/employees';
import shiftPlanRoutes from './routes/shiftPlans';
import shiftTypeRoutes from './routes/shiftTypes';
import schedulesRouter from './routes/schedules';
import { getHomeRoute, notFoundHandler, globalErrorHandler } from './controllers/indexController';
import indexRouter from './routes/index';

const prisma = new PrismaClient();

// CONFIGURATION
dotenv.config();
const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Home route
app.get('/', getHomeRoute);

// Mount routes
app.use('/api', indexRouter);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shift-types', shiftTypeRoutes);
app.use('/api/shift-plans', shiftPlanRoutes);
app.use('/api/schedules', schedulesRouter);

// Global error handling middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



