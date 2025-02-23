'use client';
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, Users, Clock, AlertCircle } from 'lucide-react';

interface CreateShiftPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateShiftPlanModal({ isOpen, onClose }: CreateShiftPlanModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    planName: '',
    department: '',
    startDate: '',
    endDate: '',
    shiftType: 'rotating' // or 'fixed'
  });

  // Mock state - in real app this would come from your data store
  const hasDepartments = false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose();
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
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Create New Shift Plan
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between px-12 mb-8">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${step === item ? 'bg-blue-50 text-[#0066B3]' : 
                            step > item ? 'bg-[#0066B3] text-white' : 
                            'bg-gray-100 text-gray-400'}
                        `}>
                          {step > item ? '✓' : item}
                        </div>
                        {item < 3 && (
                          <div className={`w-24 h-0.5 mx-2 ${step > item ? 'bg-[#0066B3]' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          value={formData.planName}
                          onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="e.g., Q1 2024 Shift Plan"
                        />
                      </div>
                      
                      {!hasDepartments ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">No Departments Configured</h3>
                              <p className="text-xs text-gray-500 mt-0.5">Please configure departments first to create a shift plan</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="mt-3 text-sm text-[#0066B3] hover:text-[#0066B3]/90 font-medium"
                          >
                            Configure Departments
                          </button>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="">Select Department</option>
                            <option value="engineering">Engineering</option>
                            <option value="support">Support</option>
                            <option value="operations">Operations</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Date Range */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Shift Type */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, shiftType: 'rotating' })}
                          className={`p-4 border rounded-xl text-left ${
                            formData.shiftType === 'rotating' 
                              ? 'border-[#0066B3] bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Clock className="w-6 h-6 text-[#0066B3] mb-2" />
                          <h3 className="font-medium text-gray-900">Rotating Shifts</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Employees rotate between different shifts periodically
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, shiftType: 'fixed' })}
                          className={`p-4 border rounded-xl text-left ${
                            formData.shiftType === 'fixed' 
                              ? 'border-[#0066B3] bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Calendar className="w-6 h-6 text-[#0066B3] mb-2" />
                          <h3 className="font-medium text-gray-900">Fixed Shifts</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Employees maintain the same shift schedule
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        step === 1 
                          ? 'invisible' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 3) {
                          handleSubmit(event as any);
                        } else {
                          setStep(step + 1);
                        }
                      }}
                      disabled={!hasDepartments && step === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        !hasDepartments && step === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#0066B3] text-white hover:bg-[#0066B3]/90'
                      } transition-colors`}
                    >
                      {step === 3 ? 'Create Plan' : 'Next'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
