import { Task } from "@/types/task";

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  PREFERENCES: 'taskflow_preferences',
  SCHEMA_VERSION: 'taskflow_schema_version',
  LAST_BACKUP: 'taskflow_last_backup'
} as const;

// Current schema version
const CURRENT_SCHEMA_VERSION = '1.0.0';

// Debounce delay for auto-save
const AUTO_SAVE_DELAY = 1000;

// Types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  viewMode: 'list' | 'grid' | 'compact';
  notifications: boolean;
  autoSave: boolean;
  lastActiveView: 'overview' | 'tasks' | 'projects' | 'calendar' | 'settings';
  lastActiveSubView?: 'all' | 'completed';
  dashboardLayouts?: Record<string, unknown>; // React Grid Layout layouts
}

export interface StorageData {
  tasks: Task[];
  preferences: UserPreferences;
  schemaVersion: string;
  lastModified: number;
}

export interface MigrationResult {
  success: boolean;
  migrated: boolean;
  error?: string;
}

// Debounce utility
function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

// Storage utility class
class StorageManager {
  private autoSaveEnabled = true;
  private debouncedSave: (() => void) | null = null;

  constructor() {
    this.debouncedSave = debounce(() => {
      this.saveToStorage();
    }, AUTO_SAVE_DELAY);
  }

  // Enable/disable auto-save
  setAutoSave(enabled: boolean) {
    this.autoSaveEnabled = enabled;
  }

