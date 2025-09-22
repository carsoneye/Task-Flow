"use client";

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { TaskStats } from '@/types/task';

interface StatsWidgetProps {
  stats: TaskStats;
  className?: string;
}

export function StatsWidget({ stats, className }: StatsWidgetProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      const width = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      progressBarRef.current.style.width = `${width}%`;
    }
  }, [stats.completed, stats.total]);

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Your task completion and progress metrics</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col justify-center">
        {/* Main Progress Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-task-completed-bg rounded-lg p-4 border border-task-completed-accent/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-task-completed-text">Completed</span>
              <CheckCircle2 className="h-4 w-4 text-task-completed-icon" />
            </div>
            <div className="text-2xl font-bold text-task-completed-text">{stats.completed}</div>
            <div className="w-full bg-task-completed-bg/50 rounded-full h-2 mt-2">
              <div 
                ref={progressBarRef}
                className="bg-task-completed-accent h-2 rounded-full transition-all duration-300"
              ></div>
            </div>
            <p className="text-xs text-task-completed-text/80 mt-1">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
            </p>
          </div>

          <div className="bg-task-progress-bg rounded-lg p-4 border border-task-progress-accent/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-task-progress-text">In Progress</span>
              <Target className="h-4 w-4 text-task-progress-icon" />
            </div>
            <div className="text-2xl font-bold text-task-progress-text">{stats.pending}</div>
            <p className="text-xs text-task-progress-text/80 mt-1">
              Active tasks
            </p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-task-overdue-bg rounded-lg p-3 border border-task-overdue-accent/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-task-overdue-text">Overdue</span>
              <AlertTriangle className="h-3 w-3 text-task-overdue-icon" />
            </div>
            <div className="text-lg font-bold text-task-overdue-text">{stats.overdue}</div>
          </div>

          <div className="bg-task-today-bg rounded-lg p-3 border border-task-today-accent/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-task-today-text">Due Today</span>
              <Clock className="h-3 w-3 text-task-today-icon" />
            </div>
            <div className="text-lg font-bold text-task-today-text">{stats.dueToday || 0}</div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
            <span className="text-lg font-bold">{stats.total}</span>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
