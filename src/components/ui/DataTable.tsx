import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2, FileText, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  rowKey?: keyof T | ((row: T, index: number) => string | number);
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className,
  emptyMessage = 'No data available',
  emptyIcon,
  rowKey = 'id',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Generate unique keys for rows
  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    return row[rowKey] || index;
  };

  // Sort data based on current sort configuration
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortConfig]);

  // Handle sort
  const handleSort = (columnKey: keyof T) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (!current || current.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key: columnKey, direction: 'desc' };
      }
      return null; // Reset to no sort
    });
  };

  // Handle row selection
  const handleRowSelection = (rowKey: string | number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(rowKey);
    } else {
      newSelectedRows.delete(rowKey);
    }
    setSelectedRows(newSelectedRows);

    // Call onRowSelect with the actual row objects
    const selectedRowObjects = sortedData.filter((row, index) => 
      newSelectedRows.has(getRowKey(row, index))
    );
    onRowSelect?.(selectedRowObjects);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = sortedData.map((row, index) => getRowKey(row, index));
      setSelectedRows(new Set(allKeys));
      onRowSelect?.(sortedData);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const isAllSelected = selectedRows.size > 0 && selectedRows.size === sortedData.length;
  const isPartiallySelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  // Get sort icon for column
  const getSortIcon = (columnKey: keyof T) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return null;

    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/60 ml-2 transition-colors-smooth" />;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary ml-2 transition-colors-smooth" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary ml-2 transition-colors-smooth" />
    );
  };

  const renderCellContent = (column: Column<T>, row: T, index: number) => {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row, index);
    }
    return value?.toString() || '';
  };

  if (loading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card shadow-elegant overflow-hidden', className)}>
        <div className="flex flex-col items-center justify-center h-64 p-8">
          <div className="flex items-center space-x-3 text-muted-foreground mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg font-medium">Loading data...</span>
          </div>
          <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-elegant overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {selectable && (
                <th className="w-12 px-6 py-4 text-left">
                  <Checkbox
                    checked={isAllSelected || isPartiallySelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                    className={cn(
                      "transition-colors-smooth",
                      isPartiallySelected && "data-[state=checked]:bg-muted-foreground"
                    )}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-4 text-sm font-semibold text-foreground/90',
                    'first:pl-6 last:pr-6',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && [
                      'cursor-pointer hover:text-primary transition-colors-smooth select-none',
                      'hover:bg-muted/50 focus:bg-muted/50 focus:outline-none'
                    ]
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                  role={column.sortable ? 'button' : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                  aria-sort={
                    sortConfig?.key === column.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center justify-start">
                    <span>{column.title}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                      {emptyIcon || <FileText className="h-8 w-8 text-muted-foreground/60" />}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">{emptyMessage}</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        There's no data to display at the moment. Try adjusting your filters or adding new entries.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => {
                const key = getRowKey(row, index);
                const isSelected = selectedRows.has(key);
                const isEven = index % 2 === 0;
                
                return (
                  <tr
                    key={key}
                    className={cn(
                      'transition-colors-smooth group',
                      'hover:bg-muted/40 hover:shadow-sm',
                      isSelected && 'bg-primary-light border-l-4 border-l-primary',
                      !isSelected && isEven && 'bg-muted/20',
                      !isSelected && !isEven && 'bg-background'
                    )}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleRowSelection(key, checked as boolean)
                          }
                          aria-label={`Select row ${index + 1}`}
                          className="transition-colors-smooth"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-6 py-4 text-sm text-foreground',
                          'first:pl-6 last:pr-6',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {renderCellContent(column, row, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {selectedRows.size > 0 && (
        <div className="px-6 py-4 bg-primary-light/80 border-t border-primary/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button 
              onClick={() => {
                setSelectedRows(new Set());
                onRowSelect?.([]);
              }}
              className="text-xs text-primary hover:text-primary-hover transition-colors-smooth underline"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };