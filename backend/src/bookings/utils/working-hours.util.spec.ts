import { getOpenCloseForDay, weekdayKeyFromYmd } from './working-hours.util';

describe('working-hours.util', () => {
  it('weekdayKeyFromYmd returns expected weekday', () => {
    expect(weekdayKeyFromYmd('2026-04-07')).toBe('tuesday');
  });

  it('getOpenCloseForDay reads admin UI shape { slots, isHoliday }', () => {
    const wh = {
      monday: {
        slots: [{ open: '09:00', close: '17:00' }],
        isHoliday: false,
      },
    };
    expect(getOpenCloseForDay(wh, 'monday')).toEqual({
      open: '09:00',
      close: '17:00',
    });
  });

  it('getOpenCloseForDay returns null when holiday', () => {
    const wh = {
      monday: {
        slots: [{ open: '09:00', close: '17:00' }],
        isHoliday: true,
      },
    };
    expect(getOpenCloseForDay(wh, 'monday')).toBeNull();
  });

  it('getOpenCloseForDay supports simple { open, close }', () => {
    const wh = { monday: { open: '10:00', close: '18:00' } };
    expect(getOpenCloseForDay(wh, 'monday')).toEqual({
      open: '10:00',
      close: '18:00',
    });
  });
});
