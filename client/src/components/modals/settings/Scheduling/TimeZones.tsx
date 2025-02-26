'use client';
import React, { useState } from 'react';
import { Globe, Clock, Search, Plus } from 'lucide-react';

interface TimeZoneOption {
  id: string;
  name: string;
  offset: string;
  city: string;
}

export default function TimeZones() {
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [searchQuery, setSearchQuery] = useState('');
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00'
  });

  // Example timezone data - in a real app, you'd fetch this from a timezone API
  const timeZones: TimeZoneOption[] = [
    { id: '1', name: 'UTC', offset: '+00:00', city: 'London' },
    { id: '2', name: 'EST', offset: '-05:00', city: 'New York' },
    { id: '3', name: 'PST', offset: '-08:00', city: 'Los Angeles' },
    { id: '4', name: 'IST', offset: '+05:30', city: 'Mumbai' },
    { id: '5', name: 'JST', offset: '+09:00', city: 'Tokyo' }
  ];

  const filteredTimeZones = timeZones.filter(tz =>
    tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tz.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-[#0066B3]" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Time Zone Settings</h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure your organization's time zone and working hours. This will affect how schedules are displayed and managed.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid grid-cols-2 gap-6">
        {/* Time Zone Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Select Time Zone</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div className="h-[300px] overflow-y-auto space-y-2 pr-2">
            {filteredTimeZones.map((tz) => (
              <button
                key={tz.id}
                onClick={() => setSelectedTimezone(tz.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-left
                  ${selectedTimezone === tz.name 
                    ? 'border-[#0066B3] bg-blue-50' 
                    : 'border-gray-200 hover:border-[#0066B3] hover:bg-blue-50/50'}`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tz.city}</p>
                    <p className="text-xs text-gray-500">{tz.name} (UTC {tz.offset})</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Working Hours</h3>
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={workingHours.start}
                onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={workingHours.end}
                onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
              <span className="ml-3 text-sm text-gray-700">Automatically adjust for daylight savings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Add Location Button */}
      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#0066B3] hover:bg-blue-50 rounded-lg border border-[#0066B3] transition-colors">
        <Plus className="w-4 h-4" />
        <span>Add Custom Location</span>
      </button>
    </div>
  );
}
