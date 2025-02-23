'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Plus, Users, Building2, FileText, Calendar, ClipboardList, Settings } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const predefinedActions = [
  {
    name: 'Add Department',
    icon: Building2,
    description: 'Create a new department',
    category: 'Organization'
  },
  {
    name: 'Add Employee',
    icon: Users,
    description: 'Add new employee to system',
    category: 'Organization'
  },
  {
    name: 'Create Report',
    icon: FileText,
    description: 'Generate new report',
    category: 'Documents'
  },
  {
    name: 'Schedule Meeting',
    icon: Calendar,
    description: 'Schedule team meeting',
    category: 'Planning'
  },
  {
    name: 'Task List',
    icon: ClipboardList,
    description: 'Manage task assignments',
    category: 'Planning'
  },
  {
    name: 'Department Settings',
    icon: Settings,
    description: 'Configure department settings',
    category: 'Settings'
  }
];

export default function QuickActionModal({ isOpen, onClose }: QuickActionModalProps) {
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Add Quick Action
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Select an action to add to your quick access sidebar
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {predefinedActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Handle adding action
                        onClose();
                      }}
                      className="flex items-start gap-3 p-4 text-left border border-gray-200 rounded-xl hover:border-[#0066B3] hover:bg-blue-50 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-white">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{action.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                        <span className="inline-block text-[11px] text-gray-400 mt-2 bg-gray-50 px-2 py-0.5 rounded-full">
                          {action.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
