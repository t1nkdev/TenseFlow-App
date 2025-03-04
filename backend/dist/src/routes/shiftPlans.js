"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shiftPlanController_1 = require("../controllers/shiftPlanController");
const router = express_1.default.Router();
// GET routes
router.get("/", shiftPlanController_1.getAllShiftPlans);
router.get("/:id/details", shiftPlanController_1.getShiftPlanDetails);
// POST routes
router.post("/", shiftPlanController_1.createShiftPlan);
router.post("/:id/schedules", shiftPlanController_1.saveScheduleChanges);
// PUT routes
router.put("/:id", shiftPlanController_1.updateShiftPlan);
// PATCH routes
router.patch("/:id/status", shiftPlanController_1.updateShiftPlanStatus);
router.patch("/:id/department-order", shiftPlanController_1.updateDepartmentOrder);
// DELETE routes
router.delete("/:id", shiftPlanController_1.deleteShiftPlan);
exports.default = router;
