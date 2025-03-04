import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shiftTypesApi } from '@/api/shiftTypes';
import { getShiftPlans, deleteShiftPlan } from '@/api/shiftPlans';
import { ShiftType, ShiftPlan } from '@/types/prismaTypes';
import { toast } from 'sonner';

interface ShiftsState {
  types: ShiftType[];
  plans: ShiftPlan[];
  selectedPlanId: string | null;
  loading: {
    types: boolean;
    plans: boolean;
  };
  error: string | null;
}

const initialState: ShiftsState = {
  types: [],
  plans: [],
  selectedPlanId: null,
  loading: {
    types: false,
    plans: false,
  },
  error: null,
};

export const fetchShiftTypes = createAsyncThunk(
  'shifts/fetchShiftTypes',
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

export const fetchShiftPlans = createAsyncThunk(
  'shifts/fetchShiftPlans',
  async () => {
    try {
      const response = await getShiftPlans();
      return response;
    } catch (error: any) {
      toast.error('Failed to fetch shift plans');
      throw error;
    }
  }
);

export const deleteShiftPlanAsync = createAsyncThunk(
  'shifts/deleteShiftPlan',
  async (planId: string) => {
    try {
      await deleteShiftPlan(planId);
      return planId;
    } catch (error: any) {
      toast.error('Failed to delete shift plan');
      throw error;
    }
  }
);

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    setSelectedPlan: (state, action: PayloadAction<string | null>) => {
      state.selectedPlanId = action.payload;
    },
    updatePlanInStore: (state, action: PayloadAction<ShiftPlan>) => {
      const index = state.plans.findIndex((plan: ShiftPlan) => plan.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },
    updatePlanDepartments: (state, action: PayloadAction<{planId: string, departments: any[]}>) => {
      const { planId, departments } = action.payload;
      const index = state.plans.findIndex((plan: ShiftPlan) => plan.id === planId);
      if (index !== -1) {
        state.plans[index] = {
          ...state.plans[index],
          departments: departments
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shift Types
      .addCase(fetchShiftTypes.pending, (state) => {
        state.loading.types = true;
        state.error = null;
      })
      .addCase(fetchShiftTypes.fulfilled, (state, action) => {
        state.types = action.payload;
        state.loading.types = false;
      })
      .addCase(fetchShiftTypes.rejected, (state, action) => {
        state.loading.types = false;
        state.error = action.error.message || 'Failed to fetch shift types';
      })
      // Fetch Shift Plans
      .addCase(fetchShiftPlans.pending, (state) => {
        state.loading.plans = true;
        state.error = null;
      })
      .addCase(fetchShiftPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.loading.plans = false;
        // Select first plan if none selected
        if (!state.selectedPlanId && action.payload.length > 0) {
          state.selectedPlanId = action.payload[0].id;
        }
      })
      .addCase(fetchShiftPlans.rejected, (state, action) => {
        state.loading.plans = false;
        state.error = action.error.message || 'Failed to fetch shift plans';
      })
      // Delete Shift Plan
      .addCase(deleteShiftPlanAsync.fulfilled, (state, action) => {
        state.plans = state.plans.filter((plan: ShiftPlan) => plan.id !== action.payload);
        // If deleted plan was selected, select the first available plan
        if (state.selectedPlanId === action.payload) {
          state.selectedPlanId = state.plans[0]?.id || null;
        }
      });
  },
});

export const { setSelectedPlan, updatePlanInStore, updatePlanDepartments } = shiftsSlice.actions;
export default shiftsSlice.reducer; 