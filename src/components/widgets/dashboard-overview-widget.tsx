"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskItem } from '@/components/task-item';
import { TaskForm } from '@/components/task-form';
import { Task, ViewMode, TaskStats } from '@/types/task';
import { 
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Plus,
  TrendingUp
} from 'lucide-react';

interface DashboardOverviewWidgetProps {
  stats: TaskStats;
  tasksDueToday: Task[];
  viewMode: ViewMode;
  className?: string;
}

export function DashboardOverviewWidget({ 
  stats, 
  tasksDueToday,
  className 
}: DashboardOverviewWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Task statistics and today&apos;s focus</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 h-full">
        {/* Stats Section */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pending} pending
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% rate
              </p>
            </div>
            
            <div className="bg-task-overdue-bg rounded-lg p-3 border border-task-overdue-accent/30 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-task-overdue-text">Overdue</span>
                <AlertTriangle className="h-4 w-4 text-task-overdue-icon" />
              </div>
              <div className="text-2xl font-bold text-task-overdue-text">{stats.overdue}</div>
              <p className="text-xs text-task-overdue-text/80">
                Need attention
              </p>
            </div>
            
            <div className="bg-task-today-bg rounded-lg p-3 border border-task-today-accent/30 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-task-today-text">Due Today</span>
                <Clock className="h-4 w-4 text-task-today-icon" />
              </div>
              <div className="text-2xl font-bold text-task-today-text">{stats.dueToday || 0}</div>
              <p className="text-xs text-task-today-text/80">
                Tasks due today
              </p>
            </div>
          </div>
        </div>

        {/* Today's Focus Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Today&apos;s Focus</h3>
            {tasksDueToday.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                {tasksDueToday.length} due
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {tasksDueToday.length > 0 ? (
              tasksDueToday.slice(0, 3).map((task) => (
                <div key={task.id} className="p-1">
                  <TaskItem 
                    task={task} 
                    viewMode="compact"
                    showCategory={true}
                    showDueDate={false}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="text-sm font-semibold mb-1">No tasks due today!</h4>
                <p className="text-xs text-muted-foreground">
                  You&apos;re all caught up. Great job!
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
