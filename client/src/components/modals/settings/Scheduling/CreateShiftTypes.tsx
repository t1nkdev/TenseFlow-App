'use client';
import React, { useState } from 'react';
import { Clock, Plus, Trash2, Check, Calendar } from 'lucide-react';
import { useShiftTypes } from '@/context/ShiftTypesContext';

interface ShiftType {
  id: string;
  code: string;
  name: string;
  startTime?: string;
  endTime?: string;
  color: string;
  requiresTime: boolean;
}

const defaultShiftTypes: ShiftType[] = [
  { id: '1', code: 'MOR', name: 'Morning', startTime: '06:00', endTime: '14:00', color: '#3B82F6', requiresTime: true },
  { id: '2', code: 'AFT', name: 'Afternoon', startTime: '14:00', endTime: '22:00', color: '#10B981', requiresTime: true },
  { id: '3', code: 'NIT', name: 'Night', startTime: '22:00', endTime: '06:00', color: '#8B5CF6', requiresTime: true },
  { id: '4', code: 'KRK', name: 'Krank', color: '#EF4444', requiresTime: false },
  { id: '5', code: 'URL', name: 'Urlaub', color: '#F59E0B', requiresTime: false },
];

const colorOptions = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // yellow
  '#EF4444', // red
  '#EC4899', // pink
];

export default function CreateShiftTypes() {
  const { shiftTypes, setShiftTypes } = useShiftTypes();
  const [isAdding, setIsAdding] = useState(false);
  const [newShift, setNewShift] = useState<Partial<ShiftType>>({
    code: '',
    name: '',
    startTime: '',
    endTime: '',
    color: colorOptions[0],
    requiresTime: true
  });

  // Initialize shift types if empty
  React.useEffect(() => {
    if (shiftTypes.length === 0) {
      setShiftTypes(defaultShiftTypes);
    }
  }, []);

  const handleAddShift = () => {
    if (newShift.code && newShift.name) {
      // Only validate times if requiresTime is true
      if (newShift.requiresTime && (!newShift.startTime || !newShift.endTime)) {
        return; // Don't add if times are required but missing
      }

      setShiftTypes([...shiftTypes, {
        id: Date.now().toString(),
        code: newShift.code,
        name: newShift.name,
        startTime: newShift.requiresTime ? newShift.startTime : undefined,
        endTime: newShift.requiresTime ? newShift.endTime : undefined,
        color: newShift.color || colorOptions[0],
        requiresTime: newShift.requiresTime || false
      }]);
      setIsAdding(false);
      setNewShift({
        code: '',
        name: '',
        startTime: '',
        endTime: '',
        color: colorOptions[0],
        requiresTime: true
      });
    }
  };

  const handleDeleteShift = (id: string) => {
    setShiftTypes(shiftTypes.filter(shift => shift.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Existing Shift Types */}
      <div className="grid grid-cols-2 gap-4">
        {shiftTypes.map((shift) => (
          <div 
            key={shift.id}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="min-w-[2.5rem] h-10 px-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${shift.color}15` }}
                >
                  <span className="text-sm font-semibold" style={{ color: shift.color }}>
                    {shift.code}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{shift.name}</h3>
                  {shift.requiresTime && (
                    <p className="text-xs text-gray-500">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteShift(shift.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Shift Type */}
      {isAdding ? (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Shift Code <span className="text-gray-400">(max 3 letters)</span>
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={newShift.code}
                  onChange={(e) => setNewShift({ ...newShift, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="MOR"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shift Name</label>
                <input
                  type="text"
                  value={newShift.name}
                  onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Morning"
                />
              </div>
            </div>

            {/* Time Toggle */}
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newShift.requiresTime}
                  onChange={(e) => setNewShift({ ...newShift, requiresTime: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066B3]"></div>
                <span className="ml-3 text-sm text-gray-700">Requires Time Specification</span>
              </label>
            </div>

            {/* Time Fields - Only show if requiresTime is true */}
            {newShift.requiresTime && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Shift Color</label>
              <div className="flex items-center gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewShift({ ...newShift, color })}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      newShift.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {newShift.color === color && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShift}
                className="px-3 py-1.5 text-sm text-white bg-[#0066B3] hover:bg-[#0066B3]/90 rounded-lg transition-colors"
              >
                Add Shift Type
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-500/20 hover:bg-blue-50 hover:text-[#0066B3] transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add New Shift Type</span>
          </div>
        </button>
      )}
    </div>
  );
}
