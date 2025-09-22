"use client";

import React from 'react';
import { useTasks } from '@/context/task-context';
import { Navigation, Breadcrumb } from './navigation';
import { Dashboard } from './dashboard';
import { TaskList } from './task-list';
import { TaskGrid } from './task-grid';
import { TaskCompact } from './task-compact';
import { ViewToggle } from './view-toggle';
import { SortToggle } from './sort-toggle';
import { SettingsPage } from './settings-page';
import { ProjectsView } from './projects-view';
import { CalendarView } from './calendar-view';
import { TaskView, TaskSubView } from '@/types/task';

export function AppContent() {
  const { state, setView, getTasksForView, setSort, getFilteredTasks } = useTasks();
  const { currentView, currentSubView, viewMode, isLoading, sortBy } = state;

  const handleViewChange = (view: TaskView, subView?: TaskSubView) => {
    setView(view, subView);
  };

  const renderContent = () => {
    const tasks = getTasksForView(currentView, currentSubView);

    switch (currentView) {
      case 'overview':
        return <Dashboard />;
      
      case 'tasks':
        const tasksForView = getTasksForView(currentView, currentSubView);
        return (
          <div className="space-y-6">
            {/* Header with view toggle and sort */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {currentSubView === 'completed' && 'Completed Tasks'}
                  {currentSubView === 'all' && 'Tasks'}
                  {!currentSubView && 'Tasks'}
                </h1>
                <p className="text-muted-foreground">
                  {tasksForView.length} {tasksForView.length === 1 ? 'task' : 'tasks'}
                  {currentSubView === 'completed' && ' completed'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <SortToggle currentSort={sortBy} onSortChange={setSort} />
                <ViewToggle />
              </div>
            </div>

             {/* Tasks display */}
             {viewMode === 'list' && <TaskList tasks={tasksForView} view={currentView} showStats={currentSubView === 'completed'} />}
             {viewMode === 'grid' && <TaskGrid tasks={tasksForView} view={currentView} showStats={currentSubView === 'completed'} />}
             {viewMode === 'compact' && <TaskCompact tasks={tasksForView} view={currentView} showStats={currentSubView === 'completed'} />}
          </div>
        );
      
      case 'projects':
        return <ProjectsView />;
      
      case 'calendar':
        return <CalendarView />;
      
      case 'settings':
        return <SettingsPage />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation - Available on all views */}
      <div className="border-b border-border/30">
        <div className="container mx-auto px-6 py-3">
          <Navigation 
            currentView={currentView}
            currentSubView={currentSubView}
            onViewChange={handleViewChange}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb 
              currentView={currentView}
              currentSubView={currentSubView}
              onNavigate={handleViewChange}
            />
          </div>
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
