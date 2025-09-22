"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CheckSquare, 
  FolderOpen, 
  Calendar, 
  Settings,
  ChevronDown,
  List,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { NavigationSkeleton } from './skeletons/navigation-skeleton';
import { TaskView, TaskSubView } from '@/types/task';

interface NavigationProps {
  currentView: TaskView;
  currentSubView?: TaskSubView;
  onViewChange: (view: TaskView, subView?: TaskSubView) => void;
  isLoading?: boolean;
}

const mainNavigationItems = [
  {
    id: 'overview' as TaskView,
    label: 'Overview',
    icon: Home,
    isDefault: true,
    description: 'Dashboard and overview'
  },
  {
    id: 'tasks' as TaskView,
    label: 'Tasks',
    icon: CheckSquare,
    hasSubMenu: true,
    subItems: [
      { id: 'all' as TaskSubView, label: 'All Tasks', description: 'View all tasks', icon: List },
      { id: 'completed' as TaskSubView, label: 'Completed Tasks', description: 'View completed tasks', icon: CheckCircle2 }
    ],
    description: 'Manage your tasks'
  },
  {
    id: 'projects' as TaskView,
    label: 'Projects',
    icon: FolderOpen,
    description: 'Organize tasks by projects (Coming Soon)',
    isPlaceholder: true
  },
  {
    id: 'calendar' as TaskView,
    label: 'Calendar',
    icon: Calendar,
    description: 'Calendar view of tasks (Coming Soon)',
    isPlaceholder: true
  }
];

const settingsItem = {
  id: 'settings' as TaskView,
  label: 'Settings',
  icon: Settings,
  description: 'App settings and preferences'
};

export function Navigation({ currentView, currentSubView, onViewChange, isLoading = false }: NavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const subMenuRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!navRef.current?.contains(document.activeElement)) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = Math.min(prev + 1, mainNavigationItems.length - 1);
            buttonRefs.current[nextIndex]?.focus();
            return nextIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => {
            const prevIndex = Math.max(prev - 1, 0);
            buttonRefs.current[prevIndex]?.focus();
            return prevIndex;
          });
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentView === 'tasks' && !isSubMenuOpen) {
            setIsSubMenuOpen(true);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (isSubMenuOpen) {
            setIsSubMenuOpen(false);
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0) {
            const item = mainNavigationItems[focusedIndex];
            if (item.hasSubMenu) {
              setIsSubMenuOpen(!isSubMenuOpen);
            } else {
              onViewChange(item.id);
            }
          }
          break;
        case 'Escape':
          setIsSubMenuOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, focusedIndex, isSubMenuOpen, onViewChange]);

  // Set initial focus
  useEffect(() => {
    const currentIndex = mainNavigationItems.findIndex(item => item.id === currentView);
    if (currentIndex >= 0) {
      setFocusedIndex(currentIndex);
    }
  }, [currentView]);

  // Handle hover off behavior for submenu
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      // Check if mouse is leaving the navigation area
      if (navRef.current && !navRef.current.contains(event.relatedTarget as Node)) {
        setIsSubMenuOpen(false);
      }
    };

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        navElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <NavigationSkeleton />;
  }

  const handleItemClick = (item: typeof mainNavigationItems[0]) => {
    if (!item.hasSubMenu) {
      onViewChange(item.id);
    }
    // For items with submenus (like Tasks), only handle navigation via hover or submenu clicks
  };


  const handleSubItemClick = (subItem: { id: TaskSubView; label: string; description: string }) => {
    onViewChange('tasks', subItem.id);
    setIsSubMenuOpen(false);
  };

  return (
    <nav 
      ref={navRef}
      className="relative flex items-center justify-between w-full"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">TaskFlow</span>
      </div>

      {/* Main Navigation - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {mainNavigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <div 
              key={item.id} 
              className="relative"
              onMouseEnter={() => item.hasSubMenu && setIsSubMenuOpen(true)}
              onMouseLeave={() => {
                // Only close if not hovering over the submenu itself
                setTimeout(() => {
                  if (item.hasSubMenu && !subMenuRef.current?.contains(document.activeElement)) {
                    setIsSubMenuOpen(false);
                  }
                }, 100);
              }}
            >
              <Button
                 ref={el => { buttonRefs.current[index] = el; }}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => !item.isPlaceholder && handleItemClick(item)}
                onFocus={() => setFocusedIndex(index)}
                disabled={item.isPlaceholder}
                className={`flex items-center gap-2 px-5 py-2.5 transition-colors duration-200 ${
                  item.isPlaceholder
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                style={isActive ? { pointerEvents: 'none' } : {}}
                title={item.description}
                aria-expanded={item.hasSubMenu ? isSubMenuOpen : undefined}
                aria-haspopup={item.hasSubMenu ? 'menu' : undefined}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.hasSubMenu && (
                  <ChevronDown className={`h-3 w-3 transition-transform ${
                    isSubMenuOpen ? 'rotate-180' : ''
                  }`} />
                )}
              </Button>

              {/* Sub-menu for Tasks */}
              {item.id === 'tasks' && isSubMenuOpen && (
                <div 
                  ref={subMenuRef}
                  className="absolute top-full left-0 w-48 bg-popover border border-border rounded-md shadow-lg z-50 -mt-0.5"
                >
                  <div className="p-1" role="menu" aria-orientation="vertical">
                    {item.subItems?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors duration-200 ${
                            currentSubView === subItem.id
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                          style={currentSubView === subItem.id ? { pointerEvents: 'none' } : {}}
                          role="menuitem"
                          title={subItem.description}
                        >
                          <div className="flex items-center gap-2">
                            <SubIcon className="h-3 w-3" />
                            {subItem.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('settings')}
        className="flex items-center gap-2 px-5 py-2.5 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
        title={settingsItem.description}
      >
        <Settings className="h-4 w-4" />
        <span>{settingsItem.label}</span>
      </Button>
    </nav>
  );
}

// Breadcrumb component
interface BreadcrumbProps {
  currentView: TaskView;
  currentSubView?: TaskSubView;
  onNavigate: (view: TaskView, subView?: TaskSubView) => void;
}

export function Breadcrumb({ currentView, currentSubView, onNavigate }: BreadcrumbProps) {
  const breadcrumbs = [];

  // Add Overview as root
  breadcrumbs.push({
    label: 'Overview',
    view: 'overview' as TaskView,
    isClickable: currentView !== 'overview'
  });

  // Add current view
  if (currentView !== 'overview') {
    const navItem = [...mainNavigationItems, settingsItem].find(item => item.id === currentView);
    if (navItem) {
      breadcrumbs.push({
        label: navItem.label,
        view: currentView,
        isClickable: false
      });

      // Add sub-view if it exists
      if (currentSubView && 'subItems' in navItem && navItem.subItems) {
        const subItem = (navItem as typeof mainNavigationItems[0]).subItems!.find(sub => sub.id === currentSubView);
        if (subItem) {
          breadcrumbs.push({
            label: subItem.label,
            view: currentView,
            subView: currentSubView,
            isClickable: false
          });
        }
      }
    }
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {crumb.isClickable ? (
            <button
              onClick={() => onNavigate(crumb.view, crumb.subView)}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {crumb.label}
            </button>
          ) : (
            <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
