'use client';
import React, { useState } from 'react';
import { Plus, Calendar, Folder, FileText, Settings } from 'lucide-react';
import styles from '@/app/main/shift-schedule/page.module.css';
import CreateShiftPlanModal from '../modals/CreateShiftPlan';
import QuickActionModal from '../modals/QuickActionModal';
import ModalSettings from '../modals/settings/ModalSettings';
import { useShiftTypes } from '@/context/ShiftTypesContext';

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
  const { shiftTypes } = useShiftTypes();

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
