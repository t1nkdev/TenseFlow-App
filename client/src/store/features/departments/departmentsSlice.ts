import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Department } from '@/types/prismaTypes';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/api/departments';
import { toast } from 'sonner';

interface DepartmentsState {
  list: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async () => {
    try {
      const response = await getDepartments();
      return response;
    } catch (error: any) {
      toast.error('Failed to fetch departments');
      throw error;
    }
  }
);

export const createDepartmentAsync = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData: Partial<Department>) => {
    try {
      const response = await createDepartment(departmentData);
      toast.success(`${departmentData.name} has been added successfully`, {
        position: 'bottom-right',
        style: {
          background: '#10b981',
          border: 'none',
          color: 'white'
        }
      });
      return response;
    } catch (error: any) {
      toast.error('Failed to create department');
      throw error;
    }
  }
);

export const updateDepartmentAsync = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, data }: { id: string; data: Partial<Department> }) => {
    try {
      const response = await updateDepartment(id, data);
      toast.success(`${data.name}'s information has been updated`, {
        position: 'bottom-right',
        style: {
          background: '#10b981',
          border: 'none',
          color: 'white'
        }
      });
      return response;
    } catch (error: any) {
      toast.error('Failed to update department');
      throw error;
    }
  }
);

export const deleteDepartmentAsync = createAsyncThunk(
  'departments/deleteDepartment',
  async (department: Department) => {
    try {
      await deleteDepartment(department.id);
      toast.success(`${department.name} has been deleted`, {
        position: 'bottom-right',
        style: {
          background: '#f97316',
          border: 'none',
          color: 'white'
        }
      });
      return department.id;
    } catch (error: any) {
      toast.error('Failed to delete department');
      throw error;
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch departments';
      })
      // Create Department
      .addCase(createDepartmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartmentAsync.fulfilled, (state, action) => {
        console.log('createDepartmentAsync.fulfilled with payload:', action.payload);
        if (action.payload && action.payload.data) {
          state.list.push(action.payload.data);
        } else if (action.payload) {
          state.list.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createDepartmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create department';
      })
      // Update Department
      .addCase(updateDepartmentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartmentAsync.fulfilled, (state, action) => {
        console.log('updateDepartmentAsync.fulfilled with payload:', action.payload);
        const updatedDept = action.payload && action.payload.data ? action.payload.data : action.payload;
        if (updatedDept) {
          const index = state.list.findIndex((dept: Department) => dept.id === updatedDept.id);
          if (index !== -1) {
            state.list[index] = updatedDept;
          }
        }
        state.loading = false;
      })
      .addCase(updateDepartmentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update department';
      })
      // Delete Department
      .addCase(deleteDepartmentAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((dept: Department) => dept.id !== action.payload);
      });
  },
});

export default departmentsSlice.reducer; 