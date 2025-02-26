'use client';
import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Edit2, Phone } from 'lucide-react';

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  enabled: boolean;
}

export default function SMSSettings() {
  const [settings, setSettings] = useState({
    provider: 'twilio',
    accountSid: 'AC1234567890',
    authToken: '••••••••••••',
    fromNumber: '+1234567890',
    enableDeliveryReports: true,
    retryAttempts: 3
  });

  const [templates, setTemplates] = useState<SMSTemplate[]>([
    {
      id: '1',
      name: 'Shift Reminder',
      message: 'Reminder: Your shift starts in 1 hour',
      enabled: true
    },
    {
      id: '2',
      name: 'Schedule Change',
      message: 'Your schedule has been updated. Please check the app.',
      enabled: true
    },
    {
      id: '3',
      name: 'Urgent Coverage',
      message: 'Urgent: Coverage needed for [shift]. Please respond ASAP.',
      enabled: true
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">SMS Configuration</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure your SMS provider settings and message templates
            </p>
          </div>
        </div>
      </div>

      {/* Provider Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Provider Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                SMS Provider
              </label>
              <select
                value={settings.provider}
                onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="twilio">Twilio</option>
                <option value="messagebird">MessageBird</option>
                <option value="vonage">Vonage</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Account SID
              </label>
              <input
                type="text"
                value={settings.accountSid}
                onChange={(e) => setSettings({ ...settings, accountSid: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Auth Token
              </label>
              <input
                type="password"
                value={settings.authToken}
                onChange={(e) => setSettings({ ...settings, authToken: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                From Number
              </label>
              <input
                type="text"
                value={settings.fromNumber}
                onChange={(e) => setSettings({ ...settings, fromNumber: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Delivery Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDeliveryReports}
                  onChange={(e) => setSettings({ ...settings, enableDeliveryReports: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Enable Delivery Reports</span>
              </label>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Retry Attempts
              </label>
              <input
                type="number"
                value={settings.retryAttempts}
                onChange={(e) => setSettings({ ...settings, retryAttempts: parseInt(e.target.value) })}
                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Message Templates</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Template</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{template.message}</p>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 