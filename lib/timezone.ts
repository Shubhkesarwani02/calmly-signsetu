/**
 * Timezone utilities for Indian Standard Time (IST)
 * IST is UTC+5:30
 */

export const IST_TIMEZONE = 'Asia/Kolkata';
export const IST_OFFSET_HOURS = 5;
export const IST_OFFSET_MINUTES = 30;

/**
 * Convert a date to IST string format
 */
export function toISTString(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format date for display in IST
 */
export function formatISTDateTime(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: IST_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format time only in IST
 */
export function formatISTTime(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get current time in IST
 */
export function getCurrentISTTime(): Date {
  return new Date();
}

/**
 * Convert local datetime-local input to UTC for database storage
 */
export function localDateTimeToUTC(localDateTime: string): Date {
  // Treat the input as IST and convert to UTC
  const localDate = new Date(localDateTime);
  return localDate;
}

/**
 * Convert UTC date from database to local datetime-local format for input
 */
export function utcToLocalDateTime(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  
  // Convert to IST and format for datetime-local input
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: IST_TIMEZONE }));
  
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Check if a time is in the next 10 minutes (for reminder logic)
 */
export function isWithinNext10Minutes(targetTime: Date): boolean {
  const now = getCurrentISTTime();
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  
  return targetTime >= fiveMinutesFromNow && targetTime <= tenMinutesFromNow;
}