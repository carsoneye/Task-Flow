"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Eye
} from "lucide-react";
import { DataManagement } from "./data-management";

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  showCompletedTasks: boolean;
  defaultView: 'today' | 'week' | 'all';
  autoSave: boolean;
  compactMode: boolean;
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'system',
    notifications: true,
    showCompletedTasks: true,
    defaultView: 'today',
    autoSave: true,
    compactMode: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('focus-tasks-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  // Auto-save settings to localStorage
  useEffect(() => {
    localStorage.setItem('focus-tasks-settings', JSON.stringify(settings));
  }, [settings]);

  // Handle setting changes
  const updateSetting = (key: keyof SettingsState, value: string | boolean) => {
    if (key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      title: "Appearance",
      icon: Palette,
      settings: [
        {
          key: 'theme' as keyof SettingsState,
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select' as const,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]
        },
        {
          key: 'compactMode' as keyof SettingsState,
          label: 'Compact Mode',
          description: 'Reduce spacing and padding for a more compact view',
          type: 'switch' as const,
        },
        {
          key: 'showCompletedTasks' as keyof SettingsState,
          label: 'Show Completed Tasks',
          description: 'Display completed tasks in the task list',
          type: 'switch' as const,
        }
      ]
    },
    {
      title: "Behavior",
      icon: Eye,
      settings: [
        {
          key: 'defaultView' as keyof SettingsState,
          label: 'Default View',
          description: 'The view to show when opening the app',
          type: 'select' as const,
          options: [
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'all', label: 'All Tasks' },
          ]
        },
        {
          key: 'autoSave' as keyof SettingsState,
          label: 'Auto Save',
          description: 'Automatically save changes as you work',
          type: 'switch' as const,
        },
        {
          key: 'notifications' as keyof SettingsState,
          label: 'Notifications',
          description: 'Enable browser notifications for task reminders',
          type: 'switch' as const,
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Customize your task management experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Card key={section.title} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={setting.key} className="text-sm font-medium">
                          {setting.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {setting.type === 'switch' ? (
                          <Switch
                            id={setting.key}
                            checked={settings[setting.key] as boolean}
                            onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                          />
                        ) : setting.type === 'select' ? (
                          <Select
                            value={setting.key === 'theme' ? theme : settings[setting.key] as string}
                            onValueChange={(value) => updateSetting(setting.key, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Data Management Section */}
      <Separator />
      <DataManagement />
    </div>
  );
}
