// Client-safe formatting and defensive runtime checks for player-reported evidence.
// No device credential, storage URI or per-client identifier is exported.
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const nonnegative = value => Number.isSafeInteger(value) && value >= 0
const byType = value => record(value) && ['image','video','audio'].every(key => nonnegative(value[key]))

export function isPlaybackOverviewResponse(value) {
  if (!record(value) || !Array.isArray(value.data) || !record(value.summary) ||
      !record(value.pagination) || value.data.length > 12) return false
  const summary = value.summary
  const pagination = value.pagination
  if (![1,7,30].includes(summary.days) || !['all','tv','radio'].includes(summary.kind) ||
      summary.bucket_timezone !== 'UTC' ||
      summary.evidence !== 'authenticated_player_report_not_independent_audience' ||
      !nonnegative(summary.devices_total) || !nonnegative(summary.devices_with_reports) ||
      !nonnegative(summary.reports_total) || !byType(summary.by_type) ||
      !Array.isArray(summary.by_day) || summary.by_day.length > 32 ||
      !summary.by_day.every(day => record(day) && /^\d{4}-\d{2}-\d{2}$/.test(day.date) && nonnegative(day.total)) ||
      !Number.isSafeInteger(pagination.page) || pagination.page < 1 ||
      !Number.isSafeInteger(pagination.last_page) || pagination.last_page < 1 ||
      !nonnegative(pagination.total) || pagination.per_page !== 12) return false
  return value.data.every(row => record(row) &&
    Number.isSafeInteger(row.device_id) && row.device_id > 0 &&
    typeof row.name === 'string' && typeof row.device_type === 'string' &&
    nonnegative(row.reports_total) && byType(row.by_type) &&
    (row.last_reported_at === null || typeof row.last_reported_at === 'string'))
}

// Preserve Portuguese UTF-8, quote every field and neutralize spreadsheet formulas.
// Replace embedded control characters so one device name cannot manufacture extra rows.
export function csvCell(value) {
  const raw = String(value ?? '').replace(/[\u0000-\u001F\u007F\uFEFF]/g, ' ')
  const safe = /^\s*[=+\-@]/u.test(raw) ? "'" + raw : raw
  return '"' + safe.replaceAll('"','""') + '"'
}

export function buildPlaybackOverviewCsv(rows) {
  const headers = ['Dispositivo','Tipo','Relatos','Imagens','Vídeos','Áudios','Último relato (UTC)']
  const lines = rows.map(row => [
    row.name, row.device_type, row.reports_total, row.by_type.image,
    row.by_type.video, row.by_type.audio, row.last_reported_at ?? '',
  ].map(csvCell).join(';'))
  return '\uFEFF' + [headers.map(csvCell).join(';'),...lines].join('\r\n') + '\r\n'
}
