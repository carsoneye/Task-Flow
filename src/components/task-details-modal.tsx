"use client";

import { Task } from "@/types/task";
import { EnhancedTaskForm } from "./enhanced-task-form";

interface TaskDetailsModalProps {
  task: Task;
  children: React.ReactNode;
}

export function TaskDetailsModal({ task, children }: TaskDetailsModalProps) {
  return (
    <EnhancedTaskForm
      task={task}
      trigger={children}
      onSuccess={() => {
        // Close any open modals or refresh the task list
        console.log('Task updated successfully');
      }}
    />
  );
}