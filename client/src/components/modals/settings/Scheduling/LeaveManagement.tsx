'use client';
import React, { useState } from 'react';
import { CalendarDays, Clock, Users, AlertTriangle, Check, X, Calendar, Briefcase, Plus } from 'lucide-react';

interface LeaveType {
  id: string;
  name: string;
  description: string;
  maxDays: number;
  requiresApproval: boolean;
  color: string;
  icon: any;
}

export default function LeaveManagement() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    {
      id: '1',
      name: 'Vacation',
      description: 'Annual paid time off',
      maxDays: 20,
      requiresApproval: true,
      color: '#0066B3',
      icon: Calendar
    },
    {
      id: '2',
      name: 'Sick Leave',
      description: 'Medical-related absences',
      maxDays: 10,
      requiresApproval: false,
      color: '#DC2626',
      icon: AlertTriangle
    },
    {
      id: '3',
      name: 'Personal Leave',
      description: 'Personal time off',
      maxDays: 5,
      requiresApproval: true,
      color: '#059669',
      icon: Users
    }
  ]);

  const [settings, setSettings] = useState({
    advanceNotice: 14,
    maxConsecutiveDays: 10,
    autoApproval: false,
    restrictOverlapping: true,
    minTeamPresence: 50
  });

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <CalendarDays className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Leave Management Settings</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure leave types and policies for your organization. Set up approval workflows and time-off limits.
            </p>
          </div>
        </div>
      </div>

      {/* Leave Types */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Leave Types</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Leave Type</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {leaveTypes.map((type) => (
            <div
              key={type.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}15` }}>
                  {React.createElement(type.icon, {
                    className: `w-5 h-5`,
                    style: { color: type.color }
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{type.name}</h4>
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                      {type.maxDays} days/year
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Requires approval:</span>
                    {type.requiresApproval ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">General Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Advance Notice Required
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.advanceNotice}
                  onChange={(e) => setSettings({ ...settings, advanceNotice: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Maximum Consecutive Days
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.maxConsecutiveDays}
                  onChange={(e) => setSettings({ ...settings, maxConsecutiveDays: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Minimum Team Presence
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.minTeamPresence}
                  onChange={(e) => setSettings({ ...settings, minTeamPresence: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproval}
                  onChange={(e) => setSettings({ ...settings, autoApproval: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Enable auto-approval for eligible leaves</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.restrictOverlapping}
                  onChange={(e) => setSettings({ ...settings, restrictOverlapping: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Restrict overlapping leave requests</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Calendar Section */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-[#0066B3]" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Holiday Calendar</h3>
              <p className="text-xs text-gray-500">Configure public holidays and company-wide leaves</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
            Manage Holidays
          </button>
        </div>
      </div>
    </div>
  );
}
