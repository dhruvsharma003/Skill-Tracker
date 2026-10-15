const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('skilltrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('skilltrack_token');
    localStorage.removeItem('skilltrack_user');
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Session expired or unauthorized');
  }

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
};

export const api = {
  // Auth endpoints
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Modules endpoint
  getModules: async () => {
    const res = await fetch(`${API_BASE_URL}/modules`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Graduate endpoints
  getGraduateProgress: async () => {
    const res = await fetch(`${API_BASE_URL}/graduate/progress`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateGraduateProgress: async (moduleId, payload) => {
    const res = await fetch(`${API_BASE_URL}/graduate/progress/${moduleId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Mentor endpoints
  getMentorGraduates: async () => {
    const res = await fetch(`${API_BASE_URL}/mentor/graduates`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getMentorGraduateDetails: async (graduateId) => {
    const res = await fetch(`${API_BASE_URL}/mentor/graduates/${graduateId}/progress`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getCohortStats: async () => {
    const res = await fetch(`${API_BASE_URL}/mentor/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  downloadCsvExport: async () => {
    const token = localStorage.getItem('skilltrack_token');
    const res = await fetch(`${API_BASE_URL}/mentor/export`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) {
      throw new Error('Failed to export CSV');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skilltrack_cohort_progress_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
