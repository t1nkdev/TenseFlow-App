import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  showQuickDocuments?: boolean;
  // Other user preferences can remain here
}

interface UserState {
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  preferences: {
    showQuickDocuments: true, // Default to showing quick documents
  },
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
      
      // Save preferences to localStorage for persistence
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    loadUserPreferences: (state) => {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        try {
          state.preferences = {
            ...state.preferences,
            ...JSON.parse(savedPreferences)
          };
        } catch (error) {
          console.error('Failed to parse saved preferences:', error);
        }
      }
    }
  }
});

export const { 
  updateUserPreferences, 
  loadUserPreferences
} = userSlice.actions;

export default userSlice.reducer; 