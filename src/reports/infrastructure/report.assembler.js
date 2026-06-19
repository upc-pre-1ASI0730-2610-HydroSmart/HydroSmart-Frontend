import { Report } from '../domain/model/report.entity.js';

export const reportAssembler = {
  toEntity(data) {
    return new Report(
      data.id,
      data.title,
      data.description,
      data.date || data.generatedAt || data.startDate,
      data.typeName || data.type
    );
  },
///
  toDTO(report) {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      date: report.date,
      type: report.type,
    };
  },
};
