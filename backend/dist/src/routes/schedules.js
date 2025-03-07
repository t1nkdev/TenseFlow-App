"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scheduleController_1 = require("../controllers/scheduleController");
const router = express_1.default.Router();
// GET routes
router.get("/:planId", scheduleController_1.getSchedulesByPlan);
// POST routes
router.post("/:planId", scheduleController_1.saveScheduleChanges);
// DELETE routes
router.delete("/:id", scheduleController_1.deleteSchedule);
exports.default = router;
