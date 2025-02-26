'use client';
import React, { useState } from 'react';
import { Repeat, Plus, Calendar, ArrowRight, Edit2, Trash2 } from 'lucide-react';

interface RotationPattern {
  id: string;
  name: string;
  description: string;
  days: number;
  pattern: string[];
  teams: string[];
}

export default function RotationPatterns() {
  const [patterns, setPatterns] = useState<RotationPattern[]>([
    {
      id: '1',
      name: '4-3 Rotation',
      description: '4 days on, 3 days off',
      days: 7,
      pattern: ['M', 'T', 'W', 'Th', 'off', 'off', 'off'],
      teams: ['Team A', 'Team B']
    },
    {
      id: '2',
      name: 'Day-Night Rotation',
      description: '2 weeks day shift, 2 weeks night shift',
      days: 28,
      pattern: ['D', 'D', 'N', 'N'],
      teams: ['Team A', 'Team B', 'Team C']
    }
  ]);

  const [settings, setSettings] = useState({
    rotationStartDay: 'Monday',
    autoRotateTeams: true,
    notifyBeforeRotation: 7,
    allowSwaps: true
  });

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <Repeat className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Rotation Patterns</h3>
            <p className="text-xs text-gray-500 mt-1">
              Create and manage shift rotation patterns for your teams. Set up recurring schedules and automate team rotations.
            </p>
          </div>
        </div>
      </div>

      {/* Patterns List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Active Patterns</h3>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create Pattern</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{pattern.name}</h4>
                    <p className="text-xs text-gray-500">{pattern.description}</p>
                  </div>
                  
                  {/* Pattern Visualization */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-1.5">
                      {pattern.pattern.map((day, index) => (
                        <span
                          key={index}
                          className={`text-xs font-medium px-2 py-1 rounded-md
                            ${day === 'off' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-[#0066B3]'}`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {pattern.teams.map((team, index) => (
                      <React.Fragment key={team}>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                          {team}
                        </span>
                        {index < pattern.teams.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
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

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Rotation Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Rotation Start Day
              </label>
              <select
                value={settings.rotationStartDay}
                onChange={(e) => setSettings({ ...settings, rotationStartDay: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Notification Days
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.notifyBeforeRotation}
                  onChange={(e) => setSettings({ ...settings, notifyBeforeRotation: parseInt(e.target.value) })}
                  className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-gray-500">days before rotation</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div className="space-y-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRotateTeams}
                  onChange={(e) => setSettings({ ...settings, autoRotateTeams: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Automatically rotate teams</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowSwaps}
                  onChange={(e) => setSettings({ ...settings, allowSwaps: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Allow shift swaps between teams</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 