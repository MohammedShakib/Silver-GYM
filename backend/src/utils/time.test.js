import { describe, it, expect, vi, afterEach } from 'vitest';
import { getOpenStatus } from './time';

describe('getOpenStatus', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const openingHours = [
    { dayOfWeek: 'Monday', openTime: '06:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 'Tuesday', openTime: '00:00', closeTime: '23:59', isClosed: false }, // 24/7
    { dayOfWeek: 'Wednesday', openTime: '18:00', closeTime: '02:00', isClosed: false }, // Overnight
    { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true }, // Closed
  ];

  it('returns CLOSED when no hours exist', () => {
    expect(getOpenStatus([]).status).toBe('CLOSED');
  });

  it('returns OPEN for normal daytime gym', () => {
    const date = new Date('2026-10-05T12:00:00+06:00'); // Monday 12 PM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('OPEN');
    expect(result.todayOpenTime).toBe('06:00');
  });

  it('returns CLOSING_SOON when within 60 mins', () => {
    const date = new Date('2026-10-05T22:30:00+06:00'); // Monday 10:30 PM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('CLOSING_SOON');
  });

  it('returns CLOSED when past close time', () => {
    const date = new Date('2026-10-05T23:30:00+06:00'); // Monday 11:30 PM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('CLOSED');
  });

  it('returns OPEN for 24/7 gym', () => {
    const date = new Date('2026-10-06T03:00:00+06:00'); // Tuesday 3 AM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('OPEN');
  });

  it('handles overnight gyms correctly (before midnight)', () => {
    const date = new Date('2026-10-07T22:00:00+06:00'); // Wednesday 10 PM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('OPEN');
  });

  it('handles overnight gyms correctly (after midnight but still open)', () => {
    const date = new Date('2026-10-07T00:30:00+06:00'); // Wednesday 12:30 AM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('OPEN');
  });

  it('returns CLOSED for closed days', () => {
    const date = new Date('2026-10-11T12:00:00+06:00'); // Sunday 12 PM Dhaka time
    vi.useFakeTimers();
    vi.setSystemTime(date);
    const result = getOpenStatus(openingHours);
    expect(result.status).toBe('CLOSED');
  });
});
