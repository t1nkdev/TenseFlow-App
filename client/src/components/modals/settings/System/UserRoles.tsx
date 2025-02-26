'use client';
import React, { useState } from 'react';
import { Shield, Users, Plus, Settings, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  enabled: boolean;
  category: string;
}

export default function UserRoles() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access and control',
      permissions: [
        { id: '1', name: 'Create Schedules', enabled: true, category: 'Scheduling' },
        { id: '2', name: 'Manage Employees', enabled: true, category: 'Organization' },
        { id: '3', name: 'View Reports', enabled: true, category: 'System' },
      ]
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Department management and scheduling',
      permissions: [
        { id: '1', name: 'Create Schedules', enabled: true, category: 'Scheduling' },
        { id: '2', name: 'Manage Employees', enabled: true, category: 'Organization' },
        { id: '3', name: 'View Reports', enabled: false, category: 'System' },
      ]
    },
    {
      id: '3',
      name: 'Employee',
      description: 'Basic access for viewing schedules',
      permissions: [
        { id: '1', name: 'Create Schedules', enabled: false, category: 'Scheduling' },
        { id: '2', name: 'Manage Employees', enabled: false, category: 'Organization' },
        { id: '3', name: 'View Reports', enabled: false, category: 'System' },
      ]
    }
  ]);

  const permissionCategories = [
    {
      name: 'Organization',
      permissions: [
        'Manage Departments',
        'Manage Employees',
        'Edit Company Settings'
      ]
    },
    {
      name: 'Scheduling',
      permissions: [
        'Create Schedules',
        'Edit Schedules',
        'Delete Schedules',
        'Approve Time Off'
      ]
    },
    {
      name: 'System',
      permissions: [
        'View Reports',
        'Manage Settings',
        'User Management'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">User Roles & Permissions</h3>
            <p className="text-xs text-gray-500 mt-1">
              Define roles and manage permissions to control access to different features of the system
            </p>
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-[#0066B3]" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                  
                  {/* Permissions Preview */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission.id}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs
                          ${permission.enabled 
                            ? 'bg-blue-50 text-[#0066B3]' 
                            : 'bg-gray-50 text-gray-500'}`}
                      >
                        {permission.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-[#0066B3] rounded-lg hover:bg-blue-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {role.name !== 'Administrator' && (
                  <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Button */}
      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
        <Plus className="w-4 h-4" />
        <span>Add New Role</span>
      </button>

      {/* Permissions Guide */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-4">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-400" />
          Available Permissions
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {permissionCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500">{category.name}</h4>
              <ul className="space-y-1">
                {category.permissions.map((permission) => (
                  <li key={permission} className="text-sm text-gray-600">
                    • {permission}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
