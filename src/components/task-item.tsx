"use client";

import { Task } from "@/types/task";
import { useTasks } from "@/context/task-context";
import { useClientOnly } from "@/hooks/use-client-only";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskDetailsModal } from "./task-details-modal";
import { EnhancedTaskForm } from "./enhanced-task-form";
import { getTaskStatusColors } from "@/lib/colors";
import { 
  Edit, 
  Trash2,
  Circle
} from "lucide-react";

// Custom delete button with hold functionality and countdown tooltip
function HoldToDeleteButton({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    setIsHolding(true);
    setCountdown(3);
    holdStartRef.current = Date.now();
    
    holdIntervalRef.current = setInterval(() => {
      if (holdStartRef.current) {
        const elapsed = Date.now() - holdStartRef.current;
        const remaining = Math.max(0, 3 - Math.floor(elapsed / 1000));
        setCountdown(remaining);
        
        if (remaining <= 0) {
          onDelete();
          setIsHolding(false);
          setCountdown(3);
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
          }
        }
      }
    }, 100);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setCountdown(3);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHolding(false);
    setCountdown(3);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
  };

  return (
    <div className="relative">
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        {children}
        {isHolding && (
          <div className="absolute inset-0 bg-destructive/30 rounded flex items-center justify-center z-10">
            <div className="text-sm font-bold text-destructive bg-white dark:bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
              {countdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  showCategory?: boolean;
  showDueDate?: boolean;
  viewMode?: 'list' | 'grid' | 'compact';
  index?: number;
}

export function TaskItem({ task, showCategory = true, showDueDate = true, viewMode = 'list', index = 0 }: TaskItemProps) {
  const { toggleComplete, deleteTask } = useTasks();
  const isClient = useClientOnly();

  const today = isClient ? new Date() : new Date(0);
  const todayStart = isClient ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : new Date(0);
  const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
  
  const isOverdue = isClient && taskDueDate && !task.completed && taskDueDate < todayStart;
  const isDueToday = isClient && taskDueDate && !task.completed && 
    taskDueDate.toDateString() === today.toDateString() && !isOverdue;


  const priorityDotColors = {
    low: 'text-blue-500', // Blue for low priority
    medium: 'text-yellow-500', // Yellow for medium priority
    high: 'text-red-500', // Red for high priority
  };




  const handleDelete = () => {
    deleteTask(task.id);
  };

  // Determine sizing based on view mode - UNIFIED DESIGN SYSTEM
  const isCompactView = viewMode === 'compact';
  
  // Unified padding and sizing
  const cardPadding = isCompactView ? 'p-3' : 'p-4';


  // Compact view - ultra minimal horizontal line
  if (isCompactView) {
    const isEven = index % 2 === 0;
    return (
      <div className={`flex items-center gap-3 py-2.5 px-4 border-b border-border/30 last:border-b-0 group ${
        task.completed ? 'opacity-70' : ''
      } ${isEven ? 'bg-card' : 'bg-muted/20'}`}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleComplete(task.id)}
          className="h-4 w-4 cursor-pointer flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <h3 className={`text-sm font-medium truncate ${
            task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}>
            {task.title}
          </h3>
          
          <Circle className={`h-2.5 w-2.5 fill-current ${priorityDotColors[task.priority]} flex-shrink-0`} />
          
          {isOverdue && !task.completed && (
            <span className="text-xs text-task-overdue-text flex-shrink-0">Overdue</span>
          )}
          {isDueToday && !task.completed && !isOverdue && (
            <span className="text-xs text-task-due-text flex-shrink-0">Today</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <TaskDetailsModal task={task}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TaskDetailsModal>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HoldToDeleteButton onDelete={handleDelete}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </HoldToDeleteButton>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p>Hold to delete (3s countdown)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }

  // Regular list/grid view - Clean, minimal approach
  return (
    <Card className={`${cardPadding} border-border/50 bg-card group ${
      task.completed ? 'opacity-70' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50/50 dark:border-red-800/30 dark:bg-red-950/50' : ''}`}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleComplete(task.id)}
          className="h-5 w-5 cursor-pointer flex-shrink-0"
        />
      
        <div className="flex-1 min-w-0">
          {/* Title and essential info */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-base font-semibold truncate ${
              task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {task.title}
            </h3>
            
            {/* Priority dot */}
            <Circle className={`h-3 w-3 fill-current ${priorityDotColors[task.priority]} flex-shrink-0`} />
            
            {/* Urgent badges */}
            {isOverdue && !task.completed && (
              <Badge className="text-xs px-1.5 py-0.5 flex-shrink-0 bg-task-overdue-bg text-task-overdue-text border-task-overdue-accent/30">
                Overdue
              </Badge>
            )}
            {isDueToday && !task.completed && !isOverdue && (
              <Badge className="text-xs px-1.5 py-0.5 flex-shrink-0 bg-task-today-bg text-task-today-text border-task-today-accent/30">
                Today
              </Badge>
            )}
          </div>

          {/* Secondary info - only show if space allows */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {showCategory && (
              <span className="truncate">{task.category}</span>
            )}
            
            {showDueDate && task.dueDate && !isDueToday && !isOverdue && (
              <span className="truncate">{task.dueDate.toLocaleDateString()}</span>
            )}
            
            {task.estimatedMinutes && (
              <span className="truncate">{task.estimatedMinutes}m</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <TaskDetailsModal task={task}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TaskDetailsModal>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HoldToDeleteButton onDelete={handleDelete}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </HoldToDeleteButton>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p>Hold to delete (3s countdown)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
