"use client";

import { useState } from "react";
import { useTasks } from "@/context/task-context";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateInput } from "@/components/ui/date-picker";
import { Plus, Timer, Tag, Loader2 } from "lucide-react";

interface TaskFormProps {
  task?: Task;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function TaskForm({ task, trigger, onSuccess }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    category: task?.category || "personal",
    dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : "",
        estimatedMinutes: task?.estimatedMinutes || 25,
        tags: task?.tags?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority as Task['priority'],
        category: formData.category as Task['category'],
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        estimatedMinutes: formData.estimatedMinutes || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        completed: task?.completed || false,
        status: task?.status || 'pending',
      };

      if (task) {
        updateTask(task.id, taskData);
      } else {
        addTask(taskData);
      }

      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "personal",
        dueDate: "",
        estimatedMinutes: 25,
        tags: "",
      });
      
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add New Task
    </Button>
  );

  // If no trigger is provided, render as a direct form (for inline editing)
  if (!trigger) {
    return (
      <div className="space-y-6 p-6 rounded-lg bg-card border border-border/50 shadow-lg">
        <h3 className="text-lg font-semibold">
          {task ? "Edit Task" : "Create New Task"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              Task Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              className="text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Task['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
                Due Date
              </label>
              <DateInput
                id="dueDate"
                value={formData.dueDate}
                onChange={(date) => setFormData({ ...formData, dueDate: date })}
                placeholder="Select due date"
                className="border-border/50 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="estimatedMinutes" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Est. Time (min)
              </label>
              <Input
                id="estimatedMinutes"
                type="number"
                min="5"
                max="240"
                step="5"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 25 })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="tags" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="work, urgent, meeting (comma separated)"
            />
          </div>


          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {task ? "Updating..." : "Creating..."}
                </>
              ) : (
                task ? "Update Task" : "Create Task"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
              className="flex-1 border-border/50 hover:bg-muted font-semibold cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // If trigger is provided, render as a dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border/50 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              Task Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              className="text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="priority" className="text-sm font-semibold text-foreground">
                Priority
              </label>
              <Select
                value={formData.priority}
                 onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label htmlFor="category" className="text-sm font-semibold text-foreground">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as 'work' | 'personal' | 'health' | 'other' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
              Due Date
            </label>
            <DateInput
              id="dueDate"
              value={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              placeholder="Select due date"
              className="border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="estimatedMinutes" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Est. Time (min)
            </label>
            <Input
              id="estimatedMinutes"
              type="number"
              min="1"
              value={formData.estimatedMinutes}
              onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 25 })}
              placeholder="25"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="tags" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="work, urgent, meeting (comma separated)"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {task ? "Updating..." : "Creating..."}
                </>
              ) : (
                task ? "Update Task" : "Create Task"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
