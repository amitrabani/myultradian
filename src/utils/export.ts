import type { FocusRecord } from '../types/record';
import { TASK_TYPE_LABELS } from '../types/record';
import { formatDateTimeDisplay } from './time';
import { calculateRecordDuration } from './statistics';

/**
 * Export focus records to CSV format
 */
export function exportRecordsToCSV(records: FocusRecord[]): void {
  const headers = [
    'Date',
    'Topic',
    'Task Type',
    'Goal',
    'Template',
    'Duration (min)',
    'Completed',
    'Energy Level',
    'Distractions',
    'Notes',
  ];

  const rows = records.map(record => [
    formatDateTimeDisplay(new Date(record.createdAt)),
    escapeCSV(record.tags.topic),
    TASK_TYPE_LABELS[record.tags.taskType] || record.tags.taskType,
    escapeCSV(record.tags.goal || ''),
    escapeCSV(record.templateName),
    Math.round(calculateRecordDuration(record)),
    record.completed ? 'Yes' : 'No',
    record.selfReport?.energyLevel || '',
    record.selfReport?.distractionCount || 0,
    escapeCSV(record.selfReport?.notes || ''),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, `focus-records-${formatDateForFilename(new Date())}.csv`);
}

/**
 * Escape a value for CSV (handle commas and quotes)
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format date for filename (YYYY-MM-DD)
 */
function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Trigger download of CSV file
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export records to JSON format for backup
 */
export function exportRecordsToJSON(records: FocusRecord[]): void {
  const content = JSON.stringify(records, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `focus-records-${formatDateForFilename(new Date())}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
