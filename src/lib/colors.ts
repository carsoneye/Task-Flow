// Standardized color scheme for the application
// Modern design system with improved contrast and readability

export const TASK_COLORS = {
  // Overdue tasks - Red
  overdue: {
    background: 'bg-task-overdue-bg',
    border: 'border-task-overdue-accent/20',
    text: 'text-task-overdue-text',
    textBold: 'text-task-overdue-text font-semibold',
    textMuted: 'text-task-overdue-text/90',
    icon: 'text-task-overdue-icon',
    accent: 'text-task-overdue-accent',
    badge: 'bg-task-overdue-bg text-task-overdue-text border-task-overdue-accent/20 shadow-sm',
    badgeVariant: 'destructive' as const
  },

  // Today tasks - Orange
  today: {
    background: 'bg-task-today-bg',
    border: 'border-task-today-accent/20',
    text: 'text-task-today-text',
    textBold: 'text-task-today-text font-semibold',
    textMuted: 'text-task-today-text/90',
    icon: 'text-task-today-icon',
    accent: 'text-task-today-accent',
    badge: 'bg-task-today-bg text-task-today-text border-task-today-accent/20 shadow-sm',
    badgeVariant: 'secondary' as const
  },

  // In Progress tasks - Yellow
  pending: {
    background: 'bg-task-progress-bg',
    border: 'border-task-progress-accent/20',
    text: 'text-task-progress-text',
    textBold: 'text-task-progress-text font-semibold',
    textMuted: 'text-task-progress-text/90',
    icon: 'text-task-progress-icon',
    accent: 'text-task-progress-accent',
    badge: 'bg-task-progress-bg text-task-progress-text border-task-progress-accent/20 shadow-sm',
    badgeVariant: 'secondary' as const
  },

  // Completed tasks - Blue
  completed: {
    background: 'bg-task-completed-bg',
    border: 'border-task-completed-accent/20',
    text: 'text-task-completed-text',
    textBold: 'text-task-completed-text font-semibold',
    textMuted: 'text-task-completed-text/90',
    icon: 'text-task-completed-icon',
    accent: 'text-task-completed-accent',
    badge: 'bg-task-completed-bg text-task-completed-text border-task-completed-accent/20 shadow-sm',
    badgeVariant: 'secondary' as const
  }
} as const;

// Helper function to get colors based on task status
export function getTaskStatusColors(task: {
  completed: boolean;
  dueDate?: Date;
  status: string;
}) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = task.dueDate ? new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate()) : null;
  
  if (task.completed) {
    return TASK_COLORS.completed;
  }
  
  if (dueDate && dueDate < today) {
    return TASK_COLORS.overdue;
  }
  
  if (dueDate && dueDate.getTime() === today.getTime()) {
    return TASK_COLORS.today;
  }
  
  return TASK_COLORS.pending;
}
