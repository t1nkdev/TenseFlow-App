"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
// GET routes
router.get('/', employeeController_1.getAllEmployees);
// POST routes
router.post('/', employeeController_1.createEmployee);
// PUT routes
router.put('/:id', employeeController_1.updateEmployee);
// DELETE routes
router.delete('/:id', employeeController_1.deleteEmployee);
exports.default = router;
