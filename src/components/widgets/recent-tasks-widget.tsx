"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedTaskForm } from '@/components/enhanced-task-form';
import { Task, ViewMode } from '@/types/task';
import { Target, Plus, Circle } from 'lucide-react';

interface RecentTasksWidgetProps {
  tasks: Task[];
  viewMode: ViewMode;
  className?: string;
}

export function RecentTasksWidget({ 
  tasks, 
  className 
}: RecentTasksWidgetProps) {
  // Sort tasks by creation date (most recent first) and filter for simple tasks
  const simpleTasks = tasks
    .filter(task => !task.description && !task.tags?.length && !task.mentions?.length)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const priorityColors = {
    low: 'text-blue-500',
    medium: 'text-yellow-500', 
    high: 'text-red-500',
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>Simple Tasks</CardTitle>
        <p className="text-sm text-muted-foreground">Tasks with just titles, sorted by recently added</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
        {simpleTasks.length > 0 ? (
          <div className="space-y-2">
            <div className="space-y-1">
              {simpleTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-2 px-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                  <Circle className={`h-3 w-3 fill-current ${priorityColors[task.priority]} flex-shrink-0`} />
                  <span className={`text-sm flex-1 truncate ${
                    task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No simple tasks yet</h3>
            <p className="text-xs text-muted-foreground">
              Create tasks with just titles to see them here
            </p>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
