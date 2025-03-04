'use client';
import DepartmentsTable from '@/components/main/departments/DepartmentsTable';
import SidebarDepartments from '@/components/main/departments/SidebarDepartments';

export default function DepartmentsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarDepartments />
      <div className="flex-1 overflow-hidden bg-gray-50">
        <DepartmentsTable />
      </div>
    </div>
  );
}
