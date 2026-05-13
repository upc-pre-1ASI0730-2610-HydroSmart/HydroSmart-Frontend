<template>
  <section class="reports-shell">

    <!-- Header -->
    <div class="reports-header">
      <div class="reports-header__titles">
        <h1 class="reports-header__title">{{ t('reports.pageTitle') }}</h1>
        <p class="reports-header__subtitle">{{ t('reports.pageSubtitle') }}</p>
      </div>
      <div class="reports-header__banners">
        <div class="banner banner--success">
          <span class="banner__label">{{ t('reports.banner.goodMonth') }}</span>
          <span class="banner__text">{{ t('reports.banner.goodMonthDesc') }}</span>
        </div>
        <div class="banner banner--info">
          <span class="banner__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
          </span>
          <span class="banner__text">{{ t('reports.banner.tip') }}</span>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row">

      <!-- Device Ranking -->
      <div class="chart-card">
        <h2 class="chart-card__title">{{ t('reports.deviceRanking') }}</h2>
        <div class="bar-chart-h">
          <div
              v-for="(device, i) in deviceRanking"
              :key="device.name"
              class="bar-h-row"
          >
            <span class="bar-h-row__label">{{ device.name }}</span>
            <div class="bar-h-row__track">
              <div
                  class="bar-h-row__fill"
                  :class="`bar-h-row__fill--${i}`"
                  :style="{ width: (device.value / maxDeviceValue * 100) + '%' }"
              ></div>
            </div>
            <span class="bar-h-row__value">{{ device.value.toLocaleString() }} L</span>
          </div>
          <div class="bar-h-axis">
            <span v-for="tick in xTicks" :key="tick">{{ tick }}</span>
          </div>
        </div>
        <p class="chart-card__note">{{ t('reports.deviceNote') }}</p>
      </div>

      <!-- Weekly avg consumption -->
      <div class="chart-card">
        <h2 class="chart-card__title">{{ t('reports.weeklyAvg') }}</h2>
        <div class="bar-chart-v">
          <div class="bar-v-legend">
            <span class="bar-v-legend__dot"></span>
            <span class="bar-v-legend__label">{{ t('reports.weeklyAvgLegend') }}</span>
          </div>
          <div class="bar-v-bars">
            <div
                v-for="day in weeklyData"
                :key="day.day"
                class="bar-v-col"
            >
              <div class="bar-v-col__track">
                <div
                    class="bar-v-col__fill"
                    :style="{ height: (day.value / maxWeeklyValue * 100) + '%' }"
                ></div>
              </div>
              <span class="bar-v-col__label">{{ day.day }}</span>
            </div>
          </div>
        </div>
        <p class="chart-card__note">{{ t('reports.weeklyNote') }}</p>
      </div>

    </div>

    <!-- Export section -->
    <div class="export-card">
      <h2 class="export-card__title">{{ t('reports.export.title') }}</h2>
      <div class="export-card__controls">
        <div class="export-field">
          <label class="export-field__label">{{ t('reports.export.format') }}</label>
          <select v-model="exportFormat" class="export-field__select">
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="XLSX">XLSX</option>
          </select>
        </div>
        <div class="export-field export-field--checkboxes">
          <label class="export-checkbox">
            <input type="checkbox" v-model="exportTotal" />
            <span>{{ t('reports.export.total') }}</span>
          </label>
          <label class="export-checkbox">
            <input type="checkbox" v-model="exportLastMonth" />
            <span>{{ t('reports.export.lastMonth') }}</span>
          </label>
          <label class="export-checkbox">
            <input type="checkbox" v-model="exportLastWeek" />
            <span>{{ t('reports.export.lastWeek') }}</span>
          </label>
        </div>
        <button class="btn-download" type="button" @click="handleDownload">
          {{ t('reports.export.download') }}
        </button>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const deviceRanking = ref([
  { name: 'Lavabo Cocina 1', value: 14200 },
  { name: 'Lavabo Baño 1',   value: 7800  },
  { name: 'Inodoro Baño 1',  value: 4100  },
])
const maxDeviceValue = computed(() => Math.max(...deviceRanking.value.map(d => d.value)))
const xTicks = ['2K L', '4K L', '6K L', '8K L', '10K L', '12K L', '14K L']

