"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const client_1 = require("@prisma/client");
const departments_1 = __importDefault(require("./routes/departments"));
const employees_1 = __importDefault(require("./routes/employees"));
const shiftPlans_1 = __importDefault(require("./routes/shiftPlans"));
const shiftTypes_1 = __importDefault(require("./routes/shiftTypes"));
const schedules_1 = __importDefault(require("./routes/schedules"));
const indexController_1 = require("./controllers/indexController");
const index_1 = __importDefault(require("./routes/index"));
const prisma = new client_1.PrismaClient();
// CONFIGURATION
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400 // 24 hours
};
// MIDDLEWARE
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
// Home route
app.get('/', indexController_1.getHomeRoute);
// Mount routes
app.use('/api', index_1.default);
app.use('/api/departments', departments_1.default);
app.use('/api/employees', employees_1.default);
app.use('/api/shift-types', shiftTypes_1.default);
app.use('/api/shift-plans', shiftPlans_1.default);
app.use('/api/schedules', schedules_1.default);
// Global error handling middleware
app.use(indexController_1.notFoundHandler);
app.use(indexController_1.globalErrorHandler);
// SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
