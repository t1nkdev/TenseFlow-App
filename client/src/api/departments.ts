const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDepartments = async () => {
  console.log('API call: getDepartments');
  const response = await fetch(`${API_URL}/api/departments`);
  if (!response.ok) throw new Error('Failed to fetch departments');
  const data = await response.json();
  console.log('API response:', data.length, 'departments');
  return data;
};

export const createDepartment = async (data: {
  name: string;
  description?: string;
  departmentId: string;
  manager: string | null;
  groups?: string[];
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}) => {
  console.log('API call: createDepartment', data);
  const response = await fetch(`${API_URL}/api/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log('API response from createDepartment:', responseData);
  
  if (!response.ok) {
    return {
      error: true,
      message: responseData.details || responseData.error || 'Failed to create department'
    };
  }
  
  return {
    error: false,
    data: responseData
  };
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

export const updateDepartment = async (id: string, data: {
  name: string;
  description?: string;
  departmentId: string;
  manager: string | null;
  groups?: string[];
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}) => {
  const response = await fetch(`${API_URL}/api/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  
  if (!response.ok) {
    return {
      error: true,
      message: responseData.details || responseData.error || 'Failed to update department'
    };
  }
  
  return {
    error: false,
    data: responseData
  };
}; 