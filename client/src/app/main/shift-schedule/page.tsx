'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SidebarShiftTable } from '@/components/schedule/layout/table-sidebar/SidebarShiftTable';
import ShiftTable from '@/components/schedule/layout/calendar-view/ShiftTable';
import { ShiftPlan } from '@/types/prismaTypes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchShiftPlans } from '@/store/features/shifts/shiftsSlice';

export default function ShiftSchedulePage() {
  const dispatch = useAppDispatch();
  const [selectedPlan, setSelectedPlan] = useState<ShiftPlan>();
  const { plans, selectedPlanId } = useAppSelector(state => state.shifts);
  const initialFetchDone = useRef(false);
  const processingPlanSelection = useRef(false);

  // Fetch shift plans on mount - only once
  useEffect(() => {
    if (!initialFetchDone.current) {
      console.log('ShiftSchedulePage - Initial fetch of shift plans');
      dispatch(fetchShiftPlans());
      initialFetchDone.current = true;
    }
  }, [dispatch]);

  // Memoized function to handle plan selection to avoid infinite loops
  const handleShiftPlanSelect = useCallback((plan: ShiftPlan | null) => {
    if (processingPlanSelection.current) return;
    processingPlanSelection.current = true;
    
    try {
      if (!plan) {
        // Clear the selected plan if null is passed
        setSelectedPlan(undefined);
        return;
      }
      
      console.log('ShiftSchedulePage - Selected plan:', plan.name);
      // Ensure dates are properly parsed when selecting a plan
      setSelectedPlan({
        ...plan,
        startDate: new Date(plan.startDate),
        endDate: new Date(plan.endDate)
      });
    } finally {
      processingPlanSelection.current = false;
    }
  }, []);

  // Update selected plan when selectedPlanId changes in Redux store
  useEffect(() => {
    if (processingPlanSelection.current) return;
    
    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find(p => p.id === selectedPlanId);
      if (plan && (!selectedPlan || plan.id !== selectedPlan.id)) {
        handleShiftPlanSelect(plan);
      }
    }
  }, [selectedPlanId, plans, selectedPlan, handleShiftPlanSelect]);

  return (
    <div className="h-full flex">
      <SidebarShiftTable
        onShiftPlanSelect={handleShiftPlanSelect}
        selectedPlanId={selectedPlanId || selectedPlan?.id}
      />
      <main className="flex-1 border-sm border-gray-200">
        <ShiftTable 
          selectedPlan={selectedPlan} 
        />
      </main>
    </div>
  );
}