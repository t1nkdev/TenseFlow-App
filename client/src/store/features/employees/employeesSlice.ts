import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '@/types/prismaTypes';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/api/employees';
import { toast } from 'sonner';

interface EmployeesState {
  list: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    try {
      const response = await getEmployees();
      return response;
    } catch (error: any) {
      toast.error('Failed to fetch employees');
      throw error;
    }
  }
);

export const createEmployeeAsync = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: Partial<Employee>) => {
    try {
      const response = await createEmployee(employeeData);
      toast.success(`${employeeData.firstName} ${employeeData.lastName} has been added successfully`, {
        position: 'bottom-right',
        style: {
          background: '#10b981',
          border: 'none',
          color: 'white'
        }
      });
      return response;
    } catch (error: any) {
      toast.error('Failed to create employee');
      throw error;
    }
  }
);

export const updateEmployeeAsync = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }: { id: string; data: Partial<Employee> }) => {
    try {
      const response = await updateEmployee(id, data);
      toast.success(`${data.firstName} ${data.lastName}'s information has been updated`, {
        position: 'bottom-right',
        style: {
          background: '#10b981',
          border: 'none',
          color: 'white'
        }
      });
      return response;
    } catch (error: any) {
      toast.error('Failed to update employee');
      throw error;
    }
  }
);

export const deleteEmployeeAsync = createAsyncThunk(
  'employees/deleteEmployee',
  async (employee: Employee) => {
    try {
      await deleteEmployee(employee.id);
      toast.success(`${employee.firstName} ${employee.lastName} has been removed`, {
        position: 'bottom-right',
        style: {
          background: '#f97316',
          border: 'none',
          color: 'white'
        }
      });
      return employee.id;
    } catch (error: any) {
      toast.error('Failed to delete employee');
      throw error;
    }
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      // Create Employee
      .addCase(createEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeAsync.fulfilled, (state, action) => {
        console.log('createEmployeeAsync.fulfilled with payload:', action.payload);
        if (action.payload && action.payload.data) {
          state.list.push(action.payload.data);
        } else if (action.payload) {
          state.list.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create employee';
      })
      // Update Employee
      .addCase(updateEmployeeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        console.log('updateEmployeeAsync.fulfilled with payload:', action.payload);
        const updatedEmp = action.payload && action.payload.data ? action.payload.data : action.payload;
        if (updatedEmp) {
          const index = state.list.findIndex((emp: Employee) => emp.id === updatedEmp.id);
          if (index !== -1) {
            state.list[index] = updatedEmp;
          }
        }
        state.loading = false;
      })
      .addCase(updateEmployeeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update employee';
      })
      // Delete Employee
      .addCase(deleteEmployeeAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((emp: Employee) => emp.id !== action.payload);
      });
  },
});

export default employeesSlice.reducer; 