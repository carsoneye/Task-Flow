"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Task, TaskFilter, TaskStats, TaskView, TaskSubView, ViewMode, RecurringPattern } from '@/types/task';
import { SortOption } from '@/components/sort-toggle';
import { sampleTasks } from '@/data/sample-tasks';
import { storageManager, UserPreferences } from '@/lib/storage';
import { addDays, addWeeks, addMonths } from 'date-fns';

interface Settings extends UserPreferences {
  showCompletedTasks: boolean;
  compactMode: boolean;
  sidebarCollapsed: boolean;
}

interface TaskState {
  tasks: Task[];
  currentView: TaskView;
  currentSubView?: TaskSubView;
  filter: TaskFilter;
  stats: TaskStats;
  isLoading: boolean;
  sidebarCollapsed: boolean;
  settings: Settings;
  viewMode: ViewMode;
  sortBy: SortOption;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'SET_VIEW'; payload: { view: TaskView; subView?: TaskSubView } }
  | { type: 'SET_FILTER'; payload: TaskFilter }
  | { type: 'CLEAR_FILTER' }
  | { type: 'UPDATE_STATS' }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'LOAD_SETTINGS'; payload: Settings }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SORT'; payload: SortOption };

const defaultSettings: Settings = {
  theme: 'system',
  notifications: true,
  autoSave: true,
  viewMode: 'list',
  lastActiveView: 'overview',
  lastActiveSubView: undefined,
  showCompletedTasks: true,
  compactMode: false,
  sidebarCollapsed: false,
};

