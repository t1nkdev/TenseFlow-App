'use client';
import React, { useState } from 'react';
import { BarChart, AlertTriangle, Clock, Users, Briefcase, Scale, Activity, Calendar } from 'lucide-react';

interface ThresholdSetting {
  id: string;
  name: string;
  description: string;
  warning: number;
  critical: number;
  icon: any;
}

export default function WorkloadAnalysis() {
  const [thresholds, setThresholds] = useState<ThresholdSetting[]>([
    {
      id: '1',
      name: 'Weekly Hours',
      description: 'Maximum hours per week per employee',
      warning: 35,
      critical: 40,
      icon: Clock
    },
    {
      id: '2',
      name: 'Consecutive Days',
      description: 'Maximum consecutive working days',
      warning: 5,
      critical: 6,
      icon: Calendar
    },
    {
      id: '3',
      name: 'Shift Distribution',
      description: 'Fairness in shift type distribution',
      warning: 70,
      critical: 60,
      icon: Scale
    }
  ]);

  const [settings, setSettings] = useState({
    enableAlerts: true,
    monitorOvertime: true,
    trackFairness: true,
    balanceTeamLoad: true,
    alertThreshold: 85
  });

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <BarChart className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Workload Analysis</h3>
            <p className="text-xs text-gray-500 mt-1">
              Monitor and analyze employee workload distribution. Set thresholds and receive alerts for potential scheduling issues.
            </p>
          </div>
        </div>
      </div>

      {/* Threshold Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Monitoring Thresholds</h3>
        <div className="grid grid-cols-2 gap-4">
          {thresholds.map((threshold) => (
            <div
              key={threshold.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {React.createElement(threshold.icon, {
                      className: "w-4 h-4 text-[#0066B3]"
                    })}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{threshold.name}</h4>
                    <p className="text-xs text-gray-500">{threshold.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-amber-600">Warning Threshold</span>
                      <span className="text-xs text-gray-500">{threshold.warning}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${threshold.warning}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-red-600">Critical Threshold</span>
                      <span className="text-xs text-gray-500">{threshold.critical}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${threshold.critical}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Analysis Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Alert Threshold
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">% capacity</span>
              </div>
            </div>

            {/* Monitoring Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <Activity className="w-4 h-4 text-[#0066B3] mb-2" />
                <div className="text-2xl font-semibold text-gray-900">85%</div>
                <div className="text-xs text-gray-500">Average Utilization</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <Users className="w-4 h-4 text-[#0066B3] mb-2" />
                <div className="text-2xl font-semibold text-gray-900">92%</div>
                <div className="text-xs text-gray-500">Team Balance</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="space-y-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAlerts}
                  onChange={(e) => setSettings({ ...settings, enableAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Enable workload alerts</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.monitorOvertime}
                  onChange={(e) => setSettings({ ...settings, monitorOvertime: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Monitor overtime trends</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.trackFairness}
                  onChange={(e) => setSettings({ ...settings, trackFairness: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Track schedule fairness</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.balanceTeamLoad}
                  onChange={(e) => setSettings({ ...settings, balanceTeamLoad: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Balance team workload</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 