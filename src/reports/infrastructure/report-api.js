import { buildApiUrl } from '@/shared/infrastructure/api-config.js'

const buildUrl = (path) => buildApiUrl(path, 'VITE_REPORTS_API_BASE_URL');

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
