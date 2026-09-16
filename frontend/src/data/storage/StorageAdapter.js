/**
 * @file StorageAdapter.js
 * Centralized localStorage adapter with versioning and simple pub/sub
 * for cross-component reactivity without heavy state managers.
 */

const STORAGE_KEY = 'silver-gym-data';
const VERSION = 2;

class StorageAdapter {
  constructor() {
    this.listeners = new Set();
    this.initialize();
  }

  initialize() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version !== VERSION) {
          console.warn(`[StorageAdapter] Version mismatch. Expected ${VERSION}, got ${parsed.version}. Resetting.`);
          this.reset();
        }
      } else {
        this.reset();
      }
    } catch (e) {
      console.error('[StorageAdapter] Failed to parse storage, resetting.', e);
      this.reset();
    }
  }

  reset() {
    // Initial tables for our mock database
    const defaultData = {
      version: VERSION,
      members: {},
      memberships: {},
      checkIns: [],
      savedGyms: [],
      // For Demo purposes, we pre-seed the primary demo user ID
      demoUserId: 'SG-2048-DA' 
    };
    this._save(defaultData);
  }

  _save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this.notify();
  }

  get(table) {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return table ? data[table] : data;
    } catch(e) {
      return null;
    }
  }

  set(table, value) {
    const data = this.get() || { version: VERSION };
    data[table] = value;
    this._save(data);
  }

  /**
   * Subscribe to global storage changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const storage = new StorageAdapter();
