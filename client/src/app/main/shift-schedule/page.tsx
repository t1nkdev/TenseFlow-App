'use client';
import ShiftTable from '@/components/schedule/ShiftTable';
import SidebarShiftTable from '@/components/schedule/SidebarShiftTable';

export default function DashboardDemo() {
  return (
    <div className="w-full h-full">
      <div className="flex bg-white h-full">
        <SidebarShiftTable />
        <ShiftTable />
      </div>
    </div>
  );
}