const weeklyData = ref([
  { day: 'LUN', value: 420 },
  { day: 'MAR', value: 530 },
  { day: 'MIE', value: 620 },
  { day: 'JUE', value: 390 },
  { day: 'VIE', value: 710 },
  { day: 'SAB', value: 850 },
  { day: 'DOM', value: 920 },
])
const maxWeeklyValue = computed(() => Math.max(...weeklyData.value.map(d => d.value)))

const exportFormat    = ref('PDF')
const exportTotal     = ref(false)
const exportLastMonth = ref(true)
const exportLastWeek  = ref(false)

// Build the data rows to export based on selected checkboxes
const buildRows = () => {
  const rows = []
  if (exportLastMonth.value || exportTotal.value) {
    rows.push({ seccion: 'Ranking de dispositivos (mes actual)', dispositivo: '', litros: '' })
    deviceRanking.value.forEach(d => {
      rows.push({ seccion: '', dispositivo: d.name, litros: d.value })
    })
  }
  if (exportLastWeek.value || exportTotal.value) {
    rows.push({ seccion: 'Consumo semanal', dispositivo: '', litros: '' })
    weeklyData.value.forEach(d => {
      rows.push({ seccion: '', dispositivo: d.day, litros: d.value })
    })
  }
  if (rows.length === 0) {
    // default: export everything
    rows.push({ seccion: 'Ranking de dispositivos', dispositivo: '', litros: '' })
    deviceRanking.value.forEach(d => rows.push({ seccion: '', dispositivo: d.name, litros: d.value }))
    rows.push({ seccion: 'Consumo semanal', dispositivo: '', litros: '' })
    weeklyData.value.forEach(d => rows.push({ seccion: '', dispositivo: d.day, litros: d.value }))
  }
  return rows
}

const downloadCSV = () => {
  const rows = buildRows()
  const header = 'Sección,Dispositivo / Día,Litros\n'
  const body = rows.map(r => `"${r.seccion}","${r.dispositivo}","${r.litros}"`).join('\n')
  const blob = new Blob(['\uFEFF' + header + body], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, 'reporte-hydrosmart.csv')
}

const downloadPDF = () => {
  const rows = buildRows()
  const date = new Date().toLocaleDateString('es-PE')

  const tableRows = rows.map(r => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;color:#334155">${r.seccion}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;color:#334155">${r.dispositivo}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;color:#334155;text-align:right">${r.litros !== '' ? r.litros + ' L' : ''}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Reporte HydroSmart</title>
  <style>body{font-family:sans-serif;color:#0f172a;padding:40px}h1{color:#1e3a8a}table{width:100%;border-collapse:collapse}th{background:#1e3a8a;color:#fff;padding:8px 10px;text-align:left}</style>
  </head><body>
  <h1>Reporte HydroSmart</h1>
  <p style="color:#64748b">Generado el ${date}</p>
  <table><thead><tr><th>Sección</th><th>Dispositivo / Día</th><th style="text-align:right">Litros</th></tr></thead>
  <tbody>${tableRows}</tbody></table>
  </body></html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
  triggerDownload(blob, 'reporte-hydrosmart.html')
}

const downloadXLSX = () => {
  // Simple XLSX-compatible TSV wrapped in XML SpreadsheetML
  const rows = buildRows()
  const header = '<Row><Cell><Data ss:Type="String">Sección</Data></Cell><Cell><Data ss:Type="String">Dispositivo / Día</Data></Cell><Cell><Data ss:Type="String">Litros</Data></Cell></Row>'
  const body = rows.map(r => `<Row>
    <Cell><Data ss:Type="String">${r.seccion}</Data></Cell>
    <Cell><Data ss:Type="String">${r.dispositivo}</Data></Cell>
    <Cell><Data ss:Type="${typeof r.litros === 'number' ? 'Number' : 'String'}">${r.litros}</Data></Cell>
  </Row>`).join('')

  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Reporte">
    <Table>${header}${body}</Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  triggerDownload(blob, 'reporte-hydrosmart.xls')
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const handleDownload = () => {
  if (exportFormat.value === 'CSV')       downloadCSV()
  else if (exportFormat.value === 'XLSX') downloadXLSX()
  else                                    downloadPDF()
}
</script>

<style scoped>
.reports-shell {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 2rem 2.25rem;
}

.reports-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.reports-header__titles { flex: 0 0 auto; }

.reports-header__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.15rem;
  color: #0f172a;
}

.reports-header__subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.reports-header__banners {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-left: auto;
}

.banner {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 220px;
  padding: 0.75rem 1rem;
}

.banner--success { background-color: #1e3a8a; color: #ffffff; }

.banner--info {
  background-color: #1e3a8a;
  color: #ffffff;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
}

.banner__label { font-weight: 700; font-size: 0.95rem; }
.banner__text  { font-size: 0.82rem; line-height: 1.35; }
.banner__icon  { flex-shrink: 0; margin-top: 1px; }

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 800px) { .charts-row { grid-template-columns: 1fr; } }

.chart-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 1.5rem 1rem;
}

.chart-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  color: #0f172a;
}

