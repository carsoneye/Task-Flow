"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { storageUtils } from '@/lib/storage';
import { Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = storageUtils.exportData();
      
      // Create and download file
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setImportResult({ success: true, message: 'Data exported successfully!' });
    } catch (error) {
      setImportResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Export failed' 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = storageUtils.importData(content);
        
        if (result.success) {
          setImportResult({ success: true, message: 'Data imported successfully! Please refresh the page.' });
        } else {
          setImportResult({ success: false, message: result.error || 'Import failed' });
        }
      } catch (error) {
        setImportResult({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Invalid file format' 
        });
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storageUtils.clearAllData();
      setImportResult({ success: true, message: 'All data cleared successfully! Please refresh the page.' });
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Management</h2>
        <p className="text-muted-foreground">
          Backup, restore, and manage your task data
        </p>
      </div>

      {importResult && (
        <Alert className={importResult.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'}>
          {importResult.success ? (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <AlertDescription className={importResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
            {importResult.message}
          </AlertDescription>
        </Alert>
      )}


      {/* Backup & Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download a backup of all your tasks and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Downloads a JSON file with all your data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>
              Restore data from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
              id="import-file"
            />
            <Button 
              asChild
              disabled={isImporting}
              className="w-full"
            >
              <label htmlFor="import-file" className="cursor-pointer">
                {isImporting ? 'Importing...' : 'Import Data'}
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Select a JSON backup file to restore
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clear Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Clear Data
          </CardTitle>
          <CardDescription>
            Remove all tasks and settings from your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleClearAllData}
            className="w-full"
          >
            Clear All Data
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will permanently delete all tasks and settings
          </p>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Export your data regularly to prevent data loss
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Backup files can be restored on any device
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Import will overwrite all existing data - make a backup first
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
