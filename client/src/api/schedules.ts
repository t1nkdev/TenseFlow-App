const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ScheduleChange {
  employeeId: string;
  date: string; // ISO date string
  shiftTypeId: string;
}

// Save schedule changes for a shift plan
export const saveScheduleChanges = async (planId: string, changes: ScheduleChange[]) => {
  try {
    const url = `${API_URL}/api/schedules/${planId}`;
    console.log('Saving schedule changes to URL:', url);
    console.log('Changes data:', JSON.stringify(changes, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changes }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from server:', text);
      throw new Error(`Failed to save schedule changes: ${response.status} ${text}`);
    }

    const result = await response.json();
    console.log('Server response:', result);
    return result;
  } catch (error) {
    console.error('Error saving schedule changes:', error);
    throw error;
  }
};

// Get schedules for a shift plan
export const getSchedules = async (planId: string) => {
  try {
    const url = `${API_URL}/api/schedules/${planId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get schedules: ${response.status} ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting schedules:', error);
    throw error;
  }
};

// Delete a schedule
export const deleteSchedule = async (scheduleId: string) => {
  try {
    const url = `${API_URL}/api/schedules/${scheduleId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete schedule: ${response.status} ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};