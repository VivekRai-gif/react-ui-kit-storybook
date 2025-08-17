import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from 'lucide-react';
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
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-1" />;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary ml-1" />
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
      <div className={cn('rounded-lg border bg-card shadow-elegant', className)}>
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg border bg-card shadow-elegant overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected || isPartiallySelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                    className={isPartiallySelected ? "data-[state=checked]:bg-muted" : ""}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-sm font-semibold text-muted-foreground',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:text-foreground transition-colors duration-fast select-none'
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
                  <div className="flex items-center">
                    {column.title}
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => {
                const key = getRowKey(row, index);
                const isSelected = selectedRows.has(key);
                
                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-b border-border/50 hover:bg-muted/30 transition-colors duration-fast',
                      isSelected && 'bg-primary-light'
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleRowSelection(key, checked as boolean)
                          }
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-4 py-3 text-sm text-foreground',
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
        <div className="px-4 py-2 bg-primary-light border-t text-sm text-primary">
          {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}

export { DataTable };