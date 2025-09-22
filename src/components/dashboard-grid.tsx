"use client";

import React from 'react';
import { TodaysFocusWidget } from './widgets/todays-focus-widget';
import { QuickActionsWidget } from './widgets/quick-actions-widget';
import { RecentTasksWidget } from './widgets/recent-tasks-widget';
import { StatsWidget } from './widgets/stats-widget';
import { useTasks } from '@/context/task-context';
import { TaskStats } from '@/types/task';



interface DashboardGridProps {
  className?: string;
}

export function DashboardGrid({ className }: DashboardGridProps) {
  const { state, getFilteredTasks, setView } = useTasks();
  const { tasks, viewMode } = state;

  // Use consistent data source - getFilteredTasks() for all widgets
  const allTasks = getFilteredTasks();
  const today = new Date();

  // Calculate all task categories from the same source
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const tasksDueToday = allTasks.filter(task => {
    if (task.completed) return false;
    const taskDate = task.dueDate;
    if (!taskDate) return false;
    const taskDueDate = new Date(taskDate);
    return taskDueDate.toDateString() === today.toDateString() && taskDueDate >= todayStart;
  });

  const overdueTasks = allTasks.filter(task => {
    if (task.completed) return false;
    const taskDate = task.dueDate;
    if (!taskDate) return false;
    const taskDueDate = new Date(taskDate);
    return taskDueDate < todayStart;
  });

  const recentTasks = allTasks
    .filter(task => {
      // Exclude tasks due today to avoid duplicates with Today's Focus
      if (task.dueDate) {
        const taskDate = task.dueDate;
        const taskDueDate = new Date(taskDate);
        return taskDueDate.toDateString() !== today.toDateString() || taskDueDate < todayStart;
      }
      return true;
    })
    .slice(0, 5);

  // Get last worked task for "Resume last task" feature
  const lastWorkedTask = allTasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt;
      const bTime = b.updatedAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    })[0];

  // Get tomorrow's date for "Plan tomorrow" feature
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Calculate stats from the same data source
  const stats: TaskStats = {
    total: allTasks.length,
    pending: allTasks.filter(t => !t.completed).length,
    completed: allTasks.filter(t => t.completed).length,
    overdue: overdueTasks.length,
    completedToday: allTasks.filter(t => t.completed && t.completedAt && 
      new Date(t.completedAt).toDateString() === today.toDateString()).length,
    dueToday: tasksDueToday.length,
    focusSessionsCompleted: 0 // Not implemented yet
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your tasks.
        </p>
      </div>

      {/* Purposeful Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Today's Focus - Most Important (8 columns) */}
        <div className="lg:col-span-8 flex">
          <TodaysFocusWidget
            tasks={tasksDueToday}
            viewMode={viewMode}
            className="w-full"
          />
        </div>

        {/* Quick Actions - Secondary (4 columns) */}
        <div className="lg:col-span-4 flex">
          <QuickActionsWidget 
            lastWorkedTask={lastWorkedTask}
            tomorrow={tomorrow}
            className="w-full"
          />
        </div>

        {/* Simple Tasks - Important (6 columns) */}
        <div className="lg:col-span-6 flex">
          <RecentTasksWidget
            tasks={allTasks}
            viewMode={viewMode}
            className="w-full"
          />
        </div>

        {/* Progress Overview - Secondary (6 columns) */}
        <div className="lg:col-span-6 flex">
          <StatsWidget
            stats={stats}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
