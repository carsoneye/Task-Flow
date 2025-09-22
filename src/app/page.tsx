"use client";

import { AppContent } from "@/components/app-content-new";
import { TaskProvider } from "@/context/task-context";
import { CommandBar } from "@/components/command-bar";
import { useCommandBar } from "@/context/command-bar-context";

function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppContent />
    </div>
  );
}

function AppWithCommandBar() {
  const { isOpen, closeCommandBar } = useCommandBar();
  
  return (
    <>
      <AppLayout />
      <CommandBar isOpen={isOpen} onClose={closeCommandBar} />
    </>
  );
}

export default function Home() {
  return (
    <TaskProvider>
      <AppWithCommandBar />
    </TaskProvider>
  );
}
