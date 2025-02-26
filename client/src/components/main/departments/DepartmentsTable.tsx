'use client';
import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import CreateDepartmentModal from '@/components/modals/departments/CreateDepartment';

export default function DepartmentsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center text-center gap-3 -mt-20">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">No Departments Added</h3>
            <p className="text-sm text-gray-500 mt-1">Get started by adding your first department</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Department</span>
          </button>
        </div>
      </div>

      <CreateDepartmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 