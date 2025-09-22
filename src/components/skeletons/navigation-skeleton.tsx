"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NavigationSkeleton() {
  return (
    <div className="border-b border-border/30 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Main Navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>

        {/* Settings */}
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}
