'use client';
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, Users, Clock, AlertCircle, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LogoPreloader from '../pr/LogoPreloader';

interface CreateShiftPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateShiftPlanModal({ isOpen, onClose }: CreateShiftPlanModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    console.log(formData);
    onClose();
  };

  const handleConfigureDepartments = () => {
    setIsTransitioning(true);
    onClose();
    setTimeout(() => {
      router.push('/main/departments');
    }, 500);
  };

  return (
    <>
      {isTransitioning && <LogoPreloader />}
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
                enterFrom="opacity-0 translate-y-[-50%] scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-[50%] scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                  {/* Header with gradient */}
                  <div className="relative h-24 bg-gradient-to-r from-[#0066B3] to-[#0077CC] p-6">
                    <button
                      onClick={onClose}
                      className="absolute right-6 top-6 text-white/80 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#0066B3]" />
                    </div>
                  </div>

                  <div className="p-6 pt-12">
                    <Dialog.Title className="text-2xl font-semibold text-gray-900">
                      Create New Shift Plan
                    </Dialog.Title>
                    <p className="mt-2 text-gray-500">Set up a new shift schedule for your department.</p>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between px-12 mt-8 mb-8">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                            ${step === item ? 'border-[#0066B3] bg-blue-50 text-[#0066B3]' : 
                              step > item ? 'border-[#0066B3] bg-[#0066B3] text-white' : 
                              'border-gray-200 bg-white text-gray-400'}
                          `}>
                            {step > item ? '✓' : item}
                          </div>
                          {item < 3 && (
                            <div className={`w-24 h-0.5 mx-2 transition-colors ${step > item ? 'bg-[#0066B3]' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                      {/* Step 1: Basic Info */}
                      {step === 1 && (
                        <div className="space-y-6">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <ClipboardList className="w-4 h-4 text-[#0066B3]" />
                              Plan Name
                            </label>
                            <input
                              type="text"
                              value={formData.planName}
                              onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                              placeholder="e.g., Q1 2024 Shift Plan"
                            />
                          </div>
                          
                          {!hasDepartments ? (
                            <div className="p-6 bg-blue-50 rounded-xl border border-[#0066B3]/10">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                  <AlertCircle className="w-6 h-6 text-[#0066B3]" />
                                </div>
                                <div>
                                  <h3 className="text-base font-medium text-gray-900">No Departments Configured</h3>
                                  <p className="text-sm text-gray-600 mt-0.5">Please configure departments first to create a shift plan</p>
                                  <button 
                                    type="button"
                                    onClick={handleConfigureDepartments}
                                    className="mt-3 text-sm text-[#0066B3] hover:text-[#0066B3]/90 font-medium"
                                  >
                                    Configure Departments →
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 text-[#0066B3]" />
                                Department
                              </label>
                              <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
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
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 text-[#0066B3]" />
                                Start Date
                              </label>
                              <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                              />
                            </div>
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 text-[#0066B3]" />
                                End Date
                              </label>
                              <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Shift Type */}
                      {step === 3 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, shiftType: 'rotating' })}
                              className={`p-6 border-2 rounded-xl text-left transition-all ${
                                formData.shiftType === 'rotating' 
                                  ? 'border-[#0066B3] bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Clock className="w-8 h-8 text-[#0066B3] mb-3" />
                              <h3 className="text-lg font-medium text-gray-900">Rotating Shifts</h3>
                              <p className="text-sm text-gray-500 mt-2">
                                Employees rotate between different shifts periodically
                              </p>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, shiftType: 'fixed' })}
                              className={`p-6 border-2 rounded-xl text-left transition-all ${
                                formData.shiftType === 'fixed' 
                                  ? 'border-[#0066B3] bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Calendar className="w-8 h-8 text-[#0066B3] mb-3" />
                              <h3 className="text-lg font-medium text-gray-900">Fixed Shifts</h3>
                              <p className="text-sm text-gray-500 mt-2">
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
                          className={`px-6 py-2.5 text-sm font-medium rounded-xl border border-gray-200 ${
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
                          className={`px-6 py-2.5 text-sm font-medium rounded-xl ${
                            !hasDepartments && step === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#0066B3] text-white hover:bg-[#0066B3]/90'
                          } transition-colors`}
                        >
                          {step === 3 ? 'Create Plan' : 'Next'}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
