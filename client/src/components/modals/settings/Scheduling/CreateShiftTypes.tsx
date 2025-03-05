'use client';
import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Check, Calendar, ChevronDown, AlertCircle } from 'lucide-react';
import { shiftTypesApi, type ShiftType } from '@/api/shiftTypes';
import { getShiftPlans } from '@/api/shiftPlans';
import { ShiftPlan } from '@/types/prismaTypes';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchShiftTypesByPlan,
  createShiftType,
  deleteShiftType
} from '@/store/features/shifts/shiftTypesSlice';
import { openSettingsModal } from '@/store/features/ui/uiSlice';

// Group colors by categories for better organization
const colorCategories = {
  primary: [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // yellow
    '#EF4444', // red
    '#EC4899', // pink
  ],
  secondary: [
    '#6366F1', // indigo
    '#14B8A6', // teal
    '#F97316', // orange
    '#A855F7', // violet
    '#06B6D4', // cyan
    '#D946EF', // fuchsia
  ],
  extended: [
    '#0EA5E9', // sky blue
    '#84CC16', // lime
    '#64748B', // slate
    '#9333EA', // purple-600
    '#4F46E5', // indigo-600
    '#0891B2', // cyan-600
    '#16A34A', // green-600
    '#CA8A04', // yellow-600
    '#DC2626', // red-600
    '#DB2777', // pink-600
    '#2563EB', // blue-600
    '#4338CA', // indigo-700
  ]
};

// Flat list for backward compatibility
const colorOptions = [
  ...colorCategories.primary,
  ...colorCategories.secondary,
  ...colorCategories.extended
];

