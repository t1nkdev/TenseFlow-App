import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shiftTypesApi, type ShiftType } from '@/api/shiftTypes';
import { toast } from 'sonner';

interface CreateShiftTypePayload {
  code: string;
  name: string;
  startTime?: string;
  endTime?: string;
  color: string;
  requiresTime: boolean;
  shiftPlanId: string;
}

interface ShiftTypesState {
  list: ShiftType[];
  loading: boolean;
  error: string | null;
}

const initialState: ShiftTypesState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchShiftTypesByPlan = createAsyncThunk(
  'shiftTypes/fetchByPlan',
  async (planId: string) => {
    try {
      const response = await shiftTypesApi.getByPlan(planId);
      return response;
    } catch (error: any) {
      toast.error('Failed to fetch shift types');
      throw error;
    }
  }
);

export const createShiftType = createAsyncThunk(
  'shiftTypes/create',
  async (shiftTypeData: CreateShiftTypePayload) => {
    try {
      const response = await shiftTypesApi.create(shiftTypeData);
      toast.success(`${shiftTypeData.name} shift type has been created`, {
        position: 'bottom-right',
        style: {
          background: '#10b981',
          border: 'none',
          color: 'white'
        }
      });
      return response;
    } catch (error: any) {
      toast.error('Failed to create shift type');
      throw error;
    }
  }
);

export const updateShiftType = createAsyncThunk(
  'shiftTypes/update',
  async ({ id, data }: { id: string; data: Partial<ShiftType> }) => {
    try {
      const response = await shiftTypesApi.update(id, data);
      toast.success(`${data.name} shift type has been updated`, {
        position: 'bottom-right',
        style: {
          background: '#10b981',
          border: 'none',
          color: 'white'
        }
      });
      return response;
    } catch (error: any) {
      toast.error('Failed to update shift type');
      throw error;
    }
  }
);

export const deleteShiftType = createAsyncThunk(
  'shiftTypes/delete',
  async (shiftType: ShiftType) => {
    try {
      await shiftTypesApi.delete(shiftType.id);
      toast.success(`${shiftType.name} shift type has been deleted`, {
        position: 'bottom-right',
        style: {
          background: '#f97316',
          border: 'none',
          color: 'white'
        }
      });
      return shiftType.id;
    } catch (error: any) {
      toast.error('Failed to delete shift type');
      throw error;
    }
  }
);

const shiftTypesSlice = createSlice({
  name: 'shiftTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Shift Types
      .addCase(fetchShiftTypesByPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftTypesByPlan.fulfilled, (state, action: PayloadAction<ShiftType[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchShiftTypesByPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shift types';
      })
      // Create Shift Type
      .addCase(createShiftType.fulfilled, (state, action: PayloadAction<ShiftType>) => {
        state.list.push(action.payload);
      })
      // Update Shift Type
      .addCase(updateShiftType.fulfilled, (state, action: PayloadAction<ShiftType>) => {
        const index = state.list.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete Shift Type
      .addCase(deleteShiftType.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter(type => type.id !== action.payload);
      });
  },
});

export default shiftTypesSlice.reducer; 