'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Folder, FileText, Settings, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/app/main/shift-schedule/page.module.css';
import CreateShiftPlanModal from '../modals/CreateShiftPlan';
import QuickActionModal from '../modals/QuickActionModal';
import ModalSettings from '../modals/settings/ModalSettings';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { useShiftTypes } from '@/context/ShiftTypesContext';
import { getShiftPlans, deleteShiftPlan } from '@/api/shiftPlans';
import { ShiftPlan } from '@/types/prismaTypes';

interface SidebarShiftTableProps {
  onShiftPlanSelect: (plan: ShiftPlan) => void;
  selectedPlanId?: string;
}

export default function SidebarShiftTable({ onShiftPlanSelect, selectedPlanId }: SidebarShiftTableProps) {
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<ShiftPlan | null>(null);
  const { shiftTypes } = useShiftTypes();
  const [shiftPlans, setShiftPlans] = useState<ShiftPlan[]>([]);

  useEffect(() => {
    fetchShiftPlans();
  }, []);

  const fetchShiftPlans = async () => {
    try {
      const data = await getShiftPlans();
      setShiftPlans(data);
      // Select the first plan by default if none is selected
      if (data.length > 0 && !selectedPlanId) {
        onShiftPlanSelect(data[0]);
      }
    } catch (error) {
      console.error('Error fetching shift plans:', error);
    }
  };

  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      await deleteShiftPlan(planToDelete.id);
      await fetchShiftPlans();
      toast.success('Shift plan deleted successfully');
      if (selectedPlanId === planToDelete.id) {
        // If the deleted plan was selected, select the first available plan
        if (shiftPlans.length > 0) {
          const nextPlan = shiftPlans.find(plan => plan.id !== planToDelete.id);
          if (nextPlan) {
            onShiftPlanSelect(nextPlan);
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete shift plan');
    } finally {
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
      {/* Updated Header Design with Smaller Settings Button */}
      <div className="p-3 pl-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#0066B3]" />
            <h1 className="text-lg font-semibold text-gray-900">Shift Plans</h1>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#0066B3] transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className={`flex-1 p-3 space-y-3 ${styles.customScrollbar}`}
        style={{
          overflowY: 'auto'
        }}
      >
        {/* Shift Plans List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Your Shift Plans</h3>
            <button 
              onClick={() => setIsShiftModalOpen(true)}
              className="p-1 hover:bg-gray-50 rounded-lg"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {shiftPlans.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No shift plans yet</p>
              <button
                onClick={() => setIsShiftModalOpen(true)}
                className="mt-2 text-xs text-[#0066B3] hover:text-[#0066B3]/80 font-medium"
              >
                Create your first plan
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {shiftPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`w-full rounded-lg transition-all ${
                    selectedPlanId === plan.id
                      ? 'bg-[#0066B3]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    <button
                      onClick={() => onShiftPlanSelect(plan)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedPlanId === plan.id
                          ? 'bg-white/10'
                          : 'bg-blue-50'
                      }`}>
                        <Clock className={`w-4 h-4 ${
                          selectedPlanId === plan.id
                            ? 'text-white'
                            : 'text-[#0066B3]'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          selectedPlanId === plan.id
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}>{plan.name}</h4>
                        <p className={`text-xs mt-0.5 ${
                          selectedPlanId === plan.id
                            ? 'text-white/80'
                            : 'text-gray-500'
                        }`}>
                          {plan.department?.name} • {new Date(plan.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlanToDelete(plan);
                        setDeleteModalOpen(true);
                      }}
                      className={`p-1.5 rounded-lg ${
                        selectedPlanId === plan.id
                          ? 'text-white/80 hover:text-white hover:bg-white/10'
                          : 'text-gray-400 hover:text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          <button 
            onClick={() => setIsQuickActionModalOpen(true)}
            className="p-1 hover:bg-gray-50 rounded-lg"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Quick Actions Content */}
        <div className="space-y-0.5">
          <button className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Plus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
          <button 
            onClick={() => setIsShiftModalOpen(true)}
            className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>Create Schedule</span>
          </button>
        </div>

        {/* Quick Documents */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Folder className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Quick Documents</h3>
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Vacation Request Form</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Shift Exchange Form</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Overtime Request</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Leave Policy</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Employee Handbook</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Filters</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Shift Type</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Shifts</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Night</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Status</option>
                <option>On Duty</option>
                <option>Off Duty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shift Legend */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500">Shift Legend</h4>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs text-[#0066B3] hover:text-[#0066B3]/80 font-medium flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>Configure</span>
            </button>
          </div>
          {shiftTypes.length === 0 ? (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">No shift types configured</p>
                  <p className="text-xs text-gray-400 mt-0.5">Configure shift types in settings first</p>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Configure Shifts
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {shiftTypes.map((shift) => (
                <div 
                  key={shift.id}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-7 h-7 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${shift.color}15` }}
                  >
                    <span className="text-sm font-medium" style={{ color: shift.color }}>
                      {shift.code}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    - {shift.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateShiftPlanModal 
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSuccess={fetchShiftPlans}
      />
      <QuickActionModal 
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
      />
      <ModalSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Shift Plan"
        message="Are you sure you want to delete this shift plan?"
        itemName={planToDelete?.name}
      />
    </aside>
  );
}
