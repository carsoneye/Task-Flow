"use client";

import { Task, TaskView } from "@/types/task";
import { TaskItem } from "./task-item";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { TaskListSkeleton } from "./skeletons/task-list-skeleton";
import { useClientOnly } from "@/hooks/use-client-only";

interface TaskGridProps {
  tasks: Task[];
  view: TaskView;
  title?: string;
  emptyMessage?: string;
  showStats?: boolean;
  isLoading?: boolean;
}

export function TaskGrid({
  tasks,
  view,
  title,
  emptyMessage = "No tasks found.",
  showStats = false,
  isLoading = false
}: TaskGridProps) {
  const isClient = useClientOnly();
  
  // Show loading skeleton while data is loading
  if (isLoading) {
    return <TaskListSkeleton viewMode="grid" count={6} showHeader={!!title} />;
  }
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;
  const overdueCount = isClient ? tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  ).length : 0;

  if (tasks.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-muted/30">
            <CheckCircle2 className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {showStats && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">{tasks.length} total</span>
              {pendingCount > 0 && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">{pendingCount} pending</span>
              )}
              {completedCount > 0 && (
                <span className="text-green-600 dark:text-green-400 font-medium">{completedCount} done</span>
              )}
              {overdueCount > 0 && (
                <span className="text-red-600 dark:text-red-400 font-medium">{overdueCount} overdue</span>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
             showCategory={view === 'tasks'}
            showDueDate={true}
            viewMode="grid"
          />
        ))}
      </div>
    </div>
  );
}
