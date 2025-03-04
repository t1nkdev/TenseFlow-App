import { configureStore } from '@reduxjs/toolkit';
import shiftsReducer from './features/shifts/shiftsSlice';
import shiftTypesReducer from './features/shifts/shiftTypesSlice';
import employeesReducer from './features/employees/employeesSlice';
import departmentsReducer from './features/departments/departmentsSlice';
import uiReducer from './features/ui/uiSlice';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    shifts: shiftsReducer,
    shiftTypes: shiftTypesReducer,
    employees: employeesReducer,
    departments: departmentsReducer,
    ui: uiReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 