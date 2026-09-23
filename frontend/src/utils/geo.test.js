import { describe, it, expect } from 'vitest';
import { formatDistance, estimateTravelTime } from './geo';

describe('formatDistance', () => {
  it('formats meters correctly', () => {
    expect(formatDistance(0.74)).toBe('740 m');
    expect(formatDistance(0.05)).toBe('50 m');
  });

  it('formats km correctly', () => {
    expect(formatDistance(1.23)).toBe('1.2 km');
    expect(formatDistance(10.55)).toBe('10.6 km');
  });

  it('handles null', () => {
    expect(formatDistance(null)).toBe('');
  });
});

describe('estimateTravelTime', () => {
  it('estimates walk time', () => {
    // 1 km at 5km/h = 12 mins
    expect(estimateTravelTime(1, 'walk')).toBe(12);
  });

  it('estimates drive time', () => {
    // 10 km at 20km/h = 30 mins
    expect(estimateTravelTime(10, 'drive')).toBe(30);
  });
});
