'use client';
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  X, Building2, UserCircle2, LayoutGrid, AlignLeft, Hash, ChevronRight, AlertCircle, Plus, Trash2 
} from 'lucide-react';
import { createDepartment, getEmployees, updateDepartment } from '@/api/departments';
import { Department } from '@/types/prismaTypes';
import React from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { createDepartmentAsync, updateDepartmentAsync } from '@/store/features/departments/departmentsSlice';

// Move form data outside component to prevent re-renders
const initialFormData = {
  name: '',
  description: '',
  departmentId: '',
  manager: '',
  groups: [] as string[],
};

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departmentToEdit?: Department | null;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
}

interface FormErrors {
  name?: string;
  departmentId?: string;
  manager?: string;
  groups?: string;
  general?: string;
}

export default function CreateDepartmentModal({ isOpen, onClose, onSuccess, departmentToEdit }: CreateDepartmentModalProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
      if (departmentToEdit) {
        setFormData({
          name: departmentToEdit.name,
          description: departmentToEdit.description || '',
          departmentId: departmentToEdit.id,
          manager: departmentToEdit.managerId || '',
          groups: departmentToEdit.groups || [],
        });
      } else {
        setFormData(initialFormData);
      }
    } else {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen, departmentToEdit]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
      isValid = false;
    }

    if (!formData.departmentId.trim()) {
      newErrors.departmentId = 'Department ID is required';
      isValid = false;
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
      const departmentData = {
        name: formData.name,
        description: formData.description || undefined,
        departmentId: formData.departmentId,
        manager: formData.manager || null,
        groups: formData.groups,
        status: 'ACTIVE' as const
      };

      console.log('SUBMITTING DEPARTMENT DATA:', departmentData);

      let result;
      if (departmentToEdit) {
        // Use Redux action for updating
        result = await dispatch(updateDepartmentAsync({ 
          id: departmentToEdit.id, 
          data: departmentData 
        })).unwrap();
      } else {
        // Use Redux action for creating
        result = await dispatch(createDepartmentAsync(departmentData)).unwrap();
      }

      console.log('API RESPONSE:', JSON.stringify(result, null, 2));

      // Call onSuccess
      onSuccess();
      
      console.log('AFTER onSuccess CALL');

      // Close the modal after success
      console.log('CLOSING MODAL');
      onClose();
    } catch (error: any) {
      console.error('Error managing department:', error);
      
      // Check for specific error messages
      if (error.message && error.message.toLowerCase().includes('department id already exists')) {
        setErrors({ departmentId: 'This Department ID is already in use' });
        return;
      } else if (error.message && error.message.toLowerCase().includes('department name already exists')) {
        setErrors({ name: 'This Department name is already in use' });
        return;
      }
      
      toast.error(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {departmentToEdit ? 'Failed to Update Department' : 'Failed to Create Department'}
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              {error.message || 'Please try again or contact support if the issue persists.'}
            </p>
          </div>
        </div>,
        {
          position: 'bottom-right',
          style: {
            background: '#ef4444', // red-500
            border: 'none',
            color: 'white'
          }
        }
      );
      setErrors({ general: error.message || 'An unexpected error occurred' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    // If field is required and becomes empty, show error
    if ((name === 'name' || name === 'departmentId') && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: `${name === 'name' ? 'Department name' : 'Department ID'} is required`
      }));
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const addGroup = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentGroups = formData.groups || [];
    
    // Find the next available letter
    let nextLetter = '';
    if (currentGroups.length === 0) {
      nextLetter = 'A';
    } else {
      // Get the last group and find the next letter
      const lastGroup = currentGroups[currentGroups.length - 1];
      const lastLetter = lastGroup.charAt(0);
      const lastIndex = alphabet.indexOf(lastLetter);
      
      if (lastIndex < alphabet.length - 1) {
        nextLetter = alphabet.charAt(lastIndex + 1);
      } else {
        // If we've used all letters, start adding double letters (AA, AB, etc.)
        nextLetter = 'A' + alphabet.charAt(0);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      groups: [...prev.groups, nextLetter]
    }));
  };

  const removeGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.filter((_, i) => i !== index)
    }));
  };

  return (
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
                        {departmentToEdit ? 'Edit Department' : 'New Department'}
                      </Dialog.Title>
                      <p className="mt-2 text-sm text-gray-500">
                        {departmentToEdit 
                          ? 'Update the department information below'
                          : 'Create a new department to organize your workforce effectively'
                        }
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
                        <LayoutGrid className="w-5 h-5 text-gray-400" />
                      </div>
                      <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                        Department Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                          errors.name ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                        } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                        placeholder="e.g. Engineering"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-4">
                        <Hash className="w-5 h-5 text-gray-400" />
                      </div>
                      <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                        Department ID *
                      </label>
                      <input
                        type="text"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                          errors.departmentId 
                            ? 'border-red-300 hover:border-red-400 bg-red-100' 
                            : 'border-gray-200 hover:border-gray-300 bg-transparent'
                        } rounded-xl focus:outline-none text-gray-900`}
                        placeholder="e.g. DEP001"
                      />
                      {errors.departmentId && (
                        <p className="mt-1 text-xs text-red-500">{errors.departmentId}</p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-4">
                        <UserCircle2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                        Department Manager <span className="text-gray-400">(Optional)</span>
                      </label>
                      <select
                        name="manager"
                        value={formData.manager}
                        onChange={handleInputChange}
                        className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                          errors.manager ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                        } rounded-xl bg-transparent focus:outline-none text-gray-900 appearance-none`}
                      >
                        <option value="">No manager assigned</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName} ({employee.employeeId})
                          </option>
                        ))}
                      </select>
                      {errors.manager && (
                        <p className="mt-1 text-xs text-red-500">{errors.manager}</p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-4">
                        <AlignLeft className="w-5 h-5 text-gray-400" />
                      </div>
                      <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                        Description <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full min-h-[160px] pl-14 pr-4 pt-8 border border-gray-200 hover:border-gray-300 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20 text-gray-900 resize-none"
                        placeholder="Brief description of the department..."
                      />
                    </div>

                    {/* Groups Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Groups
                        </label>
                        <button
                          type="button"
                          onClick={addGroup}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Group
                        </button>
                      </div>
                      
                      {formData.groups.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No groups added yet. Click "Add Group" to create groups like A, B, C, etc.</p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {formData.groups.map((group, index) => (
                            <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                              <span className="font-medium">Group {group}</span>
                              <button
                                type="button"
                                onClick={() => removeGroup(index)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {errors.groups && (
                        <p className="text-sm text-red-600 mt-1">{errors.groups}</p>
                      )}
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
                        className="px-6 py-2.5 text-sm font-medium rounded-lg bg-[#0066B3] text-white hover:bg-[#0066B3]/90 transition-colors inline-flex items-center gap-2"
                      >
                        {departmentToEdit ? 'Update Department' : 'Create Department'}
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
                        <Building2 className="w-5 h-5 text-[#0066B3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Quick Preview</h3>
                        <p className="text-xs text-gray-500">Department information</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Department Details
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500">Department Name</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.name || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Department ID</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.departmentId || '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Additional Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500">Manager</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.manager ? 
                                employees.find(e => e.id === formData.manager)?.firstName + ' ' + 
                                employees.find(e => e.id === formData.manager)?.lastName
                                : '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Description</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.description || '—'}
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
  );
}
