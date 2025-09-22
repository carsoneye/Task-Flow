"use client";

import React from 'react';
import { useTasks } from '@/context/task-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

export function CalendarView() {
  const { state } = useTasks();
  const { tasks } = state;

  // Group tasks by due date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    
    const dateKey = format(task.dueDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const sortedDates = Object.keys(tasksByDate).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Calendar view of your tasks (Coming Soon)
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Calendar View Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We&apos;re working on a beautiful calendar interface to help you visualize your tasks by due date.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            <Clock className="h-4 w-4" />
            Coming in the next update
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
