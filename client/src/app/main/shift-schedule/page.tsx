'use client';
import ShiftTable from '@/components/schedule/ShiftTable';

export default function DashboardDemo() {
  return (
    <div className="w-full h-full">
      <div className="flex bg-white h-full">
        <ShiftTable />
      </div>
    </div>
  );
}