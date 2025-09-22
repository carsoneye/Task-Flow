"use client";

import { useTasks } from "@/context/task-context";
import { DashboardGrid } from "./dashboard-grid";
import { DashboardSkeleton } from "./skeletons/dashboard-skeleton";

export function Dashboard() {
  const { state } = useTasks();
  const { isLoading } = state;

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return <DashboardGrid />;
}