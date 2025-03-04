import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ShiftType {
  id: string;
  code: string;
  name: string;
  color: string;
  startTime?: string; 
  endTime?: string;
  requiresTime: boolean;
  shiftPlanId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftTypeDto {
  code: string;
  name: string;
  color: string;
  startTime?: string;
  endTime?: string;
  requiresTime: boolean;
  shiftPlanId: string;
}

export interface ShiftPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  departments: { id: string; department: { id: string; name: string } }[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export const shiftTypesApi = {
  // Get or create default shift plan
  getOrCreateDefaultShiftPlan: async (): Promise<string> => {
    try {
      // First try to get the default shift plan
      const response = await axios.get(`${API_URL}/api/shift-plans/default`);
      return response.data.id;
    } catch (error) {
      // If not found, create a new default shift plan
      const defaultPlan = {
        name: 'Default Shift Plan',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        departmentIds: ['default'], // You'll need to replace this with a real department ID
        status: 'DRAFT'
      };
      
      const response = await axios.post(`${API_URL}/api/shift-plans`, defaultPlan);
      return response.data.id;
    }
  },

  // Create a new shift type
  create: async (data: CreateShiftTypeDto): Promise<ShiftType> => {
    const response = await axios.post(`${API_URL}/api/shift-types`, data);
    return response.data;
  },

  // Get all shift types for a specific shift plan
  getByPlan: async (shiftPlanId: string): Promise<ShiftType[]> => {
    const response = await axios.get(`${API_URL}/api/shift-types/plan/${shiftPlanId}`);
    return response.data;
  },

  // Update a shift type
  update: async (id: string, data: Partial<CreateShiftTypeDto>): Promise<ShiftType> => {
    const response = await axios.put(`${API_URL}/api/shift-types/${id}`, data);
    return response.data;
  },

  // Delete a shift type
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/shift-types/${id}`);
  }
}; 