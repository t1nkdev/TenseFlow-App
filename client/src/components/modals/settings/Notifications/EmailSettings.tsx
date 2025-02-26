'use client';
import React, { useState } from 'react';
import { Mail, Plus, Trash2, Edit2 } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  enabled: boolean;
}

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    smtpServer: 'smtp.example.com',
    port: 587,
    username: 'notifications@company.com',
    enableSSL: true,
    senderName: 'TenseFlow Notifications',
    senderEmail: 'notifications@company.com'
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Schedule Assignment',
      subject: 'New Schedule Assignment',
      enabled: true
    },
    {
      id: '2',
      name: 'Schedule Change',
      subject: 'Your Schedule Has Been Updated',
      enabled: true
    },
    {
      id: '3',
      name: 'Time Off Request',
      subject: 'Time Off Request Status',
      enabled: true
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Email Configuration</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure your email server settings and notification templates
            </p>
          </div>
        </div>
      </div>

      {/* SMTP Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">SMTP Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                SMTP Server
              </label>
              <input
                type="text"
                value={settings.smtpServer}
                onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Port
              </label>
              <input
                type="number"
                value={settings.port}
                onChange={(e) => setSettings({ ...settings, port: parseInt(e.target.value) })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="email"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center mt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSSL}
                  onChange={(e) => setSettings({ ...settings, enableSSL: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Enable SSL/TLS</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sender Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Sender Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Sender Name
            </label>
            <input
              type="text"
              value={settings.senderName}
              onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Sender Email
            </label>
            <input
              type="email"
              value={settings.senderEmail}
              onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Email Templates</h3>
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
                  <p className="text-xs text-gray-500 mt-1">{template.subject}</p>
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