const initialState: TaskState = {
  tasks: [],
  currentView: 'overview',
  currentSubView: undefined,
  filter: {},
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completedToday: 0,
    focusSessionsCompleted: 0,
  },
  isLoading: false,
  sidebarCollapsed: false,
  settings: defaultSettings,
  viewMode: 'list' as ViewMode,
  sortBy: 'newest' as SortOption,
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date() }
            : task
        ),
      };
    
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload.view,
        currentSubView: action.payload.subView,
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    
    case 'CLEAR_FILTER':
      return {
        ...state,
        filter: {},
      };
    
    case 'UPDATE_STATS':
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const completedToday = state.tasks.filter(task => 
        task.completed && 
        task.updatedAt >= today
      ).length;
      
      const overdue = state.tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        task.dueDate < now
      ).length;
      
      return {
        ...state,
        stats: {
          total: state.tasks.length,
          completed: state.tasks.filter(task => task.completed).length,
          pending: state.tasks.filter(task => !task.completed).length,
          overdue,
          completedToday,
          focusSessionsCompleted: 0,
        },
      };
    
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload,
      };
    default:
      return state;
  }
}

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setView: (view: TaskView, subView?: TaskSubView) => void;
  setFilter: (filter: TaskFilter) => void;
  clearFilter: () => void;
  toggleSidebar: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setViewMode: (mode: ViewMode) => void;
  setSort: (sort: SortOption) => void;
  getFilteredTasks: () => Task[];
  getTasksForView: (view: TaskView, subView?: TaskSubView) => Task[];
  createRecurringInstances: (parentTask: Task, pattern: RecurringPattern, count?: number) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize storage and load data
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    const initializeStorage = async () => {
      try {
        // First, perform aggressive cleanup of any corrupted data
        storageManager.clearAllCorruptedData();
        
        // Check if migration is needed
        if (storageManager.needsMigration()) {
          const migrationResult = storageManager.migrateData();
          if (!migrationResult.success) {
            console.error('Migration failed:', migrationResult.error);
          }
        }

        // Load tasks from storage
        const savedTasks = storageManager.loadTasks();
        if (savedTasks.length > 0) {
          dispatch({ type: 'LOAD_TASKS', payload: savedTasks });
        } else {
          // Use sample data if no saved tasks
          loadSampleData();
        }

        // Load settings from storage
        const savedSettings = storageManager.loadPreferences();
        const settings: Settings = {
          ...savedSettings,
          showCompletedTasks: true,
          compactMode: false,
          sidebarCollapsed: false,
        };
        dispatch({ type: 'LOAD_SETTINGS', payload: settings });

        // Restore navigation state
        if (savedSettings.lastActiveView) {
          dispatch({ 
            type: 'SET_VIEW', 
            payload: { 
              view: savedSettings.lastActiveView as TaskView, 
              subView: savedSettings.lastActiveSubView as TaskSubView 
            } 
          });
        }

        // Configure auto-save
        storageManager.setAutoSave(savedSettings.autoSave);
        
        // Set loading to false after successful initialization
        dispatch({ type: 'SET_LOADING', payload: false });
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing storage:', error);
        
        // If it's a JSON parsing error, reset storage and try again
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
          console.warn('Detected JSON parsing error, performing complete localStorage reset...');
          try {
            // Clear ALL localStorage as a last resort
            if (typeof window !== 'undefined') {
              localStorage.clear();
              console.warn('Complete localStorage cleared due to persistent JSON errors');
            }
            
            // Load sample data and default settings
            loadSampleData();
            dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings });
            console.log('Setting loading to false after localStorage reset');
            dispatch({ type: 'SET_LOADING', payload: false });
            setIsInitialized(true);
            return; // Success, exit early
          } catch (resetError) {
            console.error('Error during complete localStorage reset:', resetError);
          }
        }
        
        // Fallback to sample data
        loadSampleData();
        dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings });
        console.log('Setting loading to false after fallback to sample data');
        dispatch({ type: 'SET_LOADING', payload: false });
        setIsInitialized(true);
      }
    };

    initializeStorage();
  }, []);

  const loadSampleData = () => {
    console.log('Loading sample data...');
    const tasksWithIds = sampleTasks.map(taskData => ({
      ...taskData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in past week
      updatedAt: new Date(),
    }));
    console.log('Sample tasks loaded:', tasksWithIds.length);
    dispatch({ type: 'LOAD_TASKS', payload: tasksWithIds });
  };

  // Save tasks to localStorage whenever tasks change (using storage manager)
  useEffect(() => {
    if (state.tasks.length > 0) {
      storageManager.saveTasks(state.tasks);
    }
  }, [state.tasks]);

  // Update stats whenever tasks change
  useEffect(() => {
    dispatch({ type: 'UPDATE_STATS' });
  }, [state.tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    storageManager.saveTasks([...state.tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
    const updatedTasks = state.tasks.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    );
    storageManager.saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    const filteredTasks = state.tasks.filter(task => task.id !== id);
    storageManager.saveTasks(filteredTasks);
  };

  const toggleComplete = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    const updatedTasks = state.tasks.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          updatedAt: new Date(),
          completedAt: completed ? new Date() : undefined,
        };
      }
      return task;
    });
    storageManager.saveTasks(updatedTasks);
  };

  const setView = (view: TaskView, subView?: TaskSubView) => {
    dispatch({ type: 'SET_VIEW', payload: { view, subView } });
    
    // Save navigation state to preferences
    const updatedSettings = { 
      ...state.settings, 
      lastActiveView: view,
      lastActiveSubView: subView
    };
    storageManager.savePreferences(updatedSettings);
  };

  const setFilter = (filter: TaskFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const updateSettings = (settings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    const updatedSettings = { ...state.settings, ...settings };
    storageManager.savePreferences(updatedSettings);
  };

  const setViewMode = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    const updatedSettings = { ...state.settings, viewMode: mode };
    storageManager.savePreferences(updatedSettings);
  };

  const setSort = (sort: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  };

  const getFilteredTasks = () => {
    let filtered = [...state.tasks];

    if (state.filter.category) {
      filtered = filtered.filter(task => task.category === state.filter.category && !task.completed);
    }

    if (state.filter.priority) {
      filtered = filtered.filter(task => task.priority === state.filter.priority && !task.completed);
    }

    if (state.filter.completed !== undefined) {
      filtered = filtered.filter(task => task.completed === state.filter.completed);
    }

    if (state.filter.dueToday) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      filtered = filtered.filter(task => 
        task.dueDate && task.dueDate <= today && task.dueDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate())
      );
    }

    if (state.filter.dueThisWeek) {
      const today = new Date();
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      filtered = filtered.filter(task => 
        task.dueDate && task.dueDate <= weekEnd && task.dueDate >= today
      );
    }

    if (state.filter.overdue) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(task => 
        !task.completed && task.dueDate && task.dueDate < today
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'due-soon':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due-later':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return -1;
          if (!b.dueDate) return 1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priority-high':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'priority-low':
          const priorityOrderLow = { high: 3, medium: 2, low: 1 };
          return (priorityOrderLow[a.priority] || 0) - (priorityOrderLow[b.priority] || 0);
        case 'title-a-z':
          return a.title.localeCompare(b.title);
        case 'title-z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTasksForView = (view: TaskView, subView?: TaskSubView) => {
    let tasks: Task[] = [];
    
    switch (view) {
      case 'overview':
        tasks = state.tasks; // Show all tasks on overview
        break;
      
      case 'tasks':
        switch (subView) {
          case 'completed':
            tasks = state.tasks.filter(task => task.completed);
            break;
          case 'all':
          default:
            tasks = state.tasks.filter(task => !task.completed);
            break;
        }
        break;
      
      case 'projects':
      case 'calendar':
      case 'settings':
      default:
        tasks = state.tasks;
        break;
    }

    // Apply sorting
    tasks.sort((a, b) => {
      switch (state.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'due-soon':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due-later':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return -1;
          if (!b.dueDate) return 1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priority-high':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'priority-low':
          const priorityOrderLow = { high: 3, medium: 2, low: 1 };
          return (priorityOrderLow[a.priority] || 0) - (priorityOrderLow[b.priority] || 0);
        case 'title-a-z':
          return a.title.localeCompare(b.title);
        case 'title-z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return tasks;
  };

  // Create recurring task instances
  const createRecurringInstances = (parentTask: Task, pattern: RecurringPattern, count: number = 10) => {
    const instances: Task[] = [];
    const startDate = parentTask.dueDate || new Date();
    
    for (let i = 1; i <= count; i++) {
      let nextDueDate: Date;
      
      switch (pattern.type) {
        case 'daily':
          nextDueDate = addDays(startDate, pattern.interval * i);
          break;
        case 'weekly':
          nextDueDate = addWeeks(startDate, pattern.interval * i);
          break;
        case 'monthly':
          nextDueDate = addMonths(startDate, pattern.interval * i);
          break;
        default:
          nextDueDate = addDays(startDate, pattern.interval * i);
      }
      
      // Check if we've reached the end date
      if (pattern.endDate && nextDueDate > pattern.endDate) {
        break;
      }
      
      const instance: Task = {
        ...parentTask,
        id: `${parentTask.id}_${i}`,
        dueDate: nextDueDate,
        parentTaskId: parentTask.id,
        isRecurring: false, // Individual instances are not recurring
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      instances.push(instance);
    }
    
    return instances;
  };

  const value: TaskContextType = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setView,
    setFilter,
    clearFilter,
    toggleSidebar,
    updateSettings,
    setViewMode,
    setSort,
    getFilteredTasks,
    getTasksForView,
    createRecurringInstances,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
