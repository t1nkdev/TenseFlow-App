import express from 'express';
import {
  getAllEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee
} from '../controllers/employeeController';

const router = express.Router();

// GET routes
router.get('/', getAllEmployees);

// POST routes
router.post('/', createEmployee);

// PUT routes
router.put('/:id', updateEmployee);

// DELETE routes
router.delete('/:id', deleteEmployee);

export default router;