  // Get data from localStorage with error handling
  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Additional validation for corrupted data
      if (typeof item !== 'string' || item.trim() === '') {
        console.warn(`Invalid data format for key ${key}, clearing...`);
        localStorage.removeItem(key);
        return defaultValue;
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      console.warn(`Clearing corrupted data for key: ${key}`);
      
      // If this is a JSON parsing error, be more aggressive
      if (error instanceof SyntaxError) {
        console.warn(`JSON parsing error detected, performing aggressive cleanup...`);
        this.clearAllCorruptedData();
      }
      
      // Clear corrupted data
      try {
        localStorage.removeItem(key);
      } catch (clearError) {
        console.error(`Error clearing corrupted data for key ${key}:`, clearError);
      }
      return defaultValue;
    }
  }

  // Save data to localStorage with error handling
  private saveToStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      
      // Get current data
      const tasks = this.getFromStorage(STORAGE_KEYS.TASKS, []);
      const preferences = this.getFromStorage(STORAGE_KEYS.PREFERENCES, this.getDefaultPreferences());
      
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
      
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      this.handleStorageError(error);
    }
  }

  // Auto-save with debouncing
  autoSave(): void {
    if (this.autoSaveEnabled && this.debouncedSave) {
      this.debouncedSave();
    }
  }

  // Force immediate save
  forceSave(): void {
    this.saveToStorage();
  }

  // Get default preferences
  getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      viewMode: 'list',
      notifications: true,
      autoSave: true,
      lastActiveView: 'overview',
      lastActiveSubView: undefined,
      dashboardLayouts: undefined
    };
  }

  // Load tasks from storage
  loadTasks(): Task[] {
    const rawTasks = this.getFromStorage(STORAGE_KEYS.TASKS, []);
    
    // Convert date strings back to Date objects
    return rawTasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      recurringPattern: task.recurringPattern ? {
        ...task.recurringPattern,
        endDate: task.recurringPattern.endDate ? new Date(task.recurringPattern.endDate) : undefined,
      } : undefined,
    }));
  }

  // Save tasks to storage
  saveTasks(tasks: Task[]): void {
    try {
      if (typeof window === 'undefined') return;
      
      const validatedTasks = this.validateTasks(tasks);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(validatedTasks));
      this.autoSave();
    } catch (error) {
      console.error('Error saving tasks:', error);
      this.handleStorageError(error);
    }
  }

  // Load preferences from storage
  loadPreferences(): UserPreferences {
    return this.getFromStorage(STORAGE_KEYS.PREFERENCES, this.getDefaultPreferences());
  }

  // Save preferences to storage
  savePreferences(preferences: UserPreferences): void {
    try {
      if (typeof window === 'undefined') return;
      
      const validatedPreferences = this.validatePreferences(preferences);
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(validatedPreferences));
      this.autoSave();
    } catch (error) {
      console.error('Error saving preferences:', error);
      this.handleStorageError(error);
    }
  }

  // Validate tasks data
  private validateTasks(tasks: Task[]): Task[] {
    if (!Array.isArray(tasks)) {
      console.warn('Tasks data is not an array, returning empty array');
      return [];
    }

    return tasks.filter(task => {
      // Basic validation
      if (!task.id || typeof task.title !== 'string' || !task.title.trim()) {
        console.warn('Invalid task found:', task);
        return false;
      }

      // Ensure required fields exist
      return {
        id: task.id,
        title: task.title.trim(),
        description: task.description || '',
        completed: Boolean(task.completed),
        priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
        category: ['work', 'personal', 'health', 'other'].includes(task.category) ? task.category : 'other',
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        estimatedMinutes: typeof task.estimatedMinutes === 'number' ? task.estimatedMinutes : undefined,
        tags: Array.isArray(task.tags) ? task.tags : [],
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        status: ['pending', 'in-progress', 'completed', 'cancelled'].includes(task.status) ? task.status : 'pending'
      };
    });
  }

  // Validate preferences data
  private validatePreferences(preferences: UserPreferences): UserPreferences {
    const defaults = this.getDefaultPreferences();
    
    return {
      theme: ['light', 'dark', 'system'].includes(preferences.theme) ? preferences.theme : defaults.theme,
      viewMode: ['list', 'grid', 'compact'].includes(preferences.viewMode) ? preferences.viewMode : defaults.viewMode,
      notifications: typeof preferences.notifications === 'boolean' ? preferences.notifications : defaults.notifications,
      autoSave: typeof preferences.autoSave === 'boolean' ? preferences.autoSave : defaults.autoSave,
      lastActiveView: ['overview', 'tasks', 'projects', 'calendar', 'settings'].includes(preferences.lastActiveView) ? preferences.lastActiveView : defaults.lastActiveView,
      lastActiveSubView: preferences.lastActiveSubView && ['all', 'completed'].includes(preferences.lastActiveSubView) ? preferences.lastActiveSubView : undefined
    };
  }

  // Handle storage errors
  private handleStorageError(error: unknown): void {
    console.error('Storage error:', error);
    
    // You could implement user notification here
    // For now, we'll just log the error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Consider clearing old data.');
    }
  }

  // Check if migration is needed
  needsMigration(): boolean {
    const storedVersion = this.getFromStorage(STORAGE_KEYS.SCHEMA_VERSION, '0.0.0') as string;
    return storedVersion !== CURRENT_SCHEMA_VERSION;
  }

  // Run data migration
  migrateData(): MigrationResult {
    try {
      const storedVersion = this.getFromStorage(STORAGE_KEYS.SCHEMA_VERSION, '0.0.0') as string;
      
      if (storedVersion === CURRENT_SCHEMA_VERSION) {
        return { success: true, migrated: false };
      }

      console.log(`Migrating data from version ${storedVersion} to ${CURRENT_SCHEMA_VERSION}`);

      // Load and validate existing data
      const tasks = this.loadTasks();
      const preferences = this.loadPreferences();

      // Save with new schema version
      this.saveTasks(tasks);
      this.savePreferences(preferences);
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);

      return { success: true, migrated: true };
    } catch (error) {
      console.error('Migration failed:', error);
      return { 
        success: false, 
        migrated: false, 
        error: error instanceof Error ? error.message : 'Unknown migration error'
      };
    }
  }

  // Export data
  exportData(): string {
    try {
      const data: StorageData = {
        tasks: this.loadTasks(),
        preferences: this.loadPreferences(),
        schemaVersion: CURRENT_SCHEMA_VERSION,
        lastModified: Date.now()
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export data');
    }
  }

  // Import data
  importData(jsonData: string): { success: boolean; error?: string } {
    try {
      const data: StorageData = JSON.parse(jsonData);

      // Validate imported data
      if (!data.tasks || !data.preferences) {
        throw new Error('Invalid data format');
      }

      // Validate and save tasks
      const validatedTasks = this.validateTasks(data.tasks);
      this.saveTasks(validatedTasks);

      // Validate and save preferences
      const validatedPreferences = this.validatePreferences(data.preferences);
      this.savePreferences(validatedPreferences);

      // Update schema version
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);

      console.log('Data imported successfully');
      return { success: true };
    } catch (error) {
      console.error('Import failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid data format'
      };
    }
  }

  // Clear all data
  clearAllData(): void {
    try {
      if (typeof window === 'undefined') return;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('All data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Reset storage to clean state (useful for corrupted data recovery)
  resetStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      
      // Clear all our keys
      this.clearAllData();
      
      // Also clear any legacy keys that might exist
      const legacyKeys = ['focus-tasks', 'taskflow_tasks_old', 'taskflow_preferences_old'];
      legacyKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Could not clear legacy key ${key}:`, error);
        }
      });
      
      console.log('Storage reset completed');
    } catch (error) {
      console.error('Error resetting storage:', error);
    }
  }

  // Aggressively clear all potentially corrupted localStorage data
  clearAllCorruptedData(): void {
    try {
      if (typeof window === 'undefined') return;
      
      console.warn('Performing aggressive localStorage cleanup...');
      
      // Get all localStorage keys
      const keys = Object.keys(localStorage);
      
      // Clear all keys that start with our app prefixes or common problematic patterns
      const problematicKeys = keys.filter(key => 
        key.startsWith('taskflow_') || 
        key.startsWith('focus-') ||
        key.includes('task') ||
        key.includes('preference') ||
        key.includes('schema')
      );
      
      problematicKeys.forEach(key => {
        try {
          // Try to parse the value to see if it's corrupted
          const value = localStorage.getItem(key);
          if (value) {
            try {
              JSON.parse(value);
              // If parsing succeeds, keep the key
            } catch (parseError) {
              // If parsing fails, remove the corrupted key
              console.warn(`Removing corrupted key: ${key}`);
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.warn(`Error checking key ${key}:`, error);
          try {
            localStorage.removeItem(key);
          } catch (removeError) {
            console.error(`Could not remove key ${key}:`, removeError);
          }
        }
      });
      
      console.log('Aggressive localStorage cleanup completed');
    } catch (error) {
      console.error('Error during aggressive localStorage cleanup:', error);
    }
  }

  // Get storage info
  getStorageInfo(): { used: number; available: number; total: number } {
    try {
      if (typeof window === 'undefined') {
        return { used: 0, available: 0, total: 0 };
      }

      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });

      // Estimate available space (5MB is typical for localStorage)
      const total = 5 * 1024 * 1024; // 5MB in bytes
      const available = total - used;

      return { used, available, total };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, total: 0 };
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();

// Export utility functions
export const storageUtils = {
  exportData: () => storageManager.exportData(),
  importData: (data: string) => storageManager.importData(data),
  clearAllData: () => storageManager.clearAllData(),
  getStorageInfo: () => storageManager.getStorageInfo(),
  needsMigration: () => storageManager.needsMigration(),
  migrateData: () => storageManager.migrateData()
};
