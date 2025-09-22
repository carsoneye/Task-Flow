"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Clock } from "lucide-react";

export type SortOption = 'newest' | 'oldest' | 'due-soon' | 'due-later' | 'priority-high' | 'priority-low' | 'title-a-z' | 'title-z-a';

interface SortToggleProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { value: 'newest' as const, label: 'Newest First', icon: ArrowDown },
  { value: 'oldest' as const, label: 'Oldest First', icon: ArrowUp },
  { value: 'due-soon' as const, label: 'Due Soon', icon: Calendar },
  { value: 'due-later' as const, label: 'Due Later', icon: Clock },
  { value: 'priority-high' as const, label: 'High Priority', icon: ArrowUp },
  { value: 'priority-low' as const, label: 'Low Priority', icon: ArrowDown },
  { value: 'title-a-z' as const, label: 'Title A-Z', icon: ArrowUp },
  { value: 'title-z-a' as const, label: 'Title Z-A', icon: ArrowDown },
];

export function SortToggle({ currentSort, onSortChange }: SortToggleProps) {
  const currentOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0];
  const Icon = currentOption.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Icon className="h-4 w-4" />
          {currentOption.label}
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => {
          const OptionIcon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="flex items-center gap-2"
            >
              <OptionIcon className="h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
