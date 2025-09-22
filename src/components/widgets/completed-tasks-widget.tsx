"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStats } from '@/types/task';
import { CheckCircle2, Target } from 'lucide-react';

interface CompletedTasksWidgetProps {
  stats: TaskStats;
  className?: string;
}

export function CompletedTasksWidget({ 
  stats, 
  className 
}: CompletedTasksWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Completed Tasks</CardTitle>
        <p className="text-sm text-muted-foreground">{stats.completed} tasks completed</p>
      </CardHeader>
      <CardContent>
        <div className="h-full flex flex-col justify-center">
        {stats.completed > 0 ? (
          <div className="text-center py-8 h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">
              {stats.completed} tasks completed!
            </h3>
            <p className="text-xs text-muted-foreground">
              Great job on staying productive
            </p>
          </div>
        ) : (
          <div className="text-center py-8 h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No completed tasks yet</h3>
            <p className="text-xs text-muted-foreground">
              Complete some tasks to see them here
            </p>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
