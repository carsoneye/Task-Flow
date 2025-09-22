// Debug utility for localStorage issues
// Can be imported and used in browser console for manual cleanup

export const StorageDebug = {
  // Check for corrupted data in localStorage
  checkForCorruption(): { corruptedKeys: string[]; totalKeys: number } {
    if (typeof window === 'undefined') {
      console.warn('localStorage not available in server environment');
      return { corruptedKeys: [], totalKeys: 0 };
    }

    const keys = Object.keys(localStorage);
    const corruptedKeys: string[] = [];

    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          JSON.parse(value);
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          corruptedKeys.push(key);
          console.warn(`Corrupted key found: ${key}`);
        }
      }
    });

    console.log(`Found ${corruptedKeys.length} corrupted keys out of ${keys.length} total keys`);
    return { corruptedKeys, totalKeys: keys.length };
  },

  // Clear all corrupted data
  clearCorruptedData(): void {
    if (typeof window === 'undefined') {
      console.warn('localStorage not available in server environment');
      return;
    }

    const { corruptedKeys } = this.checkForCorruption();
    
    corruptedKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`Removed corrupted key: ${key}`);
      } catch (error) {
        console.error(`Failed to remove key ${key}:`, error);
      }
    });

    console.log(`Cleared ${corruptedKeys.length} corrupted keys`);
  },

  // Clear all localStorage data
  clearAllData(): void {
    if (typeof window === 'undefined') {
      console.warn('localStorage not available in server environment');
      return;
    }

    try {
      localStorage.clear();
      console.log('All localStorage data cleared');
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  // Show all localStorage keys and their values (for debugging)
  inspectAllData(): void {
    if (typeof window === 'undefined') {
      console.warn('localStorage not available in server environment');
      return;
    }

    const keys = Object.keys(localStorage);
    console.log(`Found ${keys.length} keys in localStorage:`);
    
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      } catch (error) {
        console.error(`Error reading key ${key}:`, error);
      }
    });
  },

  // Reset to clean state (useful for development)
  resetToCleanState(): void {
    console.warn('Resetting localStorage to clean state...');
    this.clearAllData();
    console.log('localStorage reset complete. Refresh the page to reload with sample data.');
  }
};

// Make it available globally for browser console access
if (typeof window !== 'undefined') {
  (window as Window & { StorageDebug: typeof StorageDebug }).StorageDebug = StorageDebug;
  console.log('StorageDebug utility available. Use StorageDebug.help() for available commands.');
}
