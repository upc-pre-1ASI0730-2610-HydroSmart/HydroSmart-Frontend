import { ref } from 'vue';

import { Report } from '../domain/model/report.entity.js';
import { reportApi } from '../infrastructure/report-api.js';
import { reportAssembler } from '../infrastructure/report.assembler.js';

const reports = ref([]);
const loading = ref(false);
const error = ref('');

export function useReportStore() {
  const fetchReports = async () => {
    loading.value = true;
    error.value = '';

    try {
      const data = await reportApi.getReports();
      reports.value = Array.isArray(data) ? data.map(reportAssembler.toEntity) : [];
    } catch (err) {
      reports.value = [];
      error.value = err instanceof Error ? err.message : 'Error al cargar reportes';
    } finally {
      loading.value = false;
    }
  };

  const createReport = async (reportData) => {
    try {
      const data = await reportApi.createReport(reportData);
      const report = reportAssembler.toEntity(data);
      reports.value = [...reports.value, report];
      return report;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear reporte';
      throw err;
    }
  };

  const updateReport = async (id, reportData) => {
    try {
      const data = await reportApi.updateReport(id, reportData);
      const updatedReport = reportAssembler.toEntity(data);
      reports.value = reports.value.map(r => r.id === id ? updatedReport : r);
      return updatedReport;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar reporte';
      throw err;
    }
  };

  const deleteReport = async (id) => {
    try {
      await reportApi.deleteReport(id);
      reports.value = reports.value.filter(r => r.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar reporte';
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
  };
}
