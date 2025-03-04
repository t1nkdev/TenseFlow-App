'use client';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, UserCog, Shield, Users, ChevronRight, AlertCircle, Pencil, Trash2, Plus } from 'lucide-react';

interface CreateRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface FormErrors {
  name?: string;
  description?: string;
  permissions?: string;
  general?: string;
}

const initialFormData = {
  name: '',
  description: '',
  permissions: [] as string[],
};

export default function CreateRolesModal({ isOpen, onClose, onSuccess }: CreateRolesModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [highlightedRoleId, setHighlightedRoleId] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department management and employee oversight',
      permissions: ['manage_department', 'manage_employees'],
    },
    {
      id: '3',
      name: 'Employee',
      description: 'Basic access rights',
      permissions: ['view_schedule', 'request_time_off'],
    },
  ]);

  const availablePermissions = [
    { id: 'manage_department', name: 'Manage Department', description: 'Create, edit, and delete departments' },
    { id: 'manage_employees', name: 'Manage Employees', description: 'Add, edit, and remove employees' },
    { id: 'manage_schedules', name: 'Manage Schedules', description: 'Create and modify work schedules' },
    { id: 'view_schedule', name: 'View Schedule', description: 'View personal and team schedules' },
    { id: 'request_time_off', name: 'Request Time Off', description: 'Submit and manage time off requests' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify user roles' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Role description is required';
      isValid = false;
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
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
      let updatedRoleId: string;
      if (isEditing && editingId) {
        // Update existing role
        setRoles(roles.map(role => 
          role.id === editingId 
            ? { ...formData, id: editingId }
            : role
        ));
        updatedRoleId = editingId;
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Create new role
        const newRoleId = (roles.length + 1).toString();
        setRoles([...roles, {
          id: newRoleId,
          ...formData,
        }]);
        updatedRoleId = newRoleId;
      }

      setFormData(initialFormData);
      setErrors({});
      setShowSuccess(true);
      setHighlightedRoleId(updatedRoleId);
      
      // Clear highlights and success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setHighlightedRoleId(null);
      }, 3000);
    } catch (error) {
      console.error('Error managing role:', error);
      setErrors({ general: 'An unexpected error occurred' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    if (!value.trim()) {
      switch (name) {
        case 'name':
          setErrors(prev => ({ ...prev, name: 'Role name is required' }));
          break;
        case 'description':
          setErrors(prev => ({ ...prev, description: 'Role description is required' }));
          break;
      }
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));

    if (errors.permissions) {
      setErrors(prev => ({
        ...prev,
        permissions: undefined
      }));
    }
  };

  const handleEdit = (role: Role) => {
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setIsEditing(true);
    setEditingId(role.id);
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title className="text-2xl font-semibold text-gray-900">
                      Role Management
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-500">
                      Create and manage roles with specific permissions
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Success Notification */}
                  <Transition
                    show={showSuccess}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Success!</h4>
                        <p className="text-sm text-green-600 mt-0.5">
                          {isEditing ? 'Role updated successfully' : 'New role created successfully'}
                        </p>
                      </div>
                    </div>
                  </Transition>

                  {/* Form Section */}
                  <div className="mb-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#0066B3]/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#0066B3]" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {isEditing ? 'Edit Role' : 'Create New Role'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isEditing ? 'Modify existing role details' : 'Add a new role to the system'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
                      <div className="space-y-6 col-span-1">
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full h-11 px-4 border ${
                              errors.name 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-200'
                            } rounded-lg focus:outline-none focus:border-[#0066B3] text-gray-900`}
                            placeholder="Role Name *"
                          />
                          {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                          )}
                        </div>

                        <div className="relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border ${
                              errors.description 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-200'
                            } rounded-lg focus:outline-none focus:border-[#0066B3] text-gray-900 min-h-[80px]`}
                            placeholder="Role Description *"
                          />
                          {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Permissions *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {availablePermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className={`flex items-start gap-3 p-3 border rounded-lg hover:bg-white cursor-pointer transition-colors ${
                                formData.permissions.includes(permission.id)
                                  ? 'border-[#0066B3] bg-blue-50'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="mt-1"
                              />
                              <div>
                                <div className="font-medium text-sm text-gray-900">{permission.name}</div>
                                <div className="text-xs text-gray-500">{permission.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.permissions && (
                          <p className="mt-2 text-xs text-red-500">{errors.permissions}</p>
                        )}
                      </div>

                      <div className="col-span-3 flex justify-end gap-3 pt-4 border-t border-gray-200">
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(initialFormData);
                              setIsEditing(false);
                              setEditingId(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0066B3] text-white hover:bg-[#0066B3]/90 transition-colors inline-flex items-center gap-2"
                        >
                          {isEditing ? (
                            <>Update Role</>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Add Role
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Table Section */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">Existing Roles</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {roles.map((role) => (
                            <tr key={role.id} className={`transition-colors duration-500 ${
                              highlightedRoleId === role.id 
                                ? 'bg-green-50 border-green-200'
                                : 'hover:bg-gray-50'
                            }`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <Shield className="w-5 h-5 text-[#0066B3]" />
                                  <span className="text-sm font-medium text-gray-900">{role.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-500">{role.description}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {role.permissions.map((permission) => {
                                    const permissionDetails = availablePermissions.find(p => p.id === permission);
                                    return (
                                      <span
                                        key={permission}
                                        className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-xs font-medium text-blue-700"
                                      >
                                        {permissionDetails?.name || permission}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleEdit(role)}
                                    className="p-1 text-gray-400 hover:text-[#0066B3] transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(role.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
