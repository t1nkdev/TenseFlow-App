'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Folder, FileText, Clock, Building2, ChevronDown, ChevronRight, Settings, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/app/main/shift-schedule/page.module.css';
import CreateShiftPlanModal from '../../../modals/schedule/CreateShiftPlan';
import ModalSettings from '../../../modals/settings/ModalSettings';
import DeleteConfirmationModal from '../../../modals/confirmation/DeleteConfirmationModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchShiftTypes, fetchShiftPlans as fetchShiftPlansAction, deleteShiftPlanAsync, setSelectedPlan, updatePlanInStore } from '@/store/features/shifts/shiftsSlice';
import { fetchShiftTypesByPlan } from '@/store/features/shifts/shiftTypesSlice';
import {
  openSettingsModal,
  closeSettingsModal,
  openCreateShiftModal,
  closeCreateShiftModal,
  openQuickActionModal,
  closeDeleteConfirmationModal,
  closeQuickActionModal,
} from '@/store/features/ui/uiSlice';
import { updateUserPreferences, loadUserPreferences } from '@/store/features/user/userSlice';
import { ShiftPlan } from '@/types/prismaTypes';
import { updateShiftPlanStatus, deleteShiftPlan, getShiftPlans } from '@/api/shiftPlans';

// Import the new components
import SidebarHeader from './SidebarHeader';
import ShiftPlanItem from './ShiftPlanItem';
import ShiftTypesList from './ShiftTypesList';
import EditShiftPlanModal from './EditShiftPlanModal';
import PreloaderModals from '../../../pr/PreloaderModals';

// Import CreateEmployee modal
import CreateEmployeeModal from '../../../modals/employees/CreateEmployee';

// Local storage key for selected plan
const SELECTED_PLAN_KEY = 'tenseflow_selected_plan_id';

interface SidebarShiftTableProps {
  onShiftPlanSelect: (plan: ShiftPlan | null) => void;
  selectedPlanId?: string;
}

