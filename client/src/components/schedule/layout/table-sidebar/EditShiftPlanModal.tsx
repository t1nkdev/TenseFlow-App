'use client';
import { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, Users, Clock, AlertCircle, ClipboardList, ChevronRight, Building2, Check, FileText, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShiftPlan, Department } from '@/types/prismaTypes';
import { getDepartments } from '@/api/departments';
import { updateShiftPlan } from '@/api/shiftPlans';
import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updatePlanDepartments } from '@/store/features/shifts/shiftsSlice';

export interface EditShiftPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedPlan: ShiftPlan) => void;
  plan: ShiftPlan | null;
}

interface FormErrors {
  name?: string;
  departmentIds?: string;
  startDate?: string;
  endDate?: string;
  general?: string;
}

export default function EditShiftPlanModal({ isOpen, onClose, onSuccess, plan }: EditShiftPlanModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    departmentIds: [] as string[],
    startDate: '',
    endDate: '',
    shiftType: 'rotating' as 'rotating' | 'fixed',
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE'
  });
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments');
      }
    };
    
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  // Set form data when plan changes
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        departmentIds: plan.departments ? plan.departments.map((d: any) => d.departmentId) : 
                      plan.department ? [plan.department.id] : [],
        startDate: new Date(plan.startDate).toISOString().split('T')[0],
        endDate: new Date(plan.endDate).toISOString().split('T')[0],
        shiftType: plan.shiftType || 'rotating',
        status: plan.status || 'DRAFT'
      });
    }
  }, [plan]);

  // Update selected and available departments when departments or form data changes
  useEffect(() => {
    if (departments.length > 0 && formData.departmentIds.length > 0) {
      const selected = departments.filter(dept => formData.departmentIds.includes(dept.id));
      setSelectedDepartments(selected);
      
      const available = departments.filter(dept => !formData.departmentIds.includes(dept.id));
      setAvailableDepartments(available);
    } else {
      setSelectedDepartments([]);
      setAvailableDepartments(departments);
    }
  }, [departments, formData.departmentIds]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }
    
    if (formData.departmentIds.length === 0) {
      newErrors.departmentIds = 'At least one department must be selected';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Update the shift plan
      const result = await updateShiftPlan(plan!.id, {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        departmentIds: formData.departmentIds,
        shiftType: formData.shiftType,
        status: formData.status
      });

      toast.success(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Updated Shift Plan</p>
            <p className="text-xs text-white/90 mt-0.5">{formData.name} has been updated</p>
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

      // Create a complete updated plan object with departments
      const updatedPlan = {
        ...result,
        departments: formData.departmentIds.map(id => ({
          departmentId: id,
          department: departments.find(d => d.id === id) || null
        }))
      };

      // Update the departments in the Redux store
      dispatch(updatePlanDepartments({
        planId: plan!.id,
        departments: updatedPlan.departments
      }));

      // Pass the updated plan to the onSuccess callback
      onSuccess(updatedPlan);
      onClose();
    } catch (error) {
      console.error('Error updating shift plan:', error);
      toast.error('Failed to update shift plan');
      setErrors({ general: 'An unexpected error occurred' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDepartment = (deptId: string) => {
    setFormData({
      ...formData,
      departmentIds: [...formData.departmentIds, deptId]
    });
  };

  const handleRemoveDepartment = (deptId: string) => {
    setFormData({
      ...formData,
      departmentIds: formData.departmentIds.filter(id => id !== deptId)
    });
  };

  const handleConfigureDepartments = () => {
    onClose();
    setTimeout(() => {
      router.push('/main/departments');
    }, 300);
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
              <Dialog.Panel className="flex w-full max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Left Panel - Form */}
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <Dialog.Title className="text-2xl font-semibold text-gray-900">
                        Edit Shift Plan
                      </Dialog.Title>
                      <p className="mt-2 text-sm text-gray-500">
                        Update your shift schedule settings
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Enter plan name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Departments */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Departments *
                        </label>
                        <button
                          type="button"
                          onClick={handleConfigureDepartments}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Manage Departments</span>
                        </button>
                      </div>
                      
                      {/* Selected Departments */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-2">Selected Departments:</div>
                        {selectedDepartments.length === 0 ? (
                          <div className="text-sm text-gray-400 italic">No departments selected</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedDepartments.map(dept => (
                              <div 
                                key={dept.id}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                              >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{dept.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDepartment(dept.id)}
                                  className="p-0.5 text-blue-400 hover:text-blue-600 rounded-full"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Available Departments */}
                      {availableDepartments.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">Available Departments:</div>
                          <div className="flex flex-wrap gap-2">
                            {availableDepartments.map(dept => (
                              <div 
                                key={dept.id}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200"
                                onClick={() => handleAddDepartment(dept.id)}
                              >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{dept.name}</span>
                                <Plus className="w-3 h-3 text-gray-500" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {errors.departmentIds && (
                        <p className="mt-1 text-sm text-red-600">{errors.departmentIds}</p>
                      )}
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            errors.startDate ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date *
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            errors.endDate ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        />
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
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

                    <div className="space-y-4">
                      <label className="text-xs font-medium text-gray-500">
                        Visibility Status *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
                          className={`p-6 border-2 rounded-xl text-left transition-all ${
                            formData.status === 'DRAFT' 
                              ? 'border-[#0066B3] bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <FileText className="w-8 h-8 text-[#0066B3] mb-3" />
                          <h3 className="text-lg font-medium text-gray-900">Draft</h3>
                          <p className="text-sm text-gray-500 mt-2">
                            Only visible to administrators, not to employees
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, status: 'ACTIVE' })}
                          className={`p-6 border-2 rounded-xl text-left transition-all ${
                            formData.status === 'ACTIVE' 
                              ? 'border-[#0066B3] bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <FileText className="w-8 h-8 text-[#0066B3] mb-3" />
                          <h3 className="text-lg font-medium text-gray-900">Active</h3>
                          <p className="text-sm text-gray-500 mt-2">
                            Visible to all employees
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Shift Plan
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
  );
}