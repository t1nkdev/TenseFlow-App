"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function loadJsonFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(__dirname, 'seed', filename);
        const data = (0, fs_1.readFileSync)(filePath, 'utf-8');
        return JSON.parse(data);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting seed...');
            // Load JSON data
            const { departments } = yield loadJsonFile('departments.json');
            const { employees } = yield loadJsonFile('employees.json');
            const { shifts: shiftTypes } = yield loadJsonFile('shifts.json');
            const { schedules } = yield loadJsonFile('schedules.json');
            // Clear existing data
            console.log('Clearing existing data...');
            yield prisma.schedule.deleteMany();
            yield prisma.shiftType.deleteMany();
            yield prisma.shiftPlan.deleteMany();
            yield prisma.employee.deleteMany();
            yield prisma.department.deleteMany();
            // Format dates for employees
            const formattedEmployees = employees.map((emp) => (Object.assign(Object.assign({}, emp), { startDate: new Date(emp.startDate).toISOString() })));
            // Seed departments first (without manager references)
            console.log('Seeding departments...');
            yield prisma.department.createMany({
                data: departments.map((_a) => {
                    var { managerId } = _a, dept = __rest(_a, ["managerId"]);
                    return dept;
                })
            });
            // Seed employees
            console.log('Seeding employees...');
            yield prisma.employee.createMany({
                data: formattedEmployees
            });
            // Update department managers
            console.log('Updating department managers...');
            for (const dept of departments) {
                yield prisma.department.update({
                    where: { id: dept.id },
                    data: { managerId: dept.managerId }
                });
            }
            // Create default shift plan
            console.log('Creating default shift plan...');
            const defaultPlan = yield prisma.shiftPlan.create({
                data: {
                    id: "plan001",
                    name: "Default Plan",
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                    status: "PUBLISHED",
                    departmentId: departments[0].id
                }
            });
            // Seed shifts with shiftPlanId
            console.log('Seeding shifts...');
            yield prisma.shiftType.createMany({
                data: shiftTypes.map((shift) => (Object.assign(Object.assign({}, shift), { shiftPlanId: defaultPlan.id })))
            });
            // Seed schedules
            console.log('Seeding schedules...');
            const formattedSchedules = schedules.map((schedule) => {
                const { shiftId } = schedule, rest = __rest(schedule, ["shiftId"]); // Remove shiftId from the data
                return Object.assign(Object.assign({}, rest), { shiftTypeId: shiftId, shiftPlanId: defaultPlan.id, date: new Date(schedule.date).toISOString(), createdAt: new Date(schedule.createdAt).toISOString(), updatedAt: new Date(schedule.updatedAt).toISOString() });
            });
            yield prisma.schedule.createMany({
                data: formattedSchedules
            });
            console.log('Seeding completed successfully!');
        }
        catch (error) {
            console.error('Error seeding database:', error);
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
