# Global State Management System

This project uses a comprehensive React Context-based global state management system for the task application, providing a clean and maintainable architecture.

## 🏗️ Architecture Overview

The state management system provides:

- **Task State Management**: Complete CRUD operations for tasks
- **Filter State**: Advanced filtering with search, categories, priorities, and date ranges
- **User Preferences**: Theme, view modes, and application settings
- **Computed Values**: Real-time calculations for filtered tasks, counts, and statistics
- **Local Storage Persistence**: Automatic data persistence with debouncing and migration
- **Loading States**: Comprehensive skeleton and loading components

## 📁 File Structure

```
src/
├── types/
│   └── task.ts                    # Type definitions
├── context/
│   └── task-context.tsx           # React Context implementation
├── lib/
│   └── storage.ts                 # Local storage management
├── data/
│   └── sample-tasks.ts            # Sample data
└── components/
    ├── skeletons/                 # Loading skeleton components
    │   ├── task-item-skeleton.tsx
    │   ├── task-list-skeleton.tsx
    │   ├── dashboard-skeleton.tsx
    │   ├── navigation-skeleton.tsx
    │   ├── page-skeleton.tsx
    │   └── modal-skeleton.tsx
    └── ui/
        ├── skeleton.tsx           # Base skeleton component
        └── loading.tsx            # Loading component
```

## 🎯 Core Features

### Task State
- **Complete Task Model**: id, title, description, status, priority, dueDate, category, tags, createdAt, completedAt, creationMode
- **Status Tracking**: pending, in-progress, completed, cancelled
- **Priority Levels**: low, medium, high (with color indicators)
- **Categories**: work, personal, health, other
- **Tags**: Flexible tagging system
- **Time Tracking**: Estimated and actual minutes
- **Creation Mode**: Tracks whether task was created in quick or detailed mode

### Filter State
- **Search Query**: Full-text search across title, description, and tags
- **Category Filtering**: Filter by task categories
- **Priority Filtering**: Filter by priority levels
- **Status Filtering**: Filter by task status
- **Date Filtering**: Due today, due this week, overdue, custom date ranges
- **Tag Filtering**: Filter by specific tags

### Sorting State
- **Sort Options**: 8 different sorting methods
  - **Newest First**: Most recently created tasks
  - **Oldest First**: Oldest tasks first
  - **Due Soon**: Tasks due soonest first
  - **Due Later**: Tasks due furthest in the future
  - **High Priority**: High priority tasks first
  - **Low Priority**: Low priority tasks first
  - **Title A-Z**: Alphabetical by title
  - **Title Z-A**: Reverse alphabetical by title

### User Preferences
- **Theme**: light, dark, system (via next-themes)
- **View Mode**: list, grid, compact
- **Navigation State**: Current view and sub-view persistence
- **Auto-save**: Automatic state persistence with debouncing

### Computed Values
- **Filtered Tasks**: Real-time filtered task lists with sorting
- **Task Counts**: Total, pending, in-progress, completed, cancelled, overdue
- **Statistics**: Category counts, priority counts, tag counts
- **Sorted Tasks**: Tasks sorted by selected criteria (newest, oldest, due date, priority, title)

### Loading States
- **Skeleton Components**: Realistic loading placeholders
- **Loading Indicators**: Spinner and progress indicators
- **Form Loading**: Disabled states during submission

## 🚀 Usage

### Basic Usage

```tsx
import { useTasks } from '@/context/task-context';

function MyComponent() {
  const { state, addTask, updateTask, deleteTask } = useTasks();
  const { tasks, isLoading, viewMode } = state;
  
  const handleAddTask = () => {
    addTask({
      title: 'New Task',
      description: 'Task description',
      priority: 'medium',
      category: 'work',
      status: 'pending'
    });
  };
  
  if (isLoading) {
    return <TaskListSkeleton />;
  }
  
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

### Provider Setup

```tsx
import { TaskProvider } from '@/context/task-context';

function App() {
  return (
    <TaskProvider>
      <MyApp />
    </TaskProvider>
  );
}
```

## 🎣 Available Hooks

### Main Hook
```tsx
import { useTasks } from '@/context/task-context';

const { 
  state,           // Complete state object
  addTask,         // Add new task
  updateTask,      // Update existing task
  deleteTask,      // Delete task
  toggleComplete,  // Toggle task completion
  setView,         // Navigate between views
  setViewMode,     // Change view mode (list/grid/compact)
  updateSettings   // Update user preferences
} = useTasks();
```

### State Properties
```tsx
const { state } = useTasks();
const {
  tasks,              // Array of all tasks
  currentView,        // Current main view (overview/tasks/projects/calendar/settings)
  currentSubView,     // Current sub-view (all/active/completed)
  viewMode,           // View mode (list/grid/compact)
  filter,             // Current filter state
  stats,              // Computed statistics
  isLoading,          // Loading state
  settings            // User preferences
} = state;
```

## 🔧 Advanced Features

### Task Operations
```tsx
const { addTask, updateTask, deleteTask } = useTasks();

