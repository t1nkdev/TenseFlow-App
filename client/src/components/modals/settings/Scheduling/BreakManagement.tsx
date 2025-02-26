'use client';
import React, { useState } from 'react';
import { Timer, Plus, Coffee, AlertTriangle, Edit2, Trash2 } from 'lucide-react';

interface BreakType {
  id: string;
  name: string;
  duration: number;
  paid: boolean;
  mandatory: boolean;
  minHoursBeforeBreak: number;
  restrictions?: string[];
}

export default function BreakManagement() {
  const [breakTypes, setBreakTypes] = useState<BreakType[]>([
    {
      id: '1',
      name: 'Lunch Break',
      duration: 30,
      paid: false,
      mandatory: true,
      minHoursBeforeBreak: 4,
      restrictions: ['Must be taken between 11:00 AM and 2:00 PM']
    },
    {
      id: '2',
      name: 'Coffee Break',
      duration: 15,
      paid: true,
      mandatory: false,
      minHoursBeforeBreak: 2
    },
    {
      id: '3',
      name: 'Rest Period',
      duration: 20,
      paid: true,
      mandatory: true,
      minHoursBeforeBreak: 3,
      restrictions: ['Maximum 2 per shift']
    }
  ]);

  const [settings, setSettings] = useState({
    enforceBreakCompliance: true,
    allowBreakPostponement: false,
    maxPostponementTime: 30,
    staggerBreaks: true,
    minStaffPresence: 75
  });

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <Timer className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Break Management</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure break types, durations, and policies. Ensure compliance with labor regulations and maintain adequate coverage.
            </p>
          </div>
        </div>
      </div>

      {/* Break Types */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Break Types</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Break Type</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {breakTypes.map((breakType) => (
            <div
              key={breakType.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Coffee className="w-4 h-4 text-[#0066B3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{breakType.name}</h4>
                      <p className="text-xs text-gray-500">{breakType.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md ${breakType.paid ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {breakType.paid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-md ${breakType.mandatory ? 'bg-blue-50 text-[#0066B3]' : 'bg-gray-100 text-gray-600'}`}>
                      {breakType.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>

                  {breakType.restrictions && (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <ul className="text-xs text-gray-600 space-y-1">
                        {breakType.restrictions.map((restriction, index) => (
                          <li key={index}>{restriction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-[#0066B3] rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Break Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Break Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Minimum Staff Presence
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.minStaffPresence}
                  onChange={(e) => setSettings({ ...settings, minStaffPresence: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">% during breaks</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Maximum Postponement
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.maxPostponementTime}
                  onChange={(e) => setSettings({ ...settings, maxPostponementTime: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="space-y-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enforceBreakCompliance}
                  onChange={(e) => setSettings({ ...settings, enforceBreakCompliance: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Enforce break compliance</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowBreakPostponement}
                  onChange={(e) => setSettings({ ...settings, allowBreakPostponement: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Allow break postponement</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.staggerBreaks}
                  onChange={(e) => setSettings({ ...settings, staggerBreaks: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Stagger break times</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 