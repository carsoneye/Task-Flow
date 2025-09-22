"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/context/task-context';
import { Task } from '@/types/task';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ParsedTask {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'health' | 'other';
  tags?: string[];
}

export function CommandBar({ isOpen, onClose }: CommandBarProps) {
  const { state } = useTasks();
  const { tasks } = state;
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Parse natural language for task creation
  const parseNaturalLanguage = (text: string): ParsedTask => {
    const result: ParsedTask = { title: text };
    
    // Extract time references
    const timeRegex = /(tomorrow|today|next week|next month|in \d+ days?|at \d+:\d+|at \d+[ap]m)/gi;
    const timeMatch = text.match(timeRegex);
    if (timeMatch) {
      const timeStr = timeMatch[0].toLowerCase();
      const now = new Date();
      
      if (timeStr.includes('tomorrow')) {
        result.dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      } else if (timeStr.includes('today')) {
        result.dueDate = now;
      } else if (timeStr.includes('next week')) {
        result.dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (timeStr.includes('next month')) {
        result.dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else if (timeStr.includes('in ') && timeStr.includes(' days')) {
        const days = parseInt(timeStr.match(/\d+/)?.[0] || '0');
        result.dueDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      } else if (timeStr.includes('at ')) {
        const timeMatch = timeStr.match(/(\d+):?(\d+)?\s*([ap]m)?/);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2] || '0');
          const ampm = timeMatch[3];
          
          if (ampm === 'pm' && hours !== 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
          
          result.dueDate = new Date(now);
          result.dueDate.setHours(hours, minutes, 0, 0);
        }
      }
    }

    // Extract priority keywords
    if (/\b(urgent|asap|critical|high)\b/i.test(text)) {
      result.priority = 'high';
    } else if (/\b(medium|normal|moderate)\b/i.test(text)) {
      result.priority = 'medium';
    } else if (/\b(low|someday|whenever)\b/i.test(text)) {
      result.priority = 'low';
    }

    // Extract category keywords
    if (/\b(work|job|office|meeting|project)\b/i.test(text)) {
      result.category = 'work';
    } else if (/\b(personal|home|family|life)\b/i.test(text)) {
      result.category = 'personal';
    } else if (/\b(health|fitness|exercise|doctor|medical)\b/i.test(text)) {
      result.category = 'health';
    }

    // Extract tags
    const tagMatches = text.match(/#(\w+)/g);
    if (tagMatches) {
      result.tags = tagMatches.map(tag => tag.substring(1));
    }

    // Clean up title by removing parsed elements
    const cleanTitle = text
      .replace(timeRegex, '')
      .replace(/\b(urgent|asap|critical|high|medium|normal|moderate|low|someday|whenever)\b/gi, '')
      .replace(/\b(work|job|office|meeting|project|personal|home|family|life|health|fitness|exercise|doctor|medical)\b/gi, '')
      .replace(/#\w+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    result.title = cleanTitle || text;

    return result;
  };

  // Fuzzy search implementation
  const fuzzySearch = (query: string, text: string): number => {
    if (!query) return 0;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    if (textLower.includes(queryLower)) {
      return 1;
    }
    
    // Simple fuzzy matching
    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score++;
        queryIndex++;
      }
    }
    
    return queryIndex === queryLower.length ? score / queryLower.length : 0;
  };

  // Simple task search
  const getSearchResults = (): SearchResult[] => {
    const results: SearchResult[] = [];
    
    // Only show results if there's a search query
    if (!query.trim()) {
      return results;
    }
    
    const queryLower = query.toLowerCase();

    // Search through existing tasks
    const matchingTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(queryLower) ||
      task.description?.toLowerCase().includes(queryLower) ||
      task.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );

    matchingTasks.forEach(task => {
      results.push({
        id: task.id,
        title: task.title,
        description: task.description,
        icon: <Search className="h-4 w-4" />,
        action: () => {
          // For now, just close the dialog
          // TODO: Navigate to task or open task details
          onClose();
        }
      });
    });

    return results;
  };

  const results = getSearchResults();

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground mr-3" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks..."
            className="border-0 shadow-none focus-visible:ring-0 text-base"
          />
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          <div className="p-2">
            {results.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Search className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                      index === selectedIndex 
                        ? "bg-accent text-accent-foreground" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => result.action()}
                  >
                    <div className="flex-shrink-0">
                      {result.icon}
                    </div>
                    <span className="font-medium">{result.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
