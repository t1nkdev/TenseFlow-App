'use client';
import { useState } from 'react';
import { Plus, Calendar, Folder, FileText, Settings } from 'lucide-react';
import styles from '@/app/main/shift-schedule/page.module.css';
import CreateShiftPlanModal from '../modals/CreateShiftPlan';
import QuickActionModal from '../modals/QuickActionModal';
import ModalSettings from '../modals/settings/ModalSettings';

type ShiftType = 'M' | 'A' | 'N' | '-';

function ShiftCell({ shift, isMonthView }: { shift: ShiftType; isMonthView: boolean }) {
  const getShiftStyle = () => {
    switch (shift) {
      case 'M':
        return 'bg-blue-50 text-blue-600';
      case 'A':
        return 'bg-green-50 text-green-600';
      case 'N':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getShiftStyle()}`}>
      {shift}
    </div>
  );
}

export default function SidebarShiftTable() {
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
      {/* Scrollable Content */}
      <div 
        className={`flex-1 p-3 space-y-3 ${styles.customScrollbar}`}
        style={{
          overflowY: 'auto'
        }}
      >
        {/* Configuration Section */}
        <div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configuration</span>
          </button>
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center justify-between mb-1">
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
            <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Vacation Request Form</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Shift Exchange Form</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Overtime Request</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Leave Policy</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Employee Handbook</span>
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

        {/* Shift Legend - Not Configured */}
        <div>
          <h4 className="text-xs text-gray-500 mb-2">Shift Legend</h4>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center text-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">No shift types configured</p>
                <p className="text-xs text-gray-400 mt-0.5">Configure shift types in settings first</p>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Configure Shifts
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateShiftPlanModal 
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
      />
      <QuickActionModal 
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
      />
      <ModalSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </aside>
  );
}
