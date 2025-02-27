const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/api/employees`);
  if (!response.ok) throw new Error('Failed to fetch employees');
  return response.json();
};

export const createEmployee = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  role: string;
  departmentId: string;
  startDate: string;
  status?: string;
}) => {
  const response = await fetch(`${API_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.details || responseData.error || 'Failed to create employee');
  }
  
  return responseData;
};

export const deleteEmployee = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/employees/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.details || data.error || 'Failed to delete employee');
  }
  
  return data;
}; 