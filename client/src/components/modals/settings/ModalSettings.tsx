'use client';
import { useState } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Users, Building2, Calendar, Clock, ChevronRight, Plus } from 'lucide-react';

interface ModalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  {
    name: 'Departments',
    icon: Building2,
    description: 'Manage departments and their settings'
  },
  {
    name: 'Employees',
    icon: Users,
    description: 'Manage employee information and roles'
  },
  {
    name: 'Shift Types',
    icon: Clock,
    description: 'Configure shift types and schedules'
  },
  {
    name: 'Schedule Settings',
    icon: Calendar,
    description: 'Configure general schedule settings'
  }
];

export default function ModalSettings({ isOpen, onClose }: ModalSettingsProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  // Mock states - in real app these would come from your data store
  const hasDepartments = false;
  const hasEmployees = false;

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="flex h-[600px]">
                  {/* Sidebar */}
                  <div className="w-64 border-r border-gray-200 p-5 space-y-2">
                    <div className="flex items-center justify-between mb-6">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Settings
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {tabs.map((tab, index) => (
                      <button
                        key={tab.name}
                        onClick={() => setSelectedTab(index)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          selectedTab === index 
                            ? 'bg-blue-50 text-[#0066B3]' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{tab.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-6">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">{tabs[selectedTab].name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{tabs[selectedTab].description}</p>
                    </div>

                    {/* Department Settings */}
                    {selectedTab === 0 && (
                      <div className="space-y-4">
                        {!hasDepartments ? (
                          <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-3 bg-gray-100 rounded-lg mb-4">
                              <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">No Departments Created</h3>
                            <p className="text-xs text-gray-500 mt-1 mb-4">Get started by creating your first department</p>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors">
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-medium">Create Department</span>
                            </button>
                          </div>
                        ) : (
                          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#0066B3] hover:bg-blue-50 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white">
                                <Building2 className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <h3 className="text-sm font-medium text-gray-900">Add Department</h3>
                                <p className="text-xs text-gray-500">Create a new department</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Employee Settings */}
                    {selectedTab === 1 && (
                      <div className="space-y-4">
                        {!hasEmployees ? (
                          <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-3 bg-gray-100 rounded-lg mb-4">
                              <Users className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">No Employees Added</h3>
                            <p className="text-xs text-gray-500 mt-1 mb-4">Start by adding employees to your departments</p>
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors">
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-medium">Add Employee</span>
                            </button>
                          </div>
                        ) : (
                          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#0066B3] hover:bg-blue-50 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white">
                                <Users className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="text-left">
                                <h3 className="text-sm font-medium text-gray-900">Add Employee</h3>
                                <p className="text-xs text-gray-500">Add a new employee to the system</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Shift Types Settings */}
                    {selectedTab === 2 && (
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#0066B3] hover:bg-blue-50 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white">
                              <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-medium text-gray-900">Configure Shift Types</h3>
                              <p className="text-xs text-gray-500">Set up different types of shifts</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        {/* Add more shift-related settings */}
                      </div>
                    )}

                    {/* Schedule Settings */}
                    {selectedTab === 3 && (
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#0066B3] hover:bg-blue-50 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white">
                              <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-sm font-medium text-gray-900">Schedule Rules</h3>
                              <p className="text-xs text-gray-500">Configure scheduling rules and policies</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        {/* Add more schedule-related settings */}
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
