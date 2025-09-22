export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'health' | 'other';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
  mentions?: string[];
  isBreak?: boolean;
  focusSession?: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  parentTaskId?: string; // For recurring task instances
  creationMode?: 'quick' | 'detailed'; // Track how the task was created
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  endDate?: Date;
  count?: number;
}

export interface TaskFilter {
  category?: string;
  priority?: string;
  status?: string;
  completed?: boolean;
  dueToday?: boolean;
  dueThisWeek?: boolean;
  overdue?: boolean;
  tags?: string[];
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completedToday: number;
  dueToday: number;
  focusSessionsCompleted: number;
}

export interface FocusSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  completed: boolean;
  breakTaken: boolean;
}

export interface BreakReminder {
  id: string;
  message: string;
  interval: number; // in minutes
  enabled: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  viewMode: 'list' | 'grid' | 'compact';
  defaultFilters: TaskFilter;
  notifications: boolean;
  showCompletedTasks: boolean;
  compactMode: boolean;
  autoSave: boolean;
  sidebarCollapsed: boolean;
  defaultView: TaskView;
}

export interface ComputedTaskValues {
  filteredTasks: Task[];
  tasksByStatus: Record<string, Task[]>;
  tasksByCategory: Record<string, Task[]>;
  tasksByPriority: Record<string, Task[]>;
  taskCounts: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
    dueToday: number;
    dueThisWeek: number;
  };
  categoryCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  tagCounts: Record<string, number>;
}

export type TaskView = 'overview' | 'tasks' | 'projects' | 'calendar' | 'settings';

export type TaskSubView = 'all' | 'completed';

export type ViewMode = 'list' | 'grid' | 'compact';
