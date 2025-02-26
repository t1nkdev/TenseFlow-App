'use client';
import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Globe, Clock, Smartphone, Zap } from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: any;
}

interface NotificationEvent {
  id: string;
  name: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  realtime: boolean;
}

export default function NotificationSettings() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Receive updates via email',
      enabled: true,
      icon: Mail
    },
    {
      id: 'sms',
      name: 'SMS Alerts',
      description: 'Get instant SMS notifications',
      enabled: true,
      icon: MessageSquare
    },
    {
      id: 'push',
      name: 'Push Notifications',
      description: 'Browser and mobile push notifications',
      enabled: true,
      icon: Bell
    },
    {
      id: 'realtime',
      name: 'Real-time Updates',
      description: 'See changes as they happen',
      enabled: true,
      icon: Zap
    }
  ]);

  const [events, setEvents] = useState<NotificationEvent[]>([
    {
      id: '1',
      name: 'Schedule Changes',
      email: true,
      sms: true,
      push: true,
      realtime: true
    },
    {
      id: '2',
      name: 'Shift Assignments',
      email: true,
      sms: false,
      push: true,
      realtime: true
    },
    {
      id: '3',
      name: 'Time Off Requests',
      email: true,
      sms: true,
      push: true,
      realtime: false
    },
    {
      id: '4',
      name: 'Coverage Alerts',
      email: false,
      sms: true,
      push: true,
      realtime: true
    }
  ]);

  const [settings, setSettings] = useState({
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    batchNotifications: true,
    notificationDelay: 5,
    enableSoundEffects: true
  });

  const toggleChannel = (id: string) => {
    setChannels(channels.map(channel =>
      channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
    ));
  };

  const toggleEventNotification = (eventId: string, channel: keyof Omit<NotificationEvent, 'id' | 'name'>) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, [channel]: !event[channel] } : event
    ));
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Notification Preferences</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure how and when you receive notifications across different channels
            </p>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Notification Channels</h3>
        <div className="grid grid-cols-2 gap-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${channel.enabled ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    {React.createElement(channel.icon, {
                      className: `w-4 h-4 ${channel.enabled ? 'text-[#0066B3]' : 'text-gray-400'}`
                    })}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{channel.name}</h4>
                    <p className="text-xs text-gray-500">{channel.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={channel.enabled}
                    onChange={() => toggleChannel(channel.id)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Events */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Notification Events</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SMS</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Push</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Real-time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.name}
                  </td>
                  {['email', 'sms', 'push', 'realtime'].map((channel) => (
                    <td key={channel} className="px-6 py-4 whitespace-nowrap text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={event[channel as keyof Omit<NotificationEvent, 'id' | 'name'>]}
                          onChange={() => toggleEventNotification(event.id, channel as keyof Omit<NotificationEvent, 'id' | 'name'>)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Delivery Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Quiet Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start</label>
                  <input
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => setSettings({ ...settings, quietHoursStart: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End</label>
                  <input
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings({ ...settings, quietHoursEnd: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Notification Delay
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.notificationDelay}
                  onChange={(e) => setSettings({ ...settings, notificationDelay: parseInt(e.target.value) })}
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
                  checked={settings.batchNotifications}
                  onChange={(e) => setSettings({ ...settings, batchNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Batch similar notifications</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSoundEffects}
                  onChange={(e) => setSettings({ ...settings, enableSoundEffects: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Enable sound effects</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 