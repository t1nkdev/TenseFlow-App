'use client';
import React from 'react';
import { Trash2, Building2, Edit } from 'lucide-react';
import { ShiftPlan } from '@/types/prismaTypes';
import { openDeleteConfirmationModal } from '@/store/features/ui/uiSlice';
import { useAppDispatch } from '@/store/hooks';

interface ShiftPlanItemProps {
  plan: ShiftPlan;
  selectedPlanId?: string;
  onSelect: (plan: ShiftPlan) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>, plan: ShiftPlan) => void;
  setPlanToDelete: (plan: ShiftPlan | null) => void;
  onEdit: (plan: ShiftPlan) => void;
}

export default function ShiftPlanItem({
  plan,
  selectedPlanId,
  onSelect,
  onStatusChange,
  setPlanToDelete,
  onEdit
}: ShiftPlanItemProps) {
  const dispatch = useAppDispatch();
  
  // Check if this plan is selected by comparing IDs directly
  const isSelected = plan.id === selectedPlanId;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlanToDelete(plan);
    dispatch(openDeleteConfirmationModal({
      title: 'Delete Shift Plan',
      message: 'Are you sure you want to delete this shift plan? This action cannot be undone.',
      itemName: plan.name
    }));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(plan);
  };

  return (
    <button
      key={plan.id}
      onClick={() => onSelect(plan)}
      className={`w-full p-3 rounded-lg text-left transition-all ${
        isSelected
          ? 'bg-blue-50 border border-blue-100'
          : 'hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`text-sm font-medium ${
            isSelected ? 'text-[#0066B3]' : 'text-gray-900'
          }`}>
            {plan.name}
          </h4>
          <div className="flex items-center mt-1">
            {plan.departments && plan.departments.length > 0 ? (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Building2 className="w-3 h-3" />
                {plan.departments.length === 1 
                  ? plan.departments[0].department.name 
                  : `${plan.departments.length} Departments`
                }
              </div>
            ) : plan.department ? (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Building2 className="w-3 h-3" />
                {plan.department.name}
              </div>
            ) : (
              <span className="text-xs text-gray-400">No department</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <select
              className={`text-xs px-1 py-0.5 rounded ${
                plan.status === 'DRAFT' 
                  ? 'bg-gray-100 text-gray-600' 
                  : plan.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
              }`}
              value={plan.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onStatusChange(e, plan)}
            >
              <option value="DRAFT">Edit Mode</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
          <div className="flex mt-1.5 gap-1">
            <div
              onClick={handleEditClick}
              className="p-1 text-gray-400 hover:text-blue-500 rounded cursor-pointer"
              title="Edit shift plan"
            >
              <Edit className="w-3 h-3" />
            </div>
            <div
              onClick={handleDeleteClick}
              className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer"
              title="Delete shift plan"
            >
              <Trash2 className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
} 