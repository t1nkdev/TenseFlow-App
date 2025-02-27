const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getShiftPlans = async () => {
  const response = await fetch(`${API_URL}/api/shift-plans`);
  if (!response.ok) throw new Error('Failed to fetch shift plans');
  return response.json();
};

export const getShiftPlanDetails = async (planId: string) => {
  const response = await fetch(`${API_URL}/api/shift-plans/${planId}/details`);
  if (!response.ok) throw new Error('Failed to fetch shift plan details');
  return response.json();
};

export const createShiftPlan = async (data: {
  name: string;
  startDate: string;
  endDate: string;
  departmentId: string;
  shiftType: 'rotating' | 'fixed';
  status?: string;
}) => {
  const response = await fetch(`${API_URL}/api/shift-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.details || responseData.error || 'Failed to create shift plan');
  }
  
  return responseData;
};

export const deleteShiftPlan = async (id: string) => {
  const response = await fetch(`${API_URL}/api/shift-plans/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.details || data.error || 'Failed to delete shift plan');
  }

  const data = await response.json();
  return data;
}; 