export default function CreateShiftTypes() {
  const dispatch = useAppDispatch();
  const { list: shiftTypes, loading: isFetching } = useAppSelector(state => state.shiftTypes);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shiftPlans, setShiftPlans] = useState<ShiftPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ShiftPlan | null>(null);
  const [showExtendedColors, setShowExtendedColors] = useState(false);
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState({
    r: 59, // Default blue
    g: 130,
    b: 246
  });
  const [newShift, setNewShift] = useState({
    code: '',
    name: '',
    startTime: '',
    endTime: '',
    color: colorCategories.primary[0],
    requiresTime: true
  });

  // Fetch shift plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getShiftPlans();
        setShiftPlans(plans);
        if (plans.length > 0) {
          setSelectedPlan(plans[0]);
        }
      } catch (error) {
        console.error('Error fetching shift plans:', error);
        toast.error('Failed to fetch shift plans');
      }
    };
    fetchPlans();
  }, []);

  // Fetch shift types when selected plan changes
  useEffect(() => {
    if (selectedPlan) {
      dispatch(fetchShiftTypesByPlan(selectedPlan.id));
    }
  }, [selectedPlan, dispatch]);

  const handleAddShift = async () => {
    if (!selectedPlan) {
      toast.error('Please select a shift plan first', {
        position: 'bottom-right',
        richColors: true
      });
      return;
    }

    if (!newShift.code || !newShift.name) {
      toast.error('Please fill in all required fields', {
        position: 'bottom-right',
        richColors: true
      });
      return;
    }

    if (newShift.requiresTime && (!newShift.startTime || !newShift.endTime)) {
      toast.error('Please fill in all required time fields', {
        position: 'bottom-right',
        richColors: true
      });
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(createShiftType({
        code: newShift.code,
        name: newShift.name,
        color: newShift.color,
        requiresTime: newShift.requiresTime,
        startTime: newShift.startTime || undefined,
        endTime: newShift.endTime || undefined,
        shiftPlanId: selectedPlan.id
      })).unwrap();
      
      // Refresh shift types after creation
      await dispatch(fetchShiftTypesByPlan(selectedPlan.id));
      
      setIsAdding(false);
      setNewShift({
        code: '',
        name: '',
        startTime: '',
        endTime: '',
        color: colorCategories.primary[0],
        requiresTime: true
      });
    } catch (error) {
      console.error('Error creating shift type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShift = async (shift: ShiftType) => {
    try {
      await dispatch(deleteShiftType(shift)).unwrap();
      // Refresh shift types after deletion
      if (selectedPlan) {
        await dispatch(fetchShiftTypesByPlan(selectedPlan.id));
      }
    } catch (error) {
      console.error('Error deleting shift type:', error);
    }
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Apply custom color
  const applyCustomColor = () => {
    const hexColor = rgbToHex(customColor.r, customColor.g, customColor.b);
    setNewShift({ ...newShift, color: hexColor });
    setShowCustomColorPicker(false);
  };

  // Add this to your component where the color selection UI is
  const renderColorOptions = () => {
    // Determine which color sets to show based on the showExtendedColors state
    const colorsToShow = showExtendedColors 
      ? [...colorCategories.primary, ...colorCategories.secondary, ...colorCategories.extended]
      : [...colorCategories.primary, ...colorCategories.secondary];
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowExtendedColors(!showExtendedColors)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showExtendedColors ? 'Show fewer colors' : 'Show more colors'}
            </button>
            <button
              type="button"
              onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showCustomColorPicker ? 'Hide custom color' : 'Custom color'}
            </button>
          </div>
        </div>
        
        {showCustomColorPicker && (
          <div className="p-3 border rounded-md mb-2 bg-gray-50">
            <div className="mb-2 flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-md border border-gray-300" 
                style={{ backgroundColor: rgbToHex(customColor.r, customColor.g, customColor.b) }}
              />
              <div className="text-xs font-mono">
                {rgbToHex(customColor.r, customColor.g, customColor.b)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600">R: {customColor.r}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="255" 
                  value={customColor.r} 
                  onChange={(e) => setCustomColor({...customColor, r: parseInt(e.target.value)})}
                  className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">G: {customColor.g}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="255" 
                  value={customColor.g} 
                  onChange={(e) => setCustomColor({...customColor, g: parseInt(e.target.value)})}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">B: {customColor.b}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="255" 
                  value={customColor.b} 
                  onChange={(e) => setCustomColor({...customColor, b: parseInt(e.target.value)})}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={applyCustomColor}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply Color
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-6 gap-2">
          {colorsToShow.map((color) => (
            <div
              key={color}
              onClick={() => setNewShift({ ...newShift, color })}
              className={`h-8 w-8 rounded-full cursor-pointer border-2 ${
                newShift.color === color ? 'border-gray-900' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066B3]"></div>
      </div>
    );
  }

  if (shiftPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="p-4 bg-blue-50 rounded-xl mb-4">
          <Calendar className="w-8 h-8 text-[#0066B3]" />
        </div>
        <h3 className="text-base font-medium text-gray-900">No Shift Plans Created</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4 max-w-sm">
          Create a shift plan first to start managing shift types
        </p>
        <button
          onClick={() => dispatch(openSettingsModal({ initialTab: 1, initialItem: 0 }))}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066B3] text-white rounded-xl hover:bg-[#0066B3]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create Shift Plan</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shift Plan Selector */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Select Shift Plan
        </label>
        <select
          value={selectedPlan?.id || ''}
          onChange={(e) => {
            const plan = shiftPlans.find(p => p.id === e.target.value);
            if (plan) setSelectedPlan(plan);
          }}
          className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {shiftPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}{plan.department?.name ? ` (${plan.department.name})` : ''}
            </option>
          ))}
        </select>
        {selectedPlan && (
          <div className="mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {new Date(selectedPlan.startDate).toLocaleDateString()} - {new Date(selectedPlan.endDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* No Shift Plan Selected Message */}
      {!selectedPlan ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">Please select a shift plan to manage shift types</p>
        </div>
      ) : (
        <>
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
                    onClick={() => handleDeleteShift(shift)}
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

                {renderColorOptions()}

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
        </>
      )}
    </div>
  );
}
