'use client';
import { useState } from 'react';
import { ChevronDown, MoreHorizontal, Shield, Mail } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Super Admin',
    status: 'Active',
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '5 hours ago'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Moderator',
    status: 'Inactive',
    lastActive: '2 days ago'
  },
  // Add more mock users as needed
];

export default function AdminTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">System Users</h2>
          <button className="px-4 py-2 bg-[#af22da] text-white rounded-lg hover:bg-[#9a1ec3] transition-colors text-sm">
            Add New User
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Last Active</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#af22da]/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#af22da]">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#af22da]" />
                    <span className="text-sm text-gray-900">{user.role}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-500">{user.lastActive}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
