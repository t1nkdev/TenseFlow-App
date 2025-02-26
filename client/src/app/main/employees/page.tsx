'use client';
import { useState } from 'react';
import SidebarEmployees from '@/components/main/employees/SidebarEmployees';
import EmployeesTable from '@/components/main/employees/EmployeesTable';
import SearchFilterEmployees from '@/components/main/employees/SearchFilterEmployees';

export default function Employees() {
  const hasEmployees = false; // This will be dynamic based on your data

  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implement search logic
  };

  const handleFilterDepartment = (value: string) => {
    console.log('Filter Department:', value);
    // Implement department filter
  };

  const handleFilterStatus = (value: string) => {
    console.log('Filter Status:', value);
    // Implement status filter
  };

  return (
    <div className="flex h-full">
      <SidebarEmployees />
      <div className="flex-1 flex flex-col p-6">
        <SearchFilterEmployees 
          onSearch={handleSearch}
          onFilterDepartment={handleFilterDepartment}
          onFilterStatus={handleFilterStatus}
          showFilters={hasEmployees}
        />
        <div className="flex-1 overflow-auto">
          <EmployeesTable />
        </div>
      </div>
    </div>
  );
}
