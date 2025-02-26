'use client';
import DepartmentsTable from '@/components/main/departments/DepartmentsTable';
import SearchFilterDepartments from '@/components/main/departments/SearchFilterDepartments';
import SidebarDepartments from '@/components/main/departments/SidebarDepartments';

export default function DepartmentsPage() {
  return (
    <div className="flex h-full">
      <SidebarDepartments />
      <div className="flex-1 flex flex-col p-8">
        <SearchFilterDepartments 
          onSearch={() => {}}
          onFilterStatus={() => {}}
          showFilters={false}
        />
        <DepartmentsTable />
      </div>
    </div>
  );
}
