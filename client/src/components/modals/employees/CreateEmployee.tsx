'use client';
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, User, Building2, Mail, Phone, Calendar, Briefcase, UserCircle2, Hash } from 'lucide-react';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    startDate: '',
    employeeId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                    <User className="w-6 h-6 text-[#0066B3]" />
                  </div>
                </div>

                <div className="p-6 pt-12">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900">
                    Add New Employee
                  </Dialog.Title>
                  <p className="mt-2 text-gray-500">Add a new employee to your organization and assign their role.</p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <UserCircle2 className="w-4 h-4 text-[#0066B3]" />
                              First Name
                            </label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                              placeholder="John"
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                              <UserCircle2 className="w-4 h-4 text-[#0066B3]" />
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 text-[#0066B3]" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 text-[#0066B3]" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Hash className="w-4 h-4 text-[#0066B3]" />
                            Employee ID
                          </label>
                          <input
                            type="text"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                            placeholder="EMP001"
                          />
                        </div>

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
                            <Building2 className="w-4 h-4 text-[#0066B3]" />
                            Department
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                          >
                            <option value="">Select Department</option>
                            <option value="engineering">Engineering</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Sales</option>
                            <option value="hr">HR</option>
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 text-[#0066B3]" />
                            Role
                          </label>
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066B3]/20"
                          >
                            <option value="">Select Role</option>
                            <option value="manager">Manager</option>
                            <option value="team_lead">Team Lead</option>
                            <option value="senior">Senior</option>
                            <option value="junior">Junior</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pt-6 border-t">
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
                          Add Employee
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
