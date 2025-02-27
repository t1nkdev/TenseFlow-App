'use client';
import { useState } from 'react';
import SidebarShiftTable from '@/components/schedule/SidebarShiftTable';
import ShiftTable from '@/components/schedule/ShiftTable';
import { ShiftPlan } from '@/types/prismaTypes';

export default function ShiftSchedulePage() {
  const [selectedPlan, setSelectedPlan] = useState<ShiftPlan>();

  return (
    <div className="flex-1 flex">
      <SidebarShiftTable
        onShiftPlanSelect={setSelectedPlan}
        selectedPlanId={selectedPlan?.id}
      />
      <ShiftTable selectedPlan={selectedPlan} />
    </div>
  );
}