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

const prisma = new PrismaClient();

// ROUTE IMPORT 


// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
    res.send("This is home route");
});

// Mount routes
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shift-plans', shiftPlanRoutes);

// SERVER
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



