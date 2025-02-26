'use client';
import React from 'react';
import { useState } from 'react';
import { Shield, Clock, Calendar, AlertTriangle, Users, Moon, Sun } from 'lucide-react';

interface Rule {
  id: string;
  enabled: boolean;
  name: string;
  description: string;
  icon: any;
}

export default function ScheduleRules() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      enabled: true,
      name: 'Maximum Hours Per Week',
      description: 'Limit employees to 40 hours per week',
      icon: Clock
    },
    {
      id: '2',
      enabled: true,
      name: 'Rest Between Shifts',
      description: 'Minimum 12 hours rest between shifts',
      icon: Moon
    },
    {
      id: '3',
      enabled: false,
      name: 'Consecutive Days',
      description: 'Maximum 6 consecutive working days',
      icon: Calendar
    },
    {
      id: '4',
      enabled: true,
      name: 'Overtime Alerts',
      description: 'Alert when scheduling overtime',
      icon: AlertTriangle
    },
    {
      id: '5',
      enabled: false,
      name: 'Shift Distribution',
      description: 'Equal distribution of weekend shifts',
      icon: Users
    },
    {
      id: '6',
      enabled: true,
      name: 'Day/Night Rotation',
      description: 'Minimum 24h break when switching between day and night shifts',
      icon: Sun
    }
  ]);

  const [customRules, setCustomRules] = useState({
    maxHoursPerWeek: 40,
    minRestHours: 12,
    maxConsecutiveDays: 6,
    minBreakBetweenShifts: 30
  });

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="space-y-6">
      {/* General Rules Section */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#0066B3]" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Schedule Protection Rules</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enable or disable scheduling rules to ensure fair and compliant schedules
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rule.enabled ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    {React.createElement(rule.icon, {
                      className: `w-4 h-4 ${rule.enabled ? 'text-[#0066B3]' : 'text-gray-400'}`
                    })}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                    <p className="text-xs text-gray-500">{rule.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Rules Configuration */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Custom Rule Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Maximum Hours Per Week
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customRules.maxHoursPerWeek}
                onChange={(e) => setCustomRules({
                  ...customRules,
                  maxHoursPerWeek: parseInt(e.target.value)
                })}
                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-gray-500">hours</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Minimum Rest Between Shifts
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customRules.minRestHours}
                onChange={(e) => setCustomRules({
                  ...customRules,
                  minRestHours: parseInt(e.target.value)
                })}
                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-gray-500">hours</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Maximum Consecutive Days
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customRules.maxConsecutiveDays}
                onChange={(e) => setCustomRules({
                  ...customRules,
                  maxConsecutiveDays: parseInt(e.target.value)
                })}
                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-gray-500">days</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Minimum Break Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customRules.minBreakBetweenShifts}
                onChange={(e) => setCustomRules({
                  ...customRules,
                  minBreakBetweenShifts: parseInt(e.target.value)
                })}
                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-gray-500">minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Schedule Validation</h3>
            <p className="text-xs text-gray-600 mt-1">
              These rules will be enforced when creating or modifying schedules. Violations will trigger warnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
