'use client';
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, Users, Clock, AlertCircle, ClipboardList, ChevronRight, Building2, Check, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LogoPreloader from '../../pr/LogoPreloader';
import { createShiftPlan } from '@/api/shiftPlans';
import { getDepartments } from '@/api/departments';
import { Department } from '@/types/prismaTypes';
import React from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { updatePlanDepartments } from '@/store/features/shifts/shiftsSlice';

// Move form data outside component to prevent re-renders
const initialFormData = {
  name: '',
  departmentIds: [] as string[],
  startDate: '',
  endDate: '',
  shiftType: 'rotating' as 'rotating' | 'fixed',
  status: 'ACTIVE'
};

export interface CreateShiftPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (planId: string) => void;
}

interface FormErrors {
  name?: string;
  departmentIds?: string;
  startDate?: string;
  endDate?: string;
  general?: string;
}

export default function CreateShiftPlanModal({ isOpen, onClose, onSuccess }: CreateShiftPlanModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState(initialFormData);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
    } else {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
      isValid = false;
    }

    if (!formData.departmentIds.length) {
      newErrors.departmentIds = 'Please select at least one department';
      isValid = false;
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
      isValid = false;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate + 'T00:00:00');
      const end = new Date(formData.endDate + 'T00:00:00');
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 10); // Max 10 years in the future

      // Set hours to 0 for accurate date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      maxDate.setHours(0, 0, 0, 0);

      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
        isValid = false;
      }

      if (start > maxDate || end > maxDate) {
        newErrors.endDate = 'Dates cannot be more than 10 years in the future';
        isValid = false;
      }

      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        newErrors.startDate = 'Please enter valid dates';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createShiftPlan(formData);
      console.log('Created shift plan:', result);

      if (result.error) {
        setErrors({ general: result.message });
        toast.error(
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Failed to Create Shift Plan</p>
              <p className="text-xs text-white/90 mt-0.5">
                {result.message || 'Please try again or contact support if the issue persists'}
              </p>
            </div>
          </div>,
          {
            position: 'bottom-right',
            style: {
              background: '#ef4444',
              border: 'none',
              color: 'white'
            }
          }
        );
        return;
      }

      toast.success(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Added Shift Plan</p>
            <p className="text-xs text-white/90 mt-0.5">{formData.name} has been added to the system</p>
          </div>
        </div>,
        {
          position: 'bottom-right',
          style: {
            background: '#10b981',
            border: 'none',
            color: 'white'
          }
        }
      );

      // Create departments array for the Redux store
      const departmentsArray = formData.departmentIds.map(id => ({
        departmentId: id,
        department: departments.find(d => d.id === id) || null
      }));

      // Update the departments in the Redux store
      dispatch(updatePlanDepartments({
        planId: result.id,
        departments: departmentsArray
      }));

      // Pass the created plan ID to parent
      onSuccess(result.id);
      onClose();
    } catch (error) {
      console.error('Error creating shift plan:', error);
      toast.error('Failed to create shift plan');
      setErrors({ general: 'An unexpected error occurred' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Show error immediately if required field becomes empty
    if (!value.trim()) {
      switch (name) {
        case 'name':
          setErrors(prev => ({ ...prev, name: 'Plan name is required' }));
          break;
        case 'startDate':
          setErrors(prev => ({ ...prev, startDate: 'Start date is required' }));
          break;
        case 'endDate':
          setErrors(prev => ({ ...prev, endDate: 'End date is required' }));
          break;
      }
    }

    // Validate date range if both dates are present
    if ((name === 'startDate' || name === 'endDate')) {
      let startDate = name === 'startDate' ? value : formData.startDate;
      let endDate = name === 'endDate' ? value : formData.endDate;

      if (startDate && endDate && startDate.length === 10 && endDate.length === 10) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          if (name !== 'endDate' || value.length === 10) {
            if (end <= start) {
              setErrors(prev => ({ ...prev, endDate: 'End date must be after start date' }));
            } else {
              setErrors(prev => ({ ...prev, endDate: undefined }));
            }
          }
        }
      }
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
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
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <Dialog.Panel className="flex w-full max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl">
                  {/* Left Panel - Form */}
                  <div className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <Dialog.Title className="text-2xl font-semibold text-gray-900">
                          New Shift Plan
                        </Dialog.Title>
                        <p className="mt-2 text-sm text-gray-500">
                          Create a new shift schedule for your department
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                      <div className="relative">
                        <div className="absolute left-4 top-4">
                          <ClipboardList className="w-5 h-5 text-gray-400" />
                        </div>
                        <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                          Plan Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                            errors.name 
                              ? 'border-red-300 hover:border-red-400 bg-red-100' 
                              : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                          placeholder="e.g. Q1 2024 Shift Plan"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {!departments.length ? (
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
                        <div className="relative">
                          <div className="absolute left-4 top-4">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                            Departments *
                          </label>
                          <div className={`w-full border ${
                            errors.departmentIds 
                              ? 'border-red-300 hover:border-red-400 bg-red-100' 
                              : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus-within:border-[#0066B3] transition-colors`}>
                            <div className="pl-14 pr-4 pt-5 pb-2">
                              <div className="flex flex-wrap gap-2 min-h-[30px]">
                                {formData.departmentIds.length > 0 ? (
                                  formData.departmentIds.map(deptId => {
                                    const dept = departments.find(d => d.id === deptId);
                                    return dept ? (
                                      <div key={dept.id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#0066B3] rounded-md text-sm">
                                        {dept.name}
                                        <button 
                                          type="button" 
                                          onClick={() => {
                                            const newDeptIds = formData.departmentIds.filter(id => id !== dept.id);
                                            setFormData(prev => ({
                                              ...prev,
                                              departmentIds: newDeptIds
                                            }));
                                            if (newDeptIds.length === 0) {
                                              setErrors(prev => ({
                                                ...prev,
                                                departmentIds: 'Please select at least one department'
                                              }));
                                            }
                                          }}
                                          className="text-[#0066B3]/70 hover:text-[#0066B3]"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : null;
                                  })
                                ) : (
                                  <span className="text-gray-400 text-sm">Select departments...</span>
                                )}
                              </div>
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 max-h-[200px] overflow-y-auto">
                              <div className="space-y-2">
                                {departments.map((dept) => (
                                  <div key={dept.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`dept-${dept.id}`}
                                      checked={formData.departmentIds.includes(dept.id)}
                                      onChange={() => {
                                        const isSelected = formData.departmentIds.includes(dept.id);
                                        let newDeptIds;
                                        
                                        if (isSelected) {
                                          // Remove if already selected
                                          newDeptIds = formData.departmentIds.filter(id => id !== dept.id);
                                        } else {
                                          // Add if not selected
                                          newDeptIds = [...formData.departmentIds, dept.id];
                                        }
                                        
                                        setFormData(prev => ({
                                          ...prev,
                                          departmentIds: newDeptIds
                                        }));
                                        
                                        // Clear error if at least one department is selected
                                        if (newDeptIds.length > 0 && errors.departmentIds) {
                                          setErrors(prev => ({
                                            ...prev,
                                            departmentIds: undefined
                                          }));
                                        } else if (newDeptIds.length === 0) {
                                          setErrors(prev => ({
                                            ...prev,
                                            departmentIds: 'Please select at least one department'
                                          }));
                                        }
                                      }}
                                      className="h-4 w-4 text-[#0066B3] border-gray-300 rounded focus:ring-[#0066B3]"
                                    />
                                    <label htmlFor={`dept-${dept.id}`} className="ml-2 text-sm text-gray-700">
                                      {dept.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {errors.departmentIds && (
                            <p className="mt-1 text-xs text-red-500">{errors.departmentIds}</p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <div className="absolute left-4 top-4">
                            <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                          <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                              errors.startDate 
                                ? 'border-red-300 hover:border-red-400 bg-red-100' 
                                : 'border-gray-200 hover:border-gray-300'
                            } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                          />
                          {errors.startDate && (
                            <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute left-4 top-4">
                            <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                          <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                            End Date *
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                              errors.endDate 
                                ? 'border-red-300 hover:border-red-400 bg-red-100' 
                                : 'border-gray-200 hover:border-gray-300'
                            } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                          />
                          {errors.endDate && (
                            <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-medium text-gray-500">
                          Shift Type *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
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

                      {Object.values(errors).some(error => error !== undefined) && (
                        <div className="mt-8 bg-red-50/50 border border-red-100 rounded-xl overflow-hidden">
                          <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <h4 className="text-sm font-medium text-red-700">Please fix the following errors</h4>
                          </div>
                          <div className="px-4 py-3">
                            <div className="space-y-2">
                              {Object.entries(errors).map(([field, message]) => (
                                message && field !== 'general' && (
                                  <div key={field} className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5" />
                                    <p className="text-sm text-red-600">
                                      {message}
                                    </p>
                                  </div>
                                )
                              ))}
                              {errors.general && (
                                <div className="flex items-start gap-2 pt-2 border-t border-red-100">
                                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                                  <p className="text-sm font-medium text-red-700">
                                    {errors.general}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-4 pt-6">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!departments.length}
                          className={`px-6 py-2.5 text-sm font-medium rounded-lg ${
                            !departments.length
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#0066B3] text-white hover:bg-[#0066B3]/90'
                          } transition-colors inline-flex items-center gap-2`}
                        >
                          Create Plan
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Panel - Preview */}
                  <div className="w-[380px] bg-gray-50 border-l border-gray-100 p-8">
                    <div className="sticky top-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#0066B3]/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-[#0066B3]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Quick Preview</h3>
                          <p className="text-xs text-gray-500">Shift plan information</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                            Plan Details
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-gray-500">Plan Name</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">
                                {formData.name || '—'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Departments</div>
                              <div className="mt-1">
                                {formData.departmentIds.length > 0 ? (
                                  formData.departmentIds.length <= 3 ? (
                                    <div className="text-sm font-medium text-gray-900">
                                      {formData.departmentIds.map(deptId => 
                                        departments.find(d => d.id === deptId)?.name
                                      ).filter(Boolean).join(', ')}
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      {formData.departmentIds.map(deptId => {
                                        const dept = departments.find(d => d.id === deptId);
                                        return dept ? (
                                          <div key={dept.id} className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0066B3]"></div>
                                            <span className="text-sm text-gray-900">{dept.name}</span>
                                          </div>
                                        ) : null;
                                      })}
                                    </div>
                                  )
                                ) : (
                                  <div className="text-sm font-medium text-gray-900">—</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                            Schedule Details
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs text-gray-500">Date Range</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">
                                {formData.startDate ? (
                                  <>
                                    {new Date(formData.startDate).toLocaleDateString()}
                                    {formData.endDate && ` - ${new Date(formData.endDate).toLocaleDateString()}`}
                                  </>
                                ) : '—'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Shift Type</div>
                              <div className="text-sm font-medium text-gray-900 mt-1">
                                {formData.shiftType === 'rotating' ? 'Rotating Shifts' : 'Fixed Shifts'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
