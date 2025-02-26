'use client';
import React, { useState } from 'react';
import { Bell, AlertTriangle, Clock, Users, Calendar, Plus, Trash2, Edit2 } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  priority: 'low' | 'medium' | 'high';
  enabled: boolean;
}

export default function AlertRules() {
  const [rules, setRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Understaffed Shift',
      description: 'Alert when shift coverage falls below minimum requirement',
      condition: 'staffing < minimum_required',
      priority: 'high',
      enabled: true
    },
    {
      id: '2',
      name: 'Overtime Warning',
      description: 'Alert when employee approaches overtime threshold',
      condition: 'weekly_hours > 35',
      priority: 'medium',
      enabled: true
    },
    {
      id: '3',
      name: 'Schedule Conflict',
      description: 'Alert when overlapping shifts are detected',
      condition: 'shifts_overlap = true',
      priority: 'high',
      enabled: true
    }
  ]);

  const [settings, setSettings] = useState({
    enablePushNotifications: true,
    enableEmailAlerts: true,
    enableSMSAlerts: true,
    alertSound: true,
    autoResolve: false,
    escalationDelay: 30
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-50 text-blue-600';
      case 'medium':
        return 'bg-amber-50 text-amber-600';
      case 'high':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Alert Rules</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure automated alerts and notifications based on custom conditions
            </p>
          </div>
        </div>
      </div>

      {/* Alert Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Active Rules</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-[#0066B3] rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md ${getPriorityColor(rule.priority)}`}>
                      {rule.priority.charAt(0).toUpperCase() + rule.priority.slice(1)}
                    </span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {rule.condition}
                    </code>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => {
                        setRules(rules.map(r =>
                          r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                        ));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Alert Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="space-y-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enablePushNotifications}
                  onChange={(e) => setSettings({ ...settings, enablePushNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Push Notifications</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEmailAlerts}
                  onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Email Alerts</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSMSAlerts}
                  onChange={(e) => setSettings({ ...settings, enableSMSAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">SMS Alerts</span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="space-y-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.alertSound}
                  onChange={(e) => setSettings({ ...settings, alertSound: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Alert Sound</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoResolve}
                  onChange={(e) => setSettings({ ...settings, autoResolve: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Auto-resolve Alerts</span>
              </label>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Escalation Delay
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.escalationDelay}
                    onChange={(e) => setSettings({ ...settings, escalationDelay: parseInt(e.target.value) })}
                    className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 