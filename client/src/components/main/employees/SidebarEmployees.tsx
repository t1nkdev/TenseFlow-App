'use client';
import { useState } from 'react';
import { Plus, Users, Folder, FileText, Settings, Filter, UserPlus, Building2, ShieldCheck } from 'lucide-react';
import CreateEmployeeModal from '../../modals/employees/CreateEmployee';
import ModalSettings from '../../modals/settings/ModalSettings';

export default function SidebarEmployees() {
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <aside className="w-72 border-r border-gray-200 flex flex-col bg-white shrink-0">
      {/* Added Header Design - Same as Departments */}
      <div className="p-3 pl-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#0066B3]" />
            <h1 className="text-lg font-semibold text-gray-900">Employees</h1>
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
              <UserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
            <button className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Building2 className="w-4 h-4" />
              <span>Manage Departments</span>
            </button>
          </div>
        </div>

        {/* Employee Settings */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Employee Settings</h3>
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Users className="w-4 h-4" />
              <span>All Employees</span>
            </button>
            <button className="w-full flex items-center justify-between p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Permissions</span>
              </div>
              <span className="px-1.5 py-0.5 text-[11px] font-medium bg-orange-100 text-orange-600 rounded">
                NEW
              </span>
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
                <span>Employee Contract</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Onboarding Checklist</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Benefits Guide</span>
              </div>
            </button>
            <button className="w-full flex items-start gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg group">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">└─</span>
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Company Policies</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Filters</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Department</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Status</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Role</label>
              <select className="w-full text-sm border-gray-200 rounded-lg">
                <option>All Roles</option>
                <option>Manager</option>
                <option>Team Lead</option>
                <option>Employee</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <CreateEmployeeModal 
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
