import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
  getAllDepartments,
  getEmployees,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  CreateDepartmentSchema
} from '../controllers/departmentController';

const router = express.Router();

// GET routes
router.get('/', getAllDepartments);
router.get('/employees', getEmployees);

// POST routes
router.post('/', validateRequest({ body: CreateDepartmentSchema }), createDepartment);

// PUT routes
router.put('/:id', validateRequest({ body: CreateDepartmentSchema }), updateDepartment);

// DELETE routes
router.delete('/:id', deleteDepartment);

export default router; 