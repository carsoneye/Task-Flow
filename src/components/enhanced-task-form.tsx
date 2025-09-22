"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTasks } from "@/context/task-context";
import { Task, RecurringPattern } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedTaskFormProps {
  task?: Task;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

interface ParsedInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'health' | 'other';
  tags?: string[];
  mentions?: string[];
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export function EnhancedTaskForm({ task, trigger, onSuccess }: EnhancedTaskFormProps) {
  const { addTask, updateTask, state } = useTasks();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(task?.creationMode || "quick");
  
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    category: task?.category || "personal",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    estimatedMinutes: task?.estimatedMinutes || 25,
    tags: task?.tags?.join(", ") || "",
    mentions: task?.mentions?.join(", ") || "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize activeTab based on task's creation mode when editing
  useEffect(() => {
    if (task?.creationMode) {
      setActiveTab(task.creationMode);
    }
  }, [task?.creationMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      mentions: formData.mentions.split(',').map(mention => mention.trim()).filter(Boolean),
      creationMode: activeTab as 'quick' | 'detailed',
      completed: false,
      status: 'pending' as const,
    };

    try {
      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await addTask(taskData);
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "personal",
        dueDate: "",
        estimatedMinutes: 25,
        tags: "",
        mentions: "",
      });
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error creating/updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuickAdd = () => (
    <div className="space-y-6">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="min-h-[100px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit(e as React.FormEvent<HTMLTextAreaElement>);
            }
          }}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!formData.title.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {task ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            {task ? 'Update Task' : 'Add Task'}
          </>
        )}
      </Button>
    </div>
  );

  const renderDetailedForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-semibold text-foreground">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Task title"
          className="mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional description"
          className="mt-1 min-h-[80px] resize-none border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority" className="text-sm font-semibold text-foreground">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}
          >
            <SelectTrigger className="w-full mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category" className="text-sm font-semibold text-foreground">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as 'work' | 'personal' | 'health' | 'other' }))}
          >
            <SelectTrigger className="w-full mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20">
              <SelectValue placeholder="Select category" />
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
      <div>
        <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20",
                !formData.dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
              onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date ? format(date, "yyyy-MM-dd") : "" }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="estimatedMinutes" className="text-sm font-semibold text-foreground">Estimated Minutes</Label>
        <Input
          id="estimatedMinutes"
          type="number"
          value={formData.estimatedMinutes}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 0 }))}
          placeholder="e.g., 30"
          className="mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <div>
        <Label htmlFor="tags" className="text-sm font-semibold text-foreground">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="e.g., work, urgent"
          className="mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <div>
        <Label htmlFor="mentions" className="text-sm font-semibold text-foreground">Mentions (comma-separated)</Label>
        <Input
          id="mentions"
          value={formData.mentions}
          onChange={(e) => setFormData(prev => ({ ...prev, mentions: e.target.value }))}
          placeholder="e.g., @john, @sarah"
          className="mt-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!formData.title.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {task ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            {task ? 'Update Task' : 'Add Task'}
          </>
        )}
      </Button>
    </div>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'quick' | 'detailed')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick" className="cursor-pointer">Quick Add</TabsTrigger>
          <TabsTrigger value="detailed" className="cursor-pointer">Detailed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick" className="space-y-4">
          {renderQuickAdd()}
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4">
          {renderDetailedForm()}
        </TabsContent>
      </Tabs>
    </form>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {React.cloneElement(trigger as React.ReactElement, {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
              console.log('Dialog trigger clicked, opening modal');
            }
          } as any)}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {task ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}