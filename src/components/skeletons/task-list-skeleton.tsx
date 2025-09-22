"use client";

import { TaskItemSkeleton } from "./task-item-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListSkeletonProps {
  viewMode?: 'list' | 'grid' | 'compact';
  count?: number;
  showHeader?: boolean;
}

export function TaskListSkeleton({ 
  viewMode = 'list', 
  count = 5, 
  showHeader = true 
}: TaskListSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <TaskItemSkeleton key={index} viewMode={viewMode} />
  ));

  if (viewMode === 'compact') {
    return (
      <div className="border border-border/50 rounded-lg bg-card overflow-hidden">
        {showHeader && (
          <div className="p-4 border-b border-border/30">
            <Skeleton className="h-6 w-32" />
          </div>
        )}
        {skeletons}
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletons}
        </div>
      </div>
    );
  }

  // List view (default)
  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
      {skeletons}
    </div>
  );
}
