'use client';
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  X, Users, Building2, Calendar, Clock, ChevronRight, Plus, Settings2,
  Bell, Shield, Briefcase, Globe, Mail, Phone, UserCog, FileText, CalendarDays,
  Repeat, Timer, BarChart, Zap, ChartBar
} from 'lucide-react';
import React from 'react';
import { getEmployees } from '@/api/employees';
import { getDepartments } from '@/api/departments';
import CreateShiftTypes from './Scheduling/CreateShiftTypes';
import ScheduleRules from './Scheduling/ScheduleRules';
import TimeZones from './Scheduling/TimeZones';
import UserRoles from './System/UserRoles';
import LeaveManagement from './Scheduling/LeaveManagement';
import RotationPatterns from './Scheduling/RotationPatterns';
import BreakManagement from './Scheduling/BreakManagement';
import WorkloadAnalysis from './Scheduling/WorkloadAnalysis';
import NotificationSettings from './Notifications/NotificationSettings';
import EmailSettings from './Notifications/EmailSettings';
import SMSSettings from './Notifications/SMSSettings';
import AlertRules from './Notifications/AlertRules';
import CreateEmployee from '../employees/CreateEmployee';
import { useRouter } from 'next/navigation';


interface ModalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: any;
  initialItem?: any;
}

const tabs = [
  {
    name: 'Organization',
    icon: Building2,
    items: [
      { name: 'Departments', icon: Building2, description: 'Manage departments and their settings' },
      { name: 'Employees', icon: Users, description: 'Manage employee information and roles' },
      { name: 'Positions', icon: Briefcase, description: 'Configure job positions and roles' }
    ]
  },
  {
    name: 'Scheduling',
    icon: Calendar,
    items: [
      { name: 'Shift Types', icon: Clock, description: 'Configure shift types and schedules' },
      { name: 'Schedule Rules', icon: Shield, description: 'Set scheduling policies and rules' },
      { name: 'Time Zones', icon: Globe, description: 'Manage time zones and working hours' },
      { name: 'Leave Management', icon: CalendarDays, description: 'Configure vacation and leave request settings' },
      { name: 'Rotation Patterns', icon: Repeat, description: 'Set up recurring shift rotation patterns' },
      { name: 'Break Management', icon: Timer, description: 'Configure break times and durations' },
      { name: 'Workload Analysis', icon: BarChart, description: 'View and manage employee workload distribution' }
    ]
  },
  {
    name: 'Notifications',
    icon: Bell,
    items: [
      { name: 'Email Settings', icon: Mail, description: 'Configure email notifications' },
      { name: 'SMS Settings', icon: Phone, description: 'Configure SMS alerts' },
      { name: 'Alert Rules', icon: Bell, description: 'Set up notification rules' }
    ]
  },
  {
    name: 'System',
    icon: Settings2,
    items: [
      { name: 'User Roles', icon: UserCog, description: 'Manage user permissions and access' },
      { name: 'Reports', icon: FileText, description: 'Configure report settings' }
    ]
  }
];

