'use client';
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Building2, Users, MapPin, ClipboardList, UserCircle2, LayoutGrid } from 'lucide-react';
import { createDepartment, getEmployees } from '@/api/departments';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
}

export default function CreateDepartmentModal({ isOpen, onClose, onSuccess }: CreateDepartmentModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    manager: '',
    status: 'ACTIVE',
    capacity: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDepartment({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        manager: formData.manager || null
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating department:', error);
    }
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
                    <Building2 className="w-6 h-6 text-[#0066B3]" />
                  </div>
                </div>

                <div className="p-6 pt-12">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900">
                    Add New Department
                  </Dialog.Title>
                  <p className="mt-2 text-gray-500">Create a new department to organize your workforce effectively.</p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    {/* Department Info */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <LayoutGrid className="w-4 h-4 text-[#0066B3]" />
                            Department Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                            placeholder="e.g. Engineering"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <UserCircle2 className="w-4 h-4 text-[#0066B3]" />
                            Department Manager
                          </label>
                          <select
                            value={formData.manager}
                            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                          >
                            <option value="">Select Manager</option>
                            {employees.map((employee) => (
                              <option key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName} ({employee.employeeId})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 text-[#0066B3]" />
                            Location
                          </label>
                          <select
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                          >
                            <option value="">Select Location</option>
                            <option value="hq">Headquarters</option>
                            <option value="remote">Remote</option>
                            <option value="branch_1">Branch Office 1</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <ClipboardList className="w-4 h-4 text-[#0066B3]" />
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20 min-h-[120px]"
                            placeholder="Brief description of the department..."
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Users className="w-4 h-4 text-[#0066B3]" />
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                            placeholder="Max number of employees"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                            Status
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                              style={{ 
                                borderColor: formData.status === 'ACTIVE' ? '#0066B3' : '#e5e7eb',
                                backgroundColor: formData.status === 'ACTIVE' ? '#f0f7ff' : 'white'
                              }}>
                              <input
                                type="radio"
                                name="status"
                                value="ACTIVE"
                                checked={formData.status === 'ACTIVE'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="hidden"
                              />
                              <span className="text-sm font-medium" style={{ color: formData.status === 'ACTIVE' ? '#0066B3' : '#374151' }}>
                                Active
                              </span>
                            </label>
                            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                              style={{ 
                                borderColor: formData.status === 'INACTIVE' ? '#0066B3' : '#e5e7eb',
                                backgroundColor: formData.status === 'INACTIVE' ? '#f0f7ff' : 'white'
                              }}>
                              <input
                                type="radio"
                                name="status"
                                value="INACTIVE"
                                checked={formData.status === 'INACTIVE'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="hidden"
                              />
                              <span className="text-sm font-medium" style={{ color: formData.status === 'INACTIVE' ? '#0066B3' : '#374151' }}>
                                Inactive
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pt-6 mt-8 border-t border-gray-100">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl border border-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[#0066B3] text-white hover:bg-[#0066B3]/90 transition-colors"
                        >
                          Add Department
                        </button>
                      </div>
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
