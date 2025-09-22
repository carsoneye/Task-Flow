"use client";

import React, { useEffect, useRef } from 'react';
import { useTasks } from '@/context/task-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskList } from './task-list';
import { TaskGrid } from './task-grid';
import { TaskCompact } from './task-compact';
import { ViewToggle } from './view-toggle';
import { FolderOpen, Plus, Target, CheckCircle2 } from 'lucide-react';

export function ProjectsView() {
  const { state } = useTasks();
  const { tasks, viewMode } = state;
  const progressBarsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    progressBarsRef.current.forEach((progressBar, index) => {
      if (progressBar) {
        const projects = getProjectsData();
        const project = projects[index];
        if (project) {
          const width = project.total > 0 ? (project.completed / project.total) * 100 : 0;
          progressBar.style.width = `${width}%`;
        }
      }
    });
  }, [tasks]);

  // Define actual projects based on task tags and categories
  const projectDefinitions = [
    {
      id: 'website-redesign',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
      keywords: ['website', 'redesign', 'frontend', 'ui', 'ux']
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Development',
      description: 'Build native mobile application',
      color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
      keywords: ['mobile', 'app', 'react-native', 'ios', 'android']
    },
    {
      id: 'api-integration',
      name: 'API Integration',
      description: 'Integrate third-party APIs',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
      keywords: ['api', 'integration', 'backend', 'rest', 'graphql']
    },
    {
      id: 'database-migration',
      name: 'Database Migration',
      description: 'Migrate to new database system',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
      keywords: ['database', 'migration', 'sql', 'postgres', 'mysql']
    },
    {
      id: 'testing-suite',
      name: 'Testing Suite',
      description: 'Comprehensive testing implementation',
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200',
      keywords: ['testing', 'jest', 'cypress', 'unit', 'integration']
    }
  ];

  // Group tasks by projects based on tags and keywords
  const projects = projectDefinitions.map(project => {
    const projectTasks = tasks.filter(task => {
      // Check if task tags contain any project keywords
      const hasMatchingTag = task.tags?.some(tag => 
        project.keywords.some(keyword => 
          tag.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      // Check if task title or description contains keywords
      const hasMatchingContent = project.keywords.some(keyword => 
        task.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      return hasMatchingTag || hasMatchingContent;
    });

    return {
      ...project,
      tasks: projectTasks,
      completed: projectTasks.filter(t => t.completed).length,
      total: projectTasks.length,
      priority: projectTasks.length > 10 ? 'high' as const : 
                projectTasks.length > 5 ? 'medium' as const : 'low' as const
    };
  }).filter(project => project.total > 0); // Only show projects with tasks

  const projectList = projects.sort((a, b) => {
    // Sort by completion percentage (ascending), then by total tasks (descending)
    const aCompletion = a.total > 0 ? a.completed / a.total : 1;
    const bCompletion = b.total > 0 ? b.completed / b.total : 1;
    
    if (aCompletion !== bCompletion) {
      return aCompletion - bCompletion;
    }
    return b.total - a.total;
  });

  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;

    return (
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProject(null)}
              className="cursor-pointer"
            >
              ← Back to Projects
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">
                {project.total} {project.total === 1 ? 'task' : 'tasks'} • {project.completed} completed
              </p>
            </div>
          </div>
          <ViewToggle />
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progress</h3>
              <span className="text-sm text-muted-foreground">
                {project.total > 0 ? Math.round((project.completed / project.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                ref={(el) => progressBarsRef.current[index] = el}
                className="bg-primary h-2 rounded-full transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
         {viewMode === 'list' && <TaskList tasks={project.tasks} view="projects" />}
         {viewMode === 'grid' && <TaskGrid tasks={project.tasks} view="projects" />}
         {viewMode === 'compact' && <TaskCompact tasks={project.tasks} view="projects" />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Organize tasks by projects (Coming Soon)
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Projects View Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We&apos;re building a powerful project management system to help you organize and track your tasks by projects.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            <Target className="h-4 w-4" />
            Coming in the next update
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
