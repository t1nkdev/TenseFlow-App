'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ShiftType {
  id: string;
  code: string;
  name: string;
  startTime?: string;
  endTime?: string;
  color: string;
  requiresTime: boolean;
}

interface ShiftTypesContextType {
  shiftTypes: ShiftType[];
  setShiftTypes: React.Dispatch<React.SetStateAction<ShiftType[]>>;
}

const ShiftTypesContext = createContext<ShiftTypesContextType | undefined>(undefined);

export function ShiftTypesProvider({ children }: { children: ReactNode }) {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);

  return (
    <ShiftTypesContext.Provider value={{ shiftTypes, setShiftTypes }}>
      {children}
    </ShiftTypesContext.Provider>
  );
}

export function useShiftTypes() {
  const context = useContext(ShiftTypesContext);
  if (context === undefined) {
    throw new Error('useShiftTypes must be used within a ShiftTypesProvider');
  }
  return context;
} 