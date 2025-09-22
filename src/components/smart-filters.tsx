"use client";

import { useTasks } from "@/context/task-context";
import { useClientOnly } from "@/hooks/use-client-only";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase,
  User,
  Heart,
  AlertTriangle,
  Clock,
  TrendingUp,
  Filter,
  X
} from "lucide-react";

export function SmartFilters() {
  const { state, setFilter, clearFilter } = useTasks();
  const { tasks, filter } = state;
  const isClient = useClientOnly();

  // Calculate counts for each filter
  const filterCounts = {
    work: tasks.filter(task => !task.completed && task.category === 'work').length,
    personal: tasks.filter(task => !task.completed && task.category === 'personal').length,
    health: tasks.filter(task => !task.completed && task.category === 'health').length,
    high: tasks.filter(task => !task.completed && task.priority === 'high').length,
    dueToday: isClient ? tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate.toDateString() === today.toDateString() && taskDueDate >= todayStart;
    }).length : 0,
    overdue: isClient ? tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate < todayStart;
    }).length : 0,
  };

  const categoryFilters = [
    { id: 'work', label: 'Work', icon: Briefcase, count: filterCounts.work, color: 'bg-task-progress-bg text-task-progress-text border-task-progress-accent/30' },
    { id: 'personal', label: 'Personal', icon: User, count: filterCounts.personal, color: 'bg-task-today-bg text-task-today-text border-task-today-accent/30' },
    { id: 'health', label: 'Health', icon: Heart, count: filterCounts.health, color: 'bg-task-completed-bg text-task-completed-text border-task-completed-accent/30' },
  ];

  const priorityFilters = [
    { id: 'high', label: 'High Priority', icon: AlertTriangle, count: filterCounts.high, color: 'bg-red-500 text-white border-red-500' },
    { id: 'medium', label: 'Medium Priority', icon: Clock, count: tasks.filter(task => !task.completed && task.priority === 'medium').length, color: 'bg-yellow-500 text-white border-yellow-500' },
    { id: 'low', label: 'Low Priority', icon: TrendingUp, count: tasks.filter(task => !task.completed && task.priority === 'low').length, color: 'bg-blue-500 text-white border-blue-500' },
  ];

  const timeFilters = [
    { id: 'dueToday', label: 'Due Today', icon: Clock, count: filterCounts.dueToday, color: 'bg-task-today-bg text-task-today-text border-task-today-accent/30' },
    { id: 'overdue', label: 'Overdue', icon: TrendingUp, count: filterCounts.overdue, color: 'bg-task-overdue-bg text-task-overdue-text border-task-overdue-accent/30' },
  ];

  const handleFilterClick = (filterType: string, filterValue: string) => {
    if (filterType === 'category') {
      setFilter({ category: filterValue });
    } else if (filterType === 'priority') {
      setFilter({ priority: filterValue });
    } else if (filterType === 'time') {
      if (filterValue === 'dueToday') {
        setFilter({ dueToday: true });
      } else if (filterValue === 'overdue') {
        setFilter({ overdue: true });
      }
    }
  };

  const handleClearFilters = () => {
    clearFilter();
  };

  const hasActiveFilters = Object.keys(filter).length > 0;

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Categories</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categoryFilters.map((filterItem) => {
            const Icon = filterItem.icon;
            const isActive = filter.category === filterItem.id;
            
            return (
              <Button
                key={filterItem.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterClick('category', filterItem.id)}
                className={`h-10 justify-start ${isActive ? 'bg-primary hover:bg-primary/90' : 'hover:bg-muted'}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{filterItem.label}</span>
                {filterItem.count > 0 && (
                  <Badge className="ml-auto h-5 px-2 text-xs bg-task-completed-bg text-task-completed-text border-task-completed-accent/30">
                    {filterItem.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Quick Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {priorityFilters.map((filterItem) => {
            const Icon = filterItem.icon;
            const isActive = filter.priority === filterItem.id;
            
            return (
              <Button
                key={filterItem.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterClick('priority', filterItem.id)}
                className={`h-10 justify-start ${isActive ? 'bg-primary hover:bg-primary/90' : 'hover:bg-muted'}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{filterItem.label}</span>
                {filterItem.count > 0 && (
                  <Badge className="ml-auto h-5 px-2 text-xs bg-task-overdue-bg text-task-overdue-text border-task-overdue-accent/30">
                    {filterItem.count}
                  </Badge>
                )}
              </Button>
            );
          })}
          
          {timeFilters.map((filterItem) => {
            const Icon = filterItem.icon;
            const isActive = (filterItem.id === 'dueToday' && filter.dueToday) || 
                           (filterItem.id === 'overdue' && filter.overdue);
            
            return (
              <Button
                key={filterItem.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterClick('time', filterItem.id)}
                className={`h-10 justify-start ${isActive ? 'bg-primary hover:bg-primary/90' : 'hover:bg-muted'}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{filterItem.label}</span>
                {filterItem.count > 0 && (
                  <Badge className={`ml-auto h-5 px-2 text-xs ${filterItem.id === 'overdue' ? 'bg-task-overdue-bg text-task-overdue-text border-task-overdue-accent/30' : 'bg-task-today-bg text-task-today-text border-task-today-accent/30'}`}>
                    {filterItem.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="h-9 text-muted-foreground hover:text-foreground w-full"
          >
            <X className="h-4 w-4 mr-2" />
            <span className="text-sm">Clear All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
