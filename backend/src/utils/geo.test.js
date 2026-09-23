import { describe, it, expect } from 'vitest';
import { calculateDistanceKm, isWithinBounds } from './geo';

describe('calculateDistanceKm', () => {
  it('calculates distance accurately', () => {
    // Mirpur 10 (23.8052, 90.3696) to Mirpur 12 (23.8211, 90.3665)
    const dist = calculateDistanceKm(23.8052, 90.3696, 23.8211, 90.3665);
    // Should be around 1.8km
    expect(dist).toBeGreaterThan(1.7);
    expect(dist).toBeLessThan(1.9);
  });
  
  it('returns 0 for same location', () => {
    expect(calculateDistanceKm(23.8052, 90.3696, 23.8052, 90.3696)).toBe(0);
  });
});

describe('isWithinBounds', () => {
  it('returns true if inside box', () => {
    expect(isWithinBounds(
      23.81, 90.36, 
      23.85, 23.80, // north, south
      90.40, 90.35 // east, west
    )).toBe(true);
  });
  
  it('returns false if outside box', () => {
    expect(isWithinBounds(
      23.86, 90.36, 
      23.85, 23.80, 
      90.40, 90.35
    )).toBe(false);
  });
});
