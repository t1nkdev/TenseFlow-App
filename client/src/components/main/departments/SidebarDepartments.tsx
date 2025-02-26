'use client';
import { useState } from 'react';
import { Plus, Users, Folder, FileText, Building2, ChartBar, Settings } from 'lucide-react';
import CreateDepartmentModal from '../../modals/departments/CreateDepartment';
import ModalSettings from '../../modals/settings/ModalSettings';

export default function SidebarDepartments() {
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
      {/* Nicer Header Design */}
      <div className="p-3 pl-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#0066B3]" />
            <h1 className="text-lg font-semibold text-gray-900">Departments</h1>
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

      <div className="flex-1 p-3 space-y-3">
        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
            <button 
              onClick={() => setIsQuickActionModalOpen(true)}
              className="p-1 hover:bg-gray-50 rounded-lg"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Building2 className="w-4 h-4" />
              <span>Add Department</span>
            </button>
            <button className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <ChartBar className="w-4 h-4" />
              <span>Department Reports</span>
            </button>
          </div>
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
                <span>Department Guidelines</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Org Structure</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Filters</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Location</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Locations</option>
                <option>Headquarters</option>
                <option>Remote</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">All Departments</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <CreateDepartmentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <ModalSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </aside>
  );
} 