"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CommandBarContextType {
  isOpen: boolean;
  openCommandBar: () => void;
  closeCommandBar: () => void;
  toggleCommandBar: () => void;
}

const CommandBarContext = createContext<CommandBarContextType | undefined>(undefined);

export function CommandBarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCommandBar = () => setIsOpen(true);
  const closeCommandBar = () => setIsOpen(false);
  const toggleCommandBar = () => setIsOpen(prev => !prev);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleCommandBar();
      }
      
      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        closeCommandBar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <CommandBarContext.Provider value={{
      isOpen,
      openCommandBar,
      closeCommandBar,
      toggleCommandBar
    }}>
      {children}
    </CommandBarContext.Provider>
  );
}

export function useCommandBar() {
  const context = useContext(CommandBarContext);
  if (context === undefined) {
    throw new Error('useCommandBar must be used within a CommandBarProvider');
  }
  return context;
}
