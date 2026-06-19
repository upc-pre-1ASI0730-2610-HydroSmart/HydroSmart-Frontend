const API_BASE_URL = import.meta.env.VITE_REPORTS_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001';
const buildUrl = (path) => `${API_BASE_URL}${path}`;

const getAuthToken = () => localStorage.getItem('authToken');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
});

export const reportApi = {
  async getReports() {
    const response = await fetch(buildUrl('/reports'), {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al obtener reportes (${response.status})`);
    }
    return response.json();
  },

  async getReportById(id) {
    const response = await fetch(buildUrl(`/reports/${id}`), {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al obtener reporte');
    }
    return response.json();
  },
//
  async createReport(reportData) {
    const response = await fetch(buildUrl('/reports'), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error('Error al crear reporte');
    }
    return response.json();
  },

  async updateReport(id, reportData) {
    const response = await fetch(buildUrl(`/reports/${id}`), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar reporte');
    }
    return response.json();
  },

  async deleteReport(id) {
    const response = await fetch(buildUrl(`/reports/${id}`), {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al eliminar reporte');
    }
  },
};
