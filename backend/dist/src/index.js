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
const prisma = new client_1.PrismaClient();
// ROUTE IMPORT 
// CONFIGURATION
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// ROUTES
app.get("/", (req, res) => {
    res.send("This is home route");
});
// Mount routes
app.use('/api/departments', departments_1.default);
app.use('/api/employees', employees_1.default);
app.use('/api/shift-plans', shiftPlans_1.default);
// SERVER
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
