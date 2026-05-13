const API_BASE_URL = 'http://localhost:3001';

export const reportApi = {
  async getReports() {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) {
      throw new Error('Error al obtener reportes');
    }
    return response.json();
  },

  async getReportById(id) {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener reporte');
    }
    return response.json();
  },
//
  async createReport(reportData) {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error('Error al crear reporte');
    }
    return response.json();
  },

  async updateReport(id, reportData) {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar reporte');
    }
    return response.json();
  },

  async deleteReport(id) {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar reporte');
    }
  },
};