// Add task with all properties
addTask({
  title: 'Complete project',
  description: 'Finish the project documentation',
  priority: 'high',
  category: 'work',
  status: 'pending',
  dueDate: new Date('2024-12-31'),
  estimatedMinutes: 120,
  tags: ['urgent', 'documentation']
});

// Update task
updateTask('task-id', {
  status: 'in-progress',
  actualMinutes: 60
});

// Delete task
deleteTask('task-id');
```

### Navigation
```tsx
const { setView } = useTasks();

// Navigate to different views
setView('tasks', 'all');        // All tasks
setView('tasks', 'active');     // Active tasks only
setView('tasks', 'completed');  // Completed tasks only
setView('overview');            // Dashboard overview
setView('settings');            // Settings page
```

### Filtering
```tsx
const { state } = useTasks();
const { filter } = state;

// Filter tasks by category
// This is handled internally by the context
// Components can access filtered results via getTasksForView()
```

### View Modes
```tsx
const { setViewMode } = useTasks();

setViewMode('list');    // List view
setViewMode('grid');    // Grid view
setViewMode('compact'); // Compact view
```

### Sorting
```tsx
const { setSort } = useTasks();

// Sort tasks by different criteria
setSort('newest');      // Newest first
setSort('oldest');      // Oldest first
setSort('due-soon');    // Due soonest first
setSort('due-later');   // Due furthest first
setSort('priority-high'); // High priority first
setSort('priority-low');  // Low priority first
setSort('title-a-z');   // Alphabetical A-Z
setSort('title-z-a');   // Alphabetical Z-A
```

## 📊 Local Storage Persistence

The system automatically persists data to local storage:

### Storage Manager Features
- **Auto-save**: Debounced saves to prevent excessive writes
- **Data Migration**: Handles schema updates automatically
- **Export/Import**: Backup and restore functionality
- **Error Handling**: Graceful handling of storage errors
- **Data Validation**: Ensures data integrity

### Storage Keys
- `focus-tasks`: Task data
- `focus-tasks-settings`: User preferences
- `focus-tasks-schema-version`: Schema version for migration

### Manual Operations
```tsx
import { storageManager } from '@/lib/storage';

// Export data
const data = storageManager.exportData();

// Import data
storageManager.importData(exportedData);

// Clear all data
storageManager.clearAllData();

// Force save
storageManager.forceSave();
```

## 🎨 Loading States

### Skeleton Components
```tsx
import { TaskListSkeleton, DashboardSkeleton } from '@/components/skeletons';

// Show loading skeleton
if (isLoading) {
  return <TaskListSkeleton viewMode="list" count={5} />;
}
```

### Loading Component
```tsx
import { Loading, TaskLoading, PageLoading } from '@/components/ui/loading';

// Basic loading
<Loading text="Loading tasks..." />

// Full screen loading
<PageLoading />

// Task specific loading
<TaskLoading />
```

## 🧪 Testing

The system is designed for easy testing:

```tsx
import { renderHook } from '@testing-library/react';
import { useTasks } from '@/context/task-context';

test('should add task', () => {
  const { result } = renderHook(() => useTasks());
  
  act(() => {
    result.current.addTask({
      title: 'Test Task',
      priority: 'medium',
      category: 'work'
    });
  });
  
  expect(result.current.state.tasks).toHaveLength(1);
});
```

## 🚀 Performance Considerations

### React Context Benefits
- **React Native Compatible**: Works seamlessly with React Native
- **Familiar API**: Uses standard React patterns
- **No External Dependencies**: Pure React solution
- **TypeScript**: Excellent type safety
- **DevTools**: Full React DevTools support

### Optimization Features
- **Debounced Saves**: Prevents excessive localStorage writes
- **Computed Values**: Efficient memoization of derived state
- **Loading States**: Smooth user experience during data operations
- **Skeleton Screens**: Immediate visual feedback

## 🔮 Future Enhancements

- **Real-time Sync**: WebSocket integration for multi-user scenarios
- **Offline Support**: Service worker integration for offline functionality
- **Advanced Analytics**: Task completion patterns and productivity metrics
- **Task Templates**: Reusable task templates
- **Collaboration**: Multi-user task management
- **Advanced Filtering**: More sophisticated filter combinations

## 📚 API Reference

### Task Interface
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'health' | 'other';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedMinutes?: number;
  tags?: string[];
}
```

### Filter Interface
```typescript
interface TaskFilter {
  category?: string;
  priority?: string;
  completed?: boolean;
  searchQuery?: string;
}
```

### View Types
```typescript
type TaskView = 'overview' | 'tasks' | 'projects' | 'calendar' | 'settings';
type TaskSubView = 'all' | 'active' | 'completed';
type ViewMode = 'list' | 'grid' | 'compact';
```

### Statistics Interface
```typescript
interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}
```

This comprehensive state management system provides a robust foundation for building scalable task management applications with excellent developer experience, performance, and user experience.