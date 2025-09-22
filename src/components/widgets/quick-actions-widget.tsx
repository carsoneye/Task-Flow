"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedTaskForm } from '@/components/enhanced-task-form';
import { useTasks } from '@/context/task-context';
import { useCommandBar } from '@/context/command-bar-context';
import { Task } from '@/types/task';
import { 
  Plus,
  RotateCcw,
  Calendar,
  Zap,
  Play,
  Command
} from 'lucide-react';

interface QuickActionsWidgetProps {
  lastWorkedTask?: Task;
  tomorrow: Date;
  className?: string;
}

export function QuickActionsWidget({ 
  lastWorkedTask,
  tomorrow,
  className 
}: QuickActionsWidgetProps) {
  const { addTask } = useTasks();
  const { openCommandBar } = useCommandBar();
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  const handleResumeLastTask = () => {
    if (lastWorkedTask) {
      // For now, just show the task in a modal or navigate to it
      console.log('Resume task:', lastWorkedTask.title);
      // TODO: Implement task resumption logic
    }
  };

  const handlePlanTomorrow = async () => {
    const templateTask = {
      title: 'Plan tomorrow&apos;s tasks',
      description: 'Review and plan tasks for tomorrow',
      priority: 'medium' as const,
      category: 'personal' as const,
      status: 'pending' as const,
      dueDate: tomorrow,
      estimatedMinutes: 15,
      tags: ['planning', 'review']
    };
    
    await addTask(templateTask);
  };

  const handleQuickAddTemplate = async () => {
    setIsCreatingTemplate(true);
    const templates = [
      {
        title: 'Quick task',
        description: '',
        priority: 'medium' as const,
        category: 'personal' as const,
        status: 'pending' as const,
        estimatedMinutes: 30,
        tags: ['quick']
      },
      {
        title: 'Meeting preparation',
        description: 'Prepare for upcoming meeting',
        priority: 'high' as const,
        category: 'work' as const,
        status: 'pending' as const,
        estimatedMinutes: 45,
        tags: ['work', 'meeting']
      },
      {
        title: 'Health check',
        description: 'Exercise or health-related activity',
        priority: 'medium' as const,
        category: 'health' as const,
        status: 'pending' as const,
        estimatedMinutes: 60,
        tags: ['health', 'exercise']
      }
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    await addTask(randomTemplate);
    setIsCreatingTemplate(false);
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Fast task creation and common actions</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col justify-center">
        {/* Primary Action */}
        <div className="text-center">
          <EnhancedTaskForm
            trigger={
              <Button size="lg" className="w-full cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            }
          />
        </div>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-2">
          {lastWorkedTask && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-3 flex flex-col items-center cursor-pointer bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/50 text-muted-foreground hover:text-foreground"
              onClick={handleResumeLastTask}
              title={lastWorkedTask.title}
            >
              <Play className="h-4 w-4 mb-1" />
              <span className="text-xs text-center leading-tight">
                Resume Last
              </span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-3 flex flex-col items-center cursor-pointer bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/50 text-muted-foreground hover:text-foreground"
            onClick={handlePlanTomorrow}
          >
            <Calendar className="h-4 w-4 mb-1" />
            <span className="text-xs text-center leading-tight">
              Plan Tomorrow
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-3 flex flex-col items-center cursor-pointer bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/50 text-muted-foreground hover:text-foreground disabled:opacity-50"
            onClick={handleQuickAddTemplate}
            disabled={isCreatingTemplate}
          >
            <Zap className="h-4 w-4 mb-1" />
            <span className="text-xs text-center leading-tight">
              {isCreatingTemplate ? 'Creating...' : 'Quick Add'}
            </span>
          </Button>

          {/* Command Bar Hint */}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-3 flex flex-col items-center cursor-pointer bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/50 text-muted-foreground hover:text-foreground border-dashed"
            onClick={openCommandBar}
          >
            <Command className="h-4 w-4 mb-1" />
            <span className="text-xs text-center leading-tight">
              ⌘K search
            </span>
          </Button>
        </div>

        </div>
      </CardContent>
    </Card>
  );
}
