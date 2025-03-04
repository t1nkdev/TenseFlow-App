import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeleteConfirmationPayload {
  title: string;
  message: string;
  itemName?: string;
}

interface UIState {
  modals: {
    settings: {
      isOpen: boolean;
      initialTab: number;
      initialItem: number;
    };
    createShift: boolean;
    quickAction: boolean;
    deleteConfirmation: {
      isOpen: boolean;
      title: string;
      message: string;
      itemName?: string;
    };
  };
}

const initialState: UIState = {
  modals: {
    settings: {
      isOpen: false,
      initialTab: 0,
      initialItem: 0,
    },
    createShift: false,
    quickAction: false,
    deleteConfirmation: {
      isOpen: false,
      title: '',
      message: '',
      itemName: undefined,
    },
  },
};

interface OpenSettingsModalPayload {
  initialTab?: number;
  initialItem?: number;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSettingsModal: (state, action: PayloadAction<OpenSettingsModalPayload>) => {
      state.modals.settings.isOpen = true;
      state.modals.settings.initialTab = action.payload.initialTab ?? 0;
      state.modals.settings.initialItem = action.payload.initialItem ?? 0;
    },
    closeSettingsModal: (state) => {
      state.modals.settings.isOpen = false;
    },
    openCreateShiftModal: (state) => {
      state.modals.createShift = true;
    },
    closeCreateShiftModal: (state) => {
      state.modals.createShift = false;
    },
    openQuickActionModal: (state) => {
      state.modals.quickAction = true;
    },
    closeQuickActionModal: (state) => {
      state.modals.quickAction = false;
    },
    openDeleteConfirmationModal: (state, action: PayloadAction<DeleteConfirmationPayload>) => {
      state.modals.deleteConfirmation = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeDeleteConfirmationModal: (state) => {
      state.modals.deleteConfirmation.isOpen = false;
    },
  },
});

export const {
  openSettingsModal,
  closeSettingsModal,
  openCreateShiftModal,
  closeCreateShiftModal,
  openQuickActionModal,
  closeQuickActionModal,
  openDeleteConfirmationModal,
  closeDeleteConfirmationModal,
} = uiSlice.actions;

export default uiSlice.reducer; 