export default function ModalSettings({ isOpen, onClose, initialTab = 0, initialItem = 0 }: ModalSettingsProps) {
  const router = useRouter();
  const initialTabIndex = typeof initialTab === 'string' ? 
    tabs.findIndex(tab => tab.name.toLowerCase() === initialTab.toLowerCase()) : 
    initialTab;
  
  const safeInitialTab = initialTabIndex >= 0 && initialTabIndex < tabs.length ? initialTabIndex : 0;
  
  const [selectedTab, setSelectedTab] = useState(safeInitialTab);
  
  const initialItemIndex = typeof initialItem === 'string' && tabs[safeInitialTab] ? 
    tabs[safeInitialTab].items.findIndex(item => item.name.toLowerCase() === initialItem.toLowerCase()) : 
    initialItem;
  
  const safeInitialItem = initialItemIndex >= 0 && tabs[safeInitialTab] && 
    initialItemIndex < tabs[safeInitialTab].items.length ? initialItemIndex : 0;
  
  const [selectedItem, setSelectedItem] = useState(safeInitialItem);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isEmployeeTableOpen, setIsEmployeeTableOpen] = useState(false);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [employeesData, departmentsData] = await Promise.all([
        getEmployees(),
        getDepartments()
      ]);
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset selections when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      const newTabIndex = typeof initialTab === 'string' ? 
        tabs.findIndex(tab => tab.name.toLowerCase() === initialTab.toLowerCase()) : 
        initialTab;
      
      const safeNewTab = newTabIndex >= 0 && newTabIndex < tabs.length ? newTabIndex : 0;
      
      setSelectedTab(safeNewTab);
      
      const newItemIndex = typeof initialItem === 'string' && tabs[safeNewTab] ? 
        tabs[safeNewTab].items.findIndex(item => item.name.toLowerCase() === initialItem.toLowerCase()) : 
        initialItem;
      
      const safeNewItem = newItemIndex >= 0 && tabs[safeNewTab] && 
        newItemIndex < tabs[safeNewTab].items.length ? newItemIndex : 0;
      
      setSelectedItem(safeNewItem);
    }
  }, [isOpen, initialTab, initialItem]);

  const handleShowAllEmployees = () => {
    onClose(); // Close the settings modal
    router.push('/main/employees'); // Navigate to employees page
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="flex h-[800px]">
                  {/* Main Navigation */}
                  <div className="w-[280px] border-r border-gray-200">
                    <div className="pt-8 pb-4">
                      <div className="px-6 flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
                          <p className="text-sm text-gray-500 mt-1">Manage your workspace settings</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="mt-6">
                        {tabs.map((tab, index) => (
                          <div key={tab.name} className="mb-2">
                            <button
                              onClick={() => {
                                setSelectedTab(index);
                                setSelectedItem(0);
                              }}
                              className={`w-full flex items-center justify-between px-6 py-2.5 text-left transition-colors
                                ${selectedTab === index ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <tab.icon className={`w-5 h-5 ${selectedTab === index ? 'text-[#0066B3]' : 'text-gray-400'}`} />
                                <span className={`text-sm font-medium ${selectedTab === index ? 'text-[#0066B3]' : 'text-gray-700'}`}>
                                  {tab.name}
                                </span>
                              </div>
                              <ChevronRight className={`w-4 h-4 ${selectedTab === index ? 'text-[#0066B3]' : 'text-gray-400'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sub Navigation */}
                  <div className="w-[240px] border-r border-gray-200 bg-gray-50">
                    <div className="pt-12 pb-4">
                      <div className="px-4">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          {tabs[selectedTab].name}
                        </h3>
                      </div>
                      <div className="mt-4 px-2">
                        {tabs[selectedTab].items.map((item, itemIndex) => (
                          <button
                            key={item.name}
                            onClick={() => setSelectedItem(itemIndex)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left mb-1 transition-all
                              ${selectedItem === itemIndex 
                                ? 'bg-white shadow-sm text-[#0066B3] border border-gray-100' 
                                : 'text-gray-600 hover:bg-white hover:shadow-sm hover:border hover:border-gray-100'}`}
                          >
                            <div className="w-4 h-4 text-[#0066B3]">
                              {React.createElement(item.icon)}
                            </div>
                            <span className="text-sm font-medium">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Area with Footer */}
                  <div className="flex-1 flex flex-col bg-white">
                    {/* Scrollable Content */}
                    <div className="flex-1 pt-12 pb-6 px-8 overflow-y-auto">
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-[#0066B3]/10 flex items-center justify-center">
                            {React.createElement(tabs[selectedTab].items[selectedItem].icon, {
                              className: "w-5 h-5 text-[#0066B3]"
                            })}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                              {tabs[selectedTab].items[selectedItem].name}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {tabs[selectedTab].items[selectedItem].description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Content Based on Selection */}
                      <div className="space-y-6">
                        {selectedTab === 0 && selectedItem === 0 && departments.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl border-2 border-dashed border-gray-200">
                            <div className="p-4 bg-blue-50 rounded-xl mb-4">
                              <Building2 className="w-8 h-8 text-[#0066B3]" />
                            </div>
                            <h3 className="text-base font-medium text-gray-900">No Departments Created</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4 max-w-sm">
                              Create departments to organize your employees and manage their schedules effectively
                            </p>
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066B3] text-white rounded-xl hover:bg-[#0066B3]/90 transition-colors">
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-medium">Create Department</span>
                            </button>
                          </div>
                        )}

                        {selectedTab === 0 && selectedItem === 0 && departments.length > 0 && (
                          <div className="space-y-6">
                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                              <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-[#0066B3]" />
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900">Department Management</h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Configure department settings, structure, and assignments. Manage department information and hierarchy.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0066B3]/20 hover:bg-blue-50/50 transition-colors group">
                                <Building2 className="w-6 h-6 text-[#0066B3] mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">Structure Management</h3>
                                <p className="text-xs text-gray-500">Configure department hierarchy and structure</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0066B3]/20 hover:bg-blue-50/50 transition-colors group">
                                <Users className="w-6 h-6 text-[#0066B3] mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">Employee Assignment</h3>
                                <p className="text-xs text-gray-500">Manage department members and roles</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0066B3]/20 hover:bg-blue-50/50 transition-colors group">
                                <ChartBar className="w-6 h-6 text-[#0066B3] mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">Department Analytics</h3>
                                <p className="text-xs text-gray-500">View department performance and metrics</p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066B3] text-white rounded-xl hover:bg-[#0066B3]/90 transition-colors">
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">Add New Department</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedTab === 0 && selectedItem === 1 && employees.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl border-2 border-dashed border-gray-200">
                            <div className="p-4 bg-blue-50 rounded-xl mb-4">
                              <Users className="w-8 h-8 text-[#0066B3]" />
                            </div>
                            <h3 className="text-base font-medium text-gray-900">No Employees Created</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4 max-w-sm">
                              Add employees to your organization and assign them to departments
                            </p>
                            <button 
                              onClick={() => setIsCreateEmployeeOpen(true)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066B3] text-white rounded-xl hover:bg-[#0066B3]/90 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-medium">Add Employee</span>
                            </button>
                          </div>
                        )}

                        {selectedTab === 0 && selectedItem === 1 && employees.length > 0 && (
                          <div className="space-y-6">
                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                              <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-[#0066B3]" />
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900">Employee Management</h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Configure employee settings, roles, and permissions. Manage employee information and access levels.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0066B3]/20 hover:bg-blue-50/50 transition-colors group">
                                <UserCog className="w-6 h-6 text-[#0066B3] mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">Role Management</h3>
                                <p className="text-xs text-gray-500">Configure employee roles and permissions</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0066B3]/20 hover:bg-blue-50/50 transition-colors group">
                                <Building2 className="w-6 h-6 text-[#0066B3] mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">Department Assignment</h3>
                                <p className="text-xs text-gray-500">Manage employee department assignments</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-200 hover:border-[#0066B3]/20 hover:bg-blue-50/50 transition-colors group">
                                <Shield className="w-6 h-6 text-[#0066B3] mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">Access Control</h3>
                                <p className="text-xs text-gray-500">Set up employee access and permissions</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <button 
                                onClick={handleShowAllEmployees}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                              >
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">Show All Employees</span>
                              </button>

                              <button 
                                onClick={() => setIsCreateEmployeeOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066B3] text-white rounded-xl hover:bg-[#0066B3]/90 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">Add New Employee</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Add EmployeesTable modal */}
                        

                        {selectedTab === 1 && selectedItem === 0 && (
                          <div className="space-y-6">
                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                              <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#0066B3]" />
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900">Shift Types Configuration</h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Create and manage different types of shifts for your organization.
                                    Each shift type can have its own color, timing, and code.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <CreateShiftTypes />
                          </div>
                        )}

                        {selectedTab === 1 && selectedItem === 1 && (
                          <ScheduleRules />
                        )}

                        {selectedTab === 1 && selectedItem === 2 && (
                          <TimeZones />
                        )}

                        {selectedTab === 1 && selectedItem === 3 && (
                          <LeaveManagement />
                        )}

                        {selectedTab === 1 && selectedItem === 4 && (
                          <RotationPatterns />
                        )}

                        {selectedTab === 1 && selectedItem === 5 && (
                          <BreakManagement />
                        )}

                        {selectedTab === 1 && selectedItem === 6 && (
                          <WorkloadAnalysis />
                        )}

                        {selectedTab === 2 && selectedItem === 0 && (
                          <EmailSettings />
                        )}

                        {selectedTab === 2 && selectedItem === 1 && (
                          <SMSSettings />
                        )}

                        {selectedTab === 2 && selectedItem === 2 && (
                          <AlertRules />
                        )}

                        {selectedTab === 3 && selectedItem === 0 && (
                          <UserRoles />
                        )}

                        {/* Add more content sections for other tabs/items */}
                      </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="border-t border-gray-200 bg-white p-4 px-8">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Changes are saved automatically
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              // Add your save logic here
                              onClose();
                            }}
                            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-[#0066B3] text-white hover:bg-[#0066B3]/90 transition-colors inline-flex items-center gap-2"
                          >
                            Save Changes
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add CreateEmployee modal */}
                <CreateEmployee 
                  isOpen={isCreateEmployeeOpen}
                  onClose={() => setIsCreateEmployeeOpen(false)}
                  onSuccess={() => {
                    setIsCreateEmployeeOpen(false);
                    fetchData(); // Refresh the employee list
                  }}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