.chart-card__note {
  font-size: 0.82rem;
  color: #64748b;
  margin: 1rem 0 0;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.75rem;
  line-height: 1.4;
}

/* Horizontal bars */
.bar-chart-h { display: flex; flex-direction: column; gap: 0.65rem; }

.bar-h-row {
  display: grid;
  grid-template-columns: 130px 1fr 60px;
  align-items: center;
  gap: 0.75rem;
}

.bar-h-row__label {
  font-size: 0.88rem;
  color: #334155;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-h-row__track {
  background: #f1f5f9;
  border-radius: 6px;
  height: 28px;
  overflow: hidden;
}

.bar-h-row__fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease;
}

.bar-h-row__fill--0 { background: #1e3a8a; }
.bar-h-row__fill--1 { background: #3b82f6; }
.bar-h-row__fill--2 { background: #93c5fd; }

.bar-h-row__value { font-size: 0.82rem; color: #475569; font-weight: 600; }

.bar-h-axis {
  display: flex;
  justify-content: space-between;
  padding-left: 138px;
  margin-top: 0.25rem;
}

.bar-h-axis span { font-size: 0.72rem; color: #94a3b8; }

/* Vertical bars */
.bar-chart-v { display: flex; flex-direction: column; gap: 0.75rem; }

.bar-v-legend { display: flex; align-items: center; gap: 0.4rem; }

.bar-v-legend__dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  display: inline-block;
}

.bar-v-legend__label { font-size: 0.82rem; color: #3b82f6; font-weight: 600; }

.bar-v-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 140px;
}

.bar-v-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  flex: 1;
}

.bar-v-col__track {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: flex-end;
  background: #f8fafc;
  border-radius: 6px;
  overflow: hidden;
}

.bar-v-col__fill {
  width: 100%;
  background: linear-gradient(to top, #1e3a8a, #93c5fd);
  border-radius: 6px 6px 0 0;
  transition: height 0.6s ease;
}

.bar-v-col__label { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

/* Export */
.export-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.export-card__title { font-size: 1.15rem; font-weight: 700; margin: 0; color: #0f172a; }

.export-card__controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.export-field { display: flex; align-items: center; gap: 0.5rem; }

.export-field__label { font-size: 0.88rem; color: #475569; white-space: nowrap; }

.export-field__select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.88rem;
  padding: 0.4rem 0.6rem;
  color: #0f172a;
  background: #ffffff;
  cursor: pointer;
}

.export-field--checkboxes { display: flex; gap: 1rem; }

.export-checkbox {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.88rem;
  color: #334155;
  cursor: pointer;
}

.export-checkbox input[type="checkbox"] { accent-color: #1e3a8a; width: 15px; height: 15px; }

.btn-download {
  background: #0f172a;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  transition: background 0.2s;
  margin-left: auto;
}

.btn-download:hover { background: #1e3a8a; }

.export-card__email-row { display: flex; align-items: center; gap: 0.75rem; }

.export-field__input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.88rem;
  padding: 0.45rem 0.85rem;
  color: #0f172a;
  width: 231px;
}

.export-field__input:focus { outline: 2px solid #3b82f6; outline-offset: 1px; }

.btn-send {
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  transition: background 0.2s;
}

.btn-send:hover { background: #1d4ed8; }
</style>