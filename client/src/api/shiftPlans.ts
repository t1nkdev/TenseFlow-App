const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to safely parse JSON and handle HTML responses
const safeParseJSON = async (response: Response) => {
  const text = await response.text();
  
  // Log the raw response for debugging
  console.log('Raw API Response:', {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: text.substring(0, 200) + '...'
  });
  
  // Check if the response is HTML (likely an error page)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    console.error('API Error - Received HTML instead of JSON:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: text.substring(0, 200) + '...'
    });
    throw new Error(`Server returned HTML instead of JSON. Status: ${response.status} ${response.statusText}`);
  }
  
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Error - Failed to parse JSON response:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      body: text.substring(0, 200) + '...'
    });
    throw new Error('Invalid JSON response from server');
  }
};

// Helper function to handle fetch errors
const handleFetchError = (error: any, url: string) => {
  console.error('Fetch Error:', {
    url,
    error: error.message,
    type: error.name,
    stack: error.stack
  });
  
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    throw new Error(`Could not connect to the server at ${url}. Make sure the server is running.`);
  }
  
  throw error;
};

export const getShiftPlans = async () => {
  try {
    const url = `${API_URL}/api/shift-plans`;
    console.log('Fetching shift plans from:', url);
    
    const response = await fetch(url).catch(error => handleFetchError(error, url));
    const data = await safeParseJSON(response);
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch shift plans: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching shift plans:', error);
    throw error;
  }
};

export const getShiftPlanDetails = async (planId: string) => {
  try {
    const url = `${API_URL}/api/shift-plans/${planId}/details`;
    console.log('Fetching shift plan details from:', url);
    
    const response = await fetch(url);
    const data = await safeParseJSON(response);
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch shift plan details: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching shift plan details:', error);
    throw error;
  }
};

export const createShiftPlan = async (data: {
  name: string;
  startDate: string;
  endDate: string;
  departmentIds: string[];
  shiftType: 'rotating' | 'fixed';
  status?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/shift-plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseData = await safeParseJSON(response);
    
    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || `Failed to create shift plan: ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error creating shift plan:', error);
    throw error;
  }
};

export const deleteShiftPlan = async (id: string) => {
  try {
    const url = `${API_URL}/api/shift-plans/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
    }).catch(error => handleFetchError(error, url));

    const responseData = await safeParseJSON(response);
    
    if (!response.ok) {
      const errorMessage = responseData.details || responseData.error || `Failed to delete shift plan: ${response.status}`;
      console.error('Delete failed:', {
        url,
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    // Clear localStorage data for this plan
    const storageKey = `selectedDepartment_${id}`;
    localStorage.removeItem(storageKey);
    console.log('Cleared localStorage data for deleted plan:', id);
    
    return responseData;
  } catch (error) {
    console.error('Error deleting shift plan:', error);
    throw error;
  }
};

export const updateShiftPlanStatus = async (id: string, status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') => {
  try {
    const response = await fetch(`${API_URL}/api/shift-plans/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await safeParseJSON(response);
    
    if (!response.ok) {
      throw new Error(data.details || data.error || `Failed to update shift plan status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating shift plan status:', error);
    throw error;
  }
};

export const updateShiftPlan = async (id: string, data: {
  name: string;
  startDate: string;
  endDate: string;
  departmentIds: string[];
  shiftType: 'rotating' | 'fixed';
  status?: string;
}) => {
  try {
    const url = `${API_URL}/api/shift-plans/${id}`;
    console.log('Updating shift plan at:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(error => handleFetchError(error, url));

    const responseData = await safeParseJSON(response);
    
    if (!response.ok) {
      const errorMessage = responseData.details || responseData.error || `Failed to update shift plan: ${response.status}`;
      console.error('Update failed:', {
        url,
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error updating shift plan:', error);
    throw error;
  }
};

export const updateDepartmentOrder = async (planId: string, departmentIds: string[]) => {
  try {
    const url = `${API_URL}/api/shift-plans/${planId}/department-order`;
    console.log('Updating department order at:', url);
    console.log('Department IDs in order:', departmentIds);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departmentIds }),
    }).catch(error => handleFetchError(error, url));

    if (!response) {
      throw new Error('Network response was not ok');
    }

    const responseData = await safeParseJSON(response);
    
    if (!response.ok) {
      const errorMessage = responseData.details || responseData.error || `Failed to update department order: ${response.status}`;
      console.error('Update failed:', {
        url,
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    console.log('Department order updated successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error updating department order:', error);
    throw error;
  }
};