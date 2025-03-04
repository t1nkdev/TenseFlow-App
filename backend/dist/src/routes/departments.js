"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const departmentController_1 = require("../controllers/departmentController");
const router = express_1.default.Router();
// GET routes
router.get('/', departmentController_1.getAllDepartments);
router.get('/employees', departmentController_1.getEmployees);
// POST routes
router.post('/', (0, validateRequest_1.validateRequest)({ body: departmentController_1.CreateDepartmentSchema }), departmentController_1.createDepartment);
// PUT routes
router.put('/:id', (0, validateRequest_1.validateRequest)({ body: departmentController_1.CreateDepartmentSchema }), departmentController_1.updateDepartment);
// DELETE routes
router.delete('/:id', departmentController_1.deleteDepartment);
exports.default = router;
