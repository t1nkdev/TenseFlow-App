'use client';
import EmployeesTable from '@/components/main/employees/EmployeesTable';
import SidebarEmployees from '@/components/main/employees/SidebarEmployees';

export default function EmployeesPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarEmployees />
      <div className="flex-1 overflow-hidden bg-gray-50">
        <EmployeesTable />
      </div>
    </div>
  );
}
