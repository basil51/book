/** weekday key: monday … sunday */
export function weekdayKeyFromYmd(ymd: string): string {
  const parts = ymd.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return 'monday';
  }
  const [y, m, d] = parts;
  const localNoon = new Date(y, m - 1, d, 12, 0, 0, 0);
  const keys = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;
  return keys[localNoon.getDay()];
}

/**
 * Supports DTO shape (arrays per day), simple { open, close }, or legacy string (returns null).
 */
export function getOpenCloseForDay(
  working_hours: unknown,
  weekdayKey: string,
): { open: string; close: string } | null {
  if (!working_hours || typeof working_hours !== 'object') {
    return null;
  }
  const wh = working_hours as Record<string, unknown>;
  const raw = wh[weekdayKey];
  if (!raw) {
    return null;
  }
  if (Array.isArray(raw)) {
    const first = raw[0] as { open?: string; close?: string } | undefined;
    if (first?.open && first?.close) {
      return { open: first.open, close: first.close };
    }
    return null;
  }
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    const day = raw as {
      open?: string;
      close?: string;
      isHoliday?: boolean;
      slots?: { open?: string; close?: string }[];
    };
    if (day.isHoliday) {
      return null;
    }
    if (day.slots?.length) {
      const first = day.slots[0];
      if (first?.open && first?.close) {
        return { open: first.open, close: first.close };
      }
    }
    if (day.open && day.close) {
      return { open: day.open, close: day.close };
    }
  }
  return null;
}
