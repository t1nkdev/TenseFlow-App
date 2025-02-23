'use client';
import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import CreateShiftPlanModal from '../modals/CreateShiftPlan';

export default function ShiftTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">No Shift Plans Created</h3>
            <p className="text-sm text-gray-500 mt-1">Get started by creating your first shift plan</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Create Shift Plan</span>
          </button>
        </div>
      </div>

      <CreateShiftPlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
