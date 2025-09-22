"use client";

import { Task, TaskView } from "@/types/task";
import { useClientOnly } from "@/hooks/use-client-only";
import { TaskItem } from "./task-item";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { TaskListSkeleton } from "./skeletons/task-list-skeleton";

interface TaskListProps {
  tasks: Task[];
  view: TaskView;
  title?: string;
  emptyMessage?: string;
  showStats?: boolean;
  isLoading?: boolean;
}

export function TaskList({ 
  tasks, 
  view, 
  title, 
  emptyMessage,
  showStats = true,
  isLoading = false
}: TaskListProps) {
  const isClient = useClientOnly();
  // Show loading skeleton while data is loading
  if (isLoading) {
    return <TaskListSkeleton viewMode="list" count={5} showHeader={!!title} />;
  }
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;
  const overdueCount = isClient ? tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    task.dueDate < new Date()
  ).length : 0;

      const getEmptyMessage = () => {
        return emptyMessage || "No tasks found.";
      };

  const getStatsBadges = () => {
    const badges = [];
    
    if (pendingCount > 0) {
      badges.push(
        <span key="pending" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
          <Clock className="h-3 w-3" />
          {pendingCount} pending
        </span>
      );
    }
    
    if (completedCount > 0) {
      badges.push(
        <span key="completed" className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
          <CheckCircle2 className="h-3 w-3" />
          {completedCount} done
        </span>
      );
    }
    
    if (overdueCount > 0) {
      badges.push(
        <span key="overdue" className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
          <AlertTriangle className="h-3 w-3" />
          {overdueCount} overdue
        </span>
      );
    }
    
    return badges;
  };

  return (
    <div className="space-y-6">
      {(title || showStats) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            {title && (
              <h2 className="text-2xl font-semibold">{title}</h2>
            )}
            {showStats && tasks.length > 0 && (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-muted-foreground">{tasks.length} total</span>
                {getStatsBadges()}
              </div>
            )}
          </div>
          
        </div>
      )}

      {tasks.length === 0 ? (
        <Card className="p-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-muted/30">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground">{getEmptyMessage()}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
               showCategory={view === 'tasks'}
              showDueDate={true}
              viewMode="list"
            />
          ))}
        </div>
      )}

           {tasks.length > 0 && view !== 'tasks' && pendingCount > 0 && (
            <div className="text-center text-sm text-muted-foreground pt-4">
              <p>
                {pendingCount} task{pendingCount !== 1 ? 's' : ''} remaining
                {completedCount > 0 && ` • ${completedCount} completed`}
              </p>
            </div>
          )}
    </div>
  );
}