export const SidebarShiftTable = ({ onShiftPlanSelect, selectedPlanId }: SidebarShiftTableProps) => {
  const dispatch = useAppDispatch();
  const { types: shiftTypes, plans: shiftPlans, loading, selectedPlanId: storeSelectedPlanId } = useAppSelector((state: any) => state.shifts);
  const { list: shiftTypesList } = useAppSelector((state: any) => state.shiftTypes);
  const { preferences } = useAppSelector((state: any) => state.user);
  const { 
    modals: { 
      settings: settingsModal,
      createShift: isShiftModalOpen,
      quickAction: isQuickActionModalOpen,
      deleteConfirmation: deleteModalOpen 
    } 
  } = useAppSelector((state: any) => state.ui);
  
  const [planToDelete, setPlanToDelete] = useState<ShiftPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateEmployeeModalOpen, setIsCreateEmployeeModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<ShiftPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

  // Load user preferences on component mount
  useEffect(() => {
    dispatch(loadUserPreferences());
  }, [dispatch]);

  // Fetch shift plans
  const fetchShiftPlansData = async () => {
    try {
      setIsLoading(true);
      // Dispatch the thunk action without arguments
      await dispatch(fetchShiftPlansAction()).unwrap();
      setError(null);
    } catch (err) {
      console.error('Error fetching shift plans:', err);
      setError('Failed to load shift plans');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchShiftPlansData();
  }, [dispatch]);

  // Load selected plan from localStorage on initial load
  useEffect(() => {
    if (!isLoading && shiftPlans.length > 0) {
      try {
        // Get saved plan ID from localStorage
        const savedPlanId = localStorage.getItem(SELECTED_PLAN_KEY);
        
        if (savedPlanId) {
          // Check if the saved plan exists in the current plans
          const savedPlan = shiftPlans.find((plan: ShiftPlan) => plan.id === savedPlanId);
          
          if (savedPlan) {
            // If the plan exists, select it
            dispatch(setSelectedPlan(savedPlanId));
            onShiftPlanSelect(savedPlan);
          } else {
            // If the saved plan doesn't exist anymore, select the first plan
            dispatch(setSelectedPlan(shiftPlans[0].id));
            onShiftPlanSelect(shiftPlans[0]);
          }
        } else if (!selectedPlanId && shiftPlans.length > 0) {
          // If no plan was saved and none is selected, select the first plan
          dispatch(setSelectedPlan(shiftPlans[0].id));
          onShiftPlanSelect(shiftPlans[0]);
        }
      } catch (error) {
        console.error('Error loading selected plan from localStorage:', error);
      }
    }
  }, [isLoading, shiftPlans, dispatch, onShiftPlanSelect, selectedPlanId]);

  // Fetch shift types when selected plan changes
  useEffect(() => {
    if (selectedPlanId) {
      dispatch(fetchShiftTypesByPlan(selectedPlanId));
    }
  }, [selectedPlanId, dispatch]);

  // Add this function to handle opening the CreateEmployee modal
  const handleOpenCreateEmployee = () => {
    setIsCreateEmployeeModalOpen(true);
    // Close the quick action modal if it's open
    if (isQuickActionModalOpen) {
      dispatch(closeQuickActionModal());
    }
  };

  // Add this function to handle closing the CreateEmployee modal
  const handleCloseCreateEmployee = () => {
    setIsCreateEmployeeModalOpen(false);
  };

  // Add this function to handle successful employee creation
  const handleEmployeeCreationSuccess = () => {
    setIsCreateEmployeeModalOpen(false);
    toast.success('Employee created successfully');
  };

  // Modify the toggleQuickDocuments function to only toggle the Quick Documents visibility
  const toggleQuickDocuments = () => {
    // Update user preferences to toggle the showQuickDocuments setting
    dispatch(updateUserPreferences({
      ...preferences,
      showQuickDocuments: !preferences.showQuickDocuments
    }));
  };

  // Filter plans based on search only (removing status filter)
  const filteredPlans = shiftPlans.filter((plan: ShiftPlan) => {
    // Filter by search term
    if (searchTerm && !plan.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Determine which plans to display based on showAllPlans state
  let displayedPlans: ShiftPlan[] = [];
  let hasSelectedPlanSeparator = false;
  
  if (showAllPlans) {
    // Show all plans when expanded
    displayedPlans = filteredPlans;
  } else {
    // Get the first 3 plans
    const initialPlans = filteredPlans.slice(0, 3);
    
    // Check if the selected plan is in the first 3
    const selectedPlanInInitial = selectedPlanId 
      ? initialPlans.some((plan: ShiftPlan) => plan.id === selectedPlanId)
      : false;
    
    // If selected plan is in the first 3, just show the first 3
    if (selectedPlanInInitial || !selectedPlanId) {
      displayedPlans = initialPlans;
    } else {
      // Otherwise, find the selected plan
      const selectedPlan = filteredPlans.find((plan: ShiftPlan) => plan.id === selectedPlanId);
      
      // Add it to the displayed plans if found
      if (selectedPlan) {
        displayedPlans = [...initialPlans, selectedPlan];
        hasSelectedPlanSeparator = true;
      } else {
        displayedPlans = initialPlans;
      }
    }
  }
  
  // Calculate how many more plans are hidden
  const hiddenPlansCount = filteredPlans.length - (showAllPlans ? filteredPlans.length : Math.min(3, displayedPlans.length));
  const hasMorePlans = hiddenPlansCount > 0;

  // Toggle function for showing all plans
  const toggleShowAllPlans = () => {
    setShowAllPlans(!showAllPlans);
  };

  // Handle shift plan selection
  const handleShiftPlanSelect = (plan: ShiftPlan) => {
    // Save selected plan ID to localStorage
    localStorage.setItem(SELECTED_PLAN_KEY, plan.id);
    
    // Dispatch to Redux store to update the selected plan
    dispatch(setSelectedPlan(plan.id));
    
    // Call the parent component's handler
    onShiftPlanSelect(plan);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!planToDelete) return;
    
    try {
      // Delete the shift plan
      await dispatch(deleteShiftPlanAsync(planToDelete.id)).unwrap();
      
      // Show success message
      toast.success(`Shift plan "${planToDelete.name}" deleted successfully`);
      
      // Clear selection if the deleted plan was selected
      if (selectedPlanId === planToDelete.id) {
        // Find the first available plan that's not the deleted one
        const nextPlan = shiftPlans.find((p: ShiftPlan) => p.id !== planToDelete.id);
        if (nextPlan) {
          // Update localStorage with the new selected plan
          localStorage.setItem(SELECTED_PLAN_KEY, nextPlan.id);
          onShiftPlanSelect(nextPlan);
        } else {
          // If no plans left, clear localStorage and pass null to clear the selection
          localStorage.removeItem(SELECTED_PLAN_KEY);
          onShiftPlanSelect(null as any);
        }
      }
      
      // Close the delete confirmation modal and clear the planToDelete state
      dispatch(closeDeleteConfirmationModal());
      setPlanToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete shift plan: ${error}`);
    }
  };

  // Handle status change
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, plan: ShiftPlan) => {
    e.stopPropagation();
    const newStatus = e.target.value as 'DRAFT' | 'ACTIVE';
    
    try {
      await updateShiftPlanStatus(plan.id, newStatus);
      toast.success(`Plan status updated to ${newStatus === 'DRAFT' ? 'Draft (Admin Only)' : 'Active (Public)'}`);
      fetchShiftPlansData();
    } catch (error) {
      toast.error(`Failed to update plan status: ${error}`);
    }
  };

  // Handle create shift plan success
  const handleCreateShiftPlanSuccess = async (planId: string) => {
    // Refresh the plans list to ensure we have the latest data
    await fetchShiftPlansData();
    
    // Find the newly created plan in the updated list
    const newPlan = shiftPlans.find((p: ShiftPlan) => p.id === planId);
    
    if (newPlan) {
      // Select the new plan
      dispatch(setSelectedPlan(planId));
      localStorage.setItem(SELECTED_PLAN_KEY, planId);
      handleShiftPlanSelect(newPlan);
    }
  };

  // Handle edit button click
  const handleEditPlan = (plan: ShiftPlan) => {
    setPlanToEdit(plan);
    setIsEditModalOpen(true);
  };

  // Handle edit success
  const handleEditSuccess = (updatedPlan: ShiftPlan) => {
    // Update the plan in the Redux store
    dispatch(updatePlanInStore(updatedPlan));
    
    // If this is the currently selected plan, update the selection
    if (selectedPlanId === updatedPlan.id) {
      handleShiftPlanSelect(updatedPlan);
    }
    
    // Close the edit modal
    setIsEditModalOpen(false);
    setPlanToEdit(null);
    
    // Refresh the plans list to ensure we have the latest data
    fetchShiftPlansData();
  };

  if (isLoading) {
    return (
      <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
        <SidebarHeader title="Shift Plans" />
        <div className="flex-1 flex items-center justify-center">
          <PreloaderModals onFinish={() => setIsLoading(false)} />
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
        <SidebarHeader title="Shift Plans" />
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
      {/* Header */}
      <SidebarHeader title="Shift Plans" />

      {/* Scrollable Content */}
      <div 
        className={`flex-1 p-3 space-y-3 ${styles.customScrollbar}`}
        style={{
          overflowY: 'auto'
        }}
      >
        {/* Shift Plans List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Your Shift Plans</h3>
            <button 
              onClick={() => dispatch(openCreateShiftModal())}
              className="p-1 hover:bg-gray-50 rounded-lg"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {shiftPlans.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No shift plans yet</p>
              <span
                onClick={() => dispatch(openCreateShiftModal())}
                className="mt-2 text-xs text-[#0066B3] hover:text-[#0066B3]/80 font-medium cursor-pointer inline-block"
              >
                Create your first plan
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {displayedPlans.map((plan: ShiftPlan, index: number) => (
                <React.Fragment key={plan.id}>
                  {hasSelectedPlanSeparator && index === 3 && (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-xs text-gray-400">Selected Plan</span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                  )}
                  <ShiftPlanItem
                    plan={plan}
                    selectedPlanId={selectedPlanId}
                    onSelect={handleShiftPlanSelect}
                    onStatusChange={handleStatusChange}
                    setPlanToDelete={setPlanToDelete}
                    onEdit={handleEditPlan}
                  />
                </React.Fragment>
              ))}
              
              {hasMorePlans && (
                <button 
                  onClick={toggleShowAllPlans}
                  className="w-full flex items-center justify-center gap-1 p-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  {showAllPlans ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>Show {hiddenPlansCount} More</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Related Actions</h3>
        </div>

        {/* Quick Actions Content */}
        <div className="space-y-0.5">
          <button 
            onClick={handleOpenCreateEmployee}
            className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
          <button 
            onClick={() => dispatch(openCreateShiftModal())}
            className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>Create Schedule</span>
          </button>
        </div>

        {/* Quick Documents */}
        <div>
          <div 
            className="flex items-center justify-between mb-1 cursor-pointer" 
            onClick={toggleQuickDocuments}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900">Quick Documents</h3>
            </div>
            {preferences.showQuickDocuments ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          {preferences.showQuickDocuments && (
            <div className="space-y-0.5">
              <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">└─</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Vacation Request Form</span>
                </div>
              </button>
              <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">└─</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Shift Exchange Form</span>
                </div>
              </button>
              <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">└─</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Overtime Request</span>
                </div>
              </button>
              <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">└─</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Leave Policy</span>
                </div>
              </button>
              <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">└─</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Employee Handbook</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Shift Legend */}
        <ShiftTypesList 
          shiftTypes={shiftTypesList} 
          isVisible={true} 
        />
      </div>

      <CreateShiftPlanModal 
        isOpen={isShiftModalOpen}
        onClose={() => dispatch(closeCreateShiftModal())}
        onSuccess={handleCreateShiftPlanSuccess}
      />
      
      <EditShiftPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        plan={planToEdit}
      />
      
      <ModalSettings
        isOpen={settingsModal.isOpen}
        onClose={() => dispatch(closeSettingsModal())}
        initialTab={settingsModal.initialTab}
        initialItem={settingsModal.initialItem}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen.isOpen}
        onClose={() => {
          dispatch(closeDeleteConfirmationModal());
          setPlanToDelete(null);
        }}
        onConfirm={handleDelete}
        title={deleteModalOpen.title}
        message={deleteModalOpen.message}
        itemName={deleteModalOpen.itemName}
      />

      {/* Add the CreateEmployee modal */}
      <CreateEmployeeModal 
        isOpen={isCreateEmployeeModalOpen}
        onClose={handleCloseCreateEmployee}
        onSuccess={handleEmployeeCreationSuccess}
      />
    </aside>
  );
};
