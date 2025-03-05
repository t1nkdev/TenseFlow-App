'use client';
import { useState } from 'react';
import { Plus, Users, Folder, FileText, Settings, Filter, UserPlus, Building2, ShieldCheck, UserCog, ChevronDown, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserPreferences } from '@/store/features/user/userSlice';
import CreateEmployeeModal from '../../modals/employees/CreateEmployee';
import CreateRolesModal from '../../modals/employees/CreateRolesEmployee';
import ModalSettings from '../../modals/settings/ModalSettings';

export default function SidebarEmployees() {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state: any) => state.user);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add toggle function for Quick Documents
  const toggleQuickDocuments = () => {
    dispatch(updateUserPreferences({
      ...preferences,
      showEmployeeQuickDocuments: !preferences.showEmployeeQuickDocuments
    }));
  };

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
        {/* Employee Functions */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCog className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Employee Functions</h3>
          </div>
          <div className="space-y-0.5">
            <button 
              onClick={() => setIsQuickActionModalOpen(true)}
              className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
            <button className="w-full flex items-center gap-2 p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Building2 className="w-4 h-4" />
              <span>Manage Departments</span>
            </button>
            <button 
              onClick={() => setIsRolesModalOpen(true)}
              className="w-full flex items-center justify-between p-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Manage Roles</span>
              </div>
              <span className="px-1.5 py-0.5 text-[11px] font-medium bg-orange-100 text-orange-600 rounded">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* Quick Documents */}
        <div>
          <div 
            className="flex items-center justify-between mb-1 cursor-pointer" 
            onClick={toggleQuickDocuments}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900">Quick Documents</h3>
            </div>
            {preferences.showEmployeeQuickDocuments ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          {preferences.showEmployeeQuickDocuments && (
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
          )}
        </div>
      </div>

      <CreateEmployeeModal 
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
        onSuccess={() => {
          setIsQuickActionModalOpen(false);
          // Refresh employee list if needed
        }}
      />

      <CreateRolesModal
        isOpen={isRolesModalOpen}
        onClose={() => setIsRolesModalOpen(false)}
        onSuccess={() => {
          setIsRolesModalOpen(false);
          // Refresh roles list if needed
        }}
      />

      <ModalSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={0}
        initialItem={1}
      />
    </aside>
  );
}
