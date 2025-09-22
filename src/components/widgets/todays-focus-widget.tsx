"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskItem } from '@/components/task-item';
import { Task, ViewMode } from '@/types/task';
import { Calendar } from 'lucide-react';

interface TodaysFocusWidgetProps {
  tasks: Task[];
  viewMode: ViewMode;
  className?: string;
}

export function TodaysFocusWidget({ 
  tasks, 
  className 
}: TodaysFocusWidgetProps) {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>Today&apos;s Focus</CardTitle>
        <p className="text-sm text-muted-foreground">Your priority tasks for today</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
        {tasks.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} due today
              </span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-1">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-2 bg-muted/20 rounded-lg border border-border/50">
                  <TaskItem 
                    task={task} 
                    viewMode="compact"
                    showCategory={true}
                    showDueDate={false}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">All caught up!</h3>
            <p className="text-xs text-muted-foreground">
              No tasks due today. Great job staying on top of things.
            </p>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
