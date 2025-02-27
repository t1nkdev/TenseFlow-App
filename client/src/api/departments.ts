const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDepartments = async () => {
  const response = await fetch(`${API_URL}/api/departments`);
  if (!response.ok) throw new Error('Failed to fetch departments');
  return response.json();
};

export const createDepartment = async (data: {
  name: string;
  description: string;
  status: string;
  manager: string | null;
}) => {
  const response = await fetch(`${API_URL}/api/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    throw new Error(responseData.details || responseData.error || 'Failed to create department');
  }
  
  return responseData;
};

export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/api/departments/employees`);
  if (!response.ok) throw new Error('Failed to fetch employees');
  return response.json();
};

export const deleteDepartment = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/departments/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.details || data.error || 'Failed to delete department');
  }
  
  return data;
}; 