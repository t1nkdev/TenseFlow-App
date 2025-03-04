'use client';
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  X, User, Building2, Mail, Phone, Briefcase, UserCircle2, Hash,
  ChevronRight, AlertCircle, Users, Check, Layers
} from 'lucide-react';
import { createEmployee, updateEmployee } from '@/api/employees';
import { getDepartments } from '@/api/departments';
import { Employee } from '@/types/prismaTypes';
import React from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { createEmployeeAsync, updateEmployeeAsync } from '@/store/features/employees/employeesSlice';

// Move form data outside component to prevent re-renders
const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  employeeId: '',
  group: '',
};

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employeeToEdit?: Employee | null;
}

interface Department {
  id: string;
  name: string;
  groups?: string[];
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  employeeId?: string;
  department?: string;
  role?: string;
  group?: string;
  general?: string;
}

export default function CreateEmployeeModal({ isOpen, onClose, onSuccess, employeeToEdit }: CreateEmployeeModalProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState(initialFormData);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
      if (employeeToEdit) {
        setFormData({
          firstName: employeeToEdit.firstName,
          lastName: employeeToEdit.lastName,
          email: employeeToEdit.email || '',
          phone: employeeToEdit.phone || '',
          department: employeeToEdit.departmentId,
          role: employeeToEdit.role,
          employeeId: employeeToEdit.employeeId,
          group: employeeToEdit.group || '',
        });
      } else {
        setFormData(initialFormData);
      }
    } else {
      setFormData(initialFormData);
      setErrors({});
      setSelectedDepartment(null);
    }
  }, [isOpen, employeeToEdit]);

  // Update selected department when department changes
  useEffect(() => {
    if (formData.department) {
      const dept = departments.find((d: Department) => d.id === formData.department);
      setSelectedDepartment(dept || null);
    } else {
      setSelectedDepartment(null);
    }
  }, [formData.department, departments]);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
      
      // If editing an employee, set the selected department
      if (employeeToEdit && employeeToEdit.departmentId) {
        const dept = data.find((d: Department) => d.id === employeeToEdit.departmentId);
        setSelectedDepartment(dept || null);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Email validation only if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
      isValid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
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
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        employeeId: formData.employeeId,
        role: formData.role,
        departmentId: formData.department,
        group: formData.group,
        startDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      };

      console.log('SUBMITTING EMPLOYEE DATA:', employeeData);

      let result;
      if (employeeToEdit) {
        // Use Redux action for updating
        result = await dispatch(updateEmployeeAsync({ 
          id: employeeToEdit.id, 
          data: employeeData 
        })).unwrap();
      } else {
        // Use Redux action for creating
        result = await dispatch(createEmployeeAsync(employeeData)).unwrap();
      }

      console.log('API RESPONSE:', JSON.stringify(result, null, 2));

      // Call onSuccess
      onSuccess();
      
      console.log('AFTER onSuccess CALL');

      // Close the modal after success
      console.log('CLOSING MODAL');
      onClose();
    } catch (error: any) {
      console.error('Error managing employee:', error);
      
      // Check for specific error messages
      if (error.message && error.message.toLowerCase().includes('already in use')) {
        setErrors(prev => ({ ...prev, employeeId: 'This Employee ID is already in use' }));
        return;
      } else if (error.message && error.message.toLowerCase().includes('already registered')) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        return;
      }
      
      toast.error(
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {employeeToEdit ? 'Failed to Update Employee' : 'Failed to Create Employee'}
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
      setErrors(prev => ({ ...prev, general: error.message || 'An unexpected error occurred' }));
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
        case 'firstName':
          setErrors(prev => ({ ...prev, firstName: 'First name is required' }));
          break;
        case 'lastName':
          setErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
          break;
        case 'email':
          setErrors(prev => ({ ...prev, email: 'Email is required' }));
          break;
        case 'employeeId':
          setErrors(prev => ({ ...prev, employeeId: 'Employee ID is required' }));
          break;
        case 'department':
          setErrors(prev => ({ ...prev, department: 'Please select a department' }));
          break;
        case 'role':
          setErrors(prev => ({ ...prev, role: 'Please select a role' }));
          break;
      }
    }

    // Additional email validation
    if (name === 'email' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
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
              <Dialog.Panel className="flex w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Left Panel - Form */}
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <Dialog.Title className="text-2xl font-semibold text-gray-900">
                        {employeeToEdit ? 'Edit Employee' : 'New Employee'}
                      </Dialog.Title>
                      <p className="mt-2 text-sm text-gray-500">
                        {employeeToEdit 
                          ? 'Update the employee information below'
                          : 'Enter the details below to create a new employee profile'
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute left-4 top-4">
                          <UserCircle2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                            errors.firstName ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-4">
                          <UserCircle2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                            errors.lastName ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-4">
                        <Hash className="w-5 h-5 text-gray-400" />
                      </div>
                      <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                          errors.employeeId 
                            ? 'border-red-300 hover:border-red-400 bg-red-100' 
                            : 'border-gray-200 hover:border-gray-300 bg-transparent'
                        } rounded-xl focus:outline-none text-gray-900`}
                      />
                      {errors.employeeId && (
                        <p className="mt-1 text-xs text-red-500">{errors.employeeId}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute left-4 top-4">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                          Department *
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                            errors.department ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus:outline-none text-gray-900 appearance-none`}
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="mt-1 text-xs text-red-500">{errors.department}</p>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-4">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                        </div>
                        <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                          Role *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                            errors.role ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus:outline-none text-gray-900 appearance-none`}
                        >
                          <option value="">Select Role</option>
                          <option value="manager">Manager</option>
                          <option value="team_lead">Team Lead</option>
                          <option value="senior">Senior</option>
                          <option value="junior">Junior</option>
                        </select>
                        {errors.role && (
                          <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                        )}
                      </div>
                    </div>

                    {/* Group Selection - Only show if department has groups */}
                    {selectedDepartment && selectedDepartment.groups && selectedDepartment.groups.length > 0 && (
                      <div className="relative">
                        <div className="absolute left-4 top-4">
                          <Layers className="w-5 h-5 text-gray-400" />
                        </div>
                        <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                          Group
                        </label>
                        <select
                          name="group"
                          value={formData.group}
                          onChange={handleInputChange}
                          className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                            errors.group ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                          } rounded-xl bg-transparent focus:outline-none text-gray-900 appearance-none`}
                        >
                          <option value="">Select Group</option>
                          {selectedDepartment.groups.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </select>
                        {errors.group && (
                          <p className="mt-1 text-xs text-red-500">{errors.group}</p>
                        )}
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-6 mt-2">
                      <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                      <p className="text-xs text-gray-500 mt-1">How to reach this employee</p>
                      
                      <div className="space-y-4 mt-4">
                        <div className="relative">
                          <div className="absolute left-4 top-4">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                          <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full h-16 pl-14 pr-4 pt-5 border ${
                              errors.email ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-gray-300'
                            } rounded-xl bg-transparent focus:outline-none text-gray-900`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute left-4 top-4">
                            <Phone className="w-5 h-5 text-gray-400" />
                          </div>
                          <label className="absolute left-14 text-xs font-medium text-gray-500 top-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full h-16 pl-14 pr-4 pt-5 border border-gray-200 hover:border-gray-300 rounded-xl bg-transparent focus:outline-none text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    {Object.values(errors).some(error => error !== undefined) && (
                      <div className="mt-8 bg-red-50/50 border border-red-100 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-700">Please fix the errors below</span>
                        </div>
                        <div className="px-4 py-3">
                          <ul className="list-disc pl-5 space-y-1">
                            {Object.entries(errors).map(([field, error]) => 
                              error ? (
                                <li key={field} className="text-sm text-red-600">
                                  {error}
                                </li>
                              ) : null
                            )}
                          </ul>
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
                        {employeeToEdit ? 'Update Employee' : 'Create Employee'}
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
                        <Users className="w-5 h-5 text-[#0066B3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Quick Preview</h3>
                        <p className="text-xs text-gray-500">Employee information</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Personal Details
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500">Full Name</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.firstName || formData.lastName 
                                ? `${formData.firstName} ${formData.lastName}`
                                : '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Contact</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.email || '—'}
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.phone || '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-gray-200">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                          Work Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-gray-500">Employee ID</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.employeeId || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Department</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {departments.find(d => d.id === formData.department)?.name || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Role</div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              {formData.role ? (
                                formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
                              ) : '—'}
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

