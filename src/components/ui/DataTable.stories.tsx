import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type Column } from './DataTable';
import { useState } from 'react';
import { Badge } from './badge';

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

// Sample data
const userData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2024-01-14T15:45:00Z',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2024-01-10T09:15:00Z',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'pending',
    lastLogin: '2024-01-16T14:20:00Z',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-16T11:30:00Z',
  },
];

const productData: Product[] = [
  { id: 'P001', name: 'Wireless Headphones', category: 'Electronics', price: 199.99, stock: 45, rating: 4.5 },
  { id: 'P002', name: 'Smart Watch', category: 'Electronics', price: 299.99, stock: 23, rating: 4.2 },
  { id: 'P003', name: 'Coffee Maker', category: 'Appliances', price: 89.99, stock: 12, rating: 4.8 },
  { id: 'P004', name: 'Desk Lamp', category: 'Furniture', price: 49.99, stock: 67, rating: 4.1 },
  { id: 'P005', name: 'Yoga Mat', category: 'Sports', price: 29.99, stock: 89, rating: 4.7 },
];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# DataTable Component

A comprehensive data table component with sorting, selection, and customizable rendering.

## Features

- **Column Sorting**: Click headers to sort by column (ascending/descending/none)
- **Row Selection**: Single or multiple row selection with checkboxes
- **Custom Rendering**: Flexible cell content with custom render functions
- **Loading States**: Built-in loading spinner and skeleton states
- **Empty States**: Customizable empty state messaging
- **Responsive Design**: Horizontal scrolling on smaller screens
- **Accessibility**: Full keyboard navigation and screen reader support

## Column Configuration

Each column supports:
- \`key\`: Property key from data objects
- \`title\`: Display name for the column header
- \`sortable\`: Enable/disable sorting for this column
- \`render\`: Custom render function for cell content
- \`align\`: Text alignment (left, center, right)
- \`width\`: Fixed width for the column

## Accessibility Features

- Keyboard navigation for sortable headers
- ARIA labels and roles for screen readers
- Proper focus management
- Sort state announcements
- Selection state feedback

## Use Cases

- User management tables
- Product catalogs
- Data dashboards
- Admin panels
- Content management systems
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    selectable: {
      control: 'boolean',
      description: 'Enable row selection',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message shown when no data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic user columns
const userColumns: Column<User>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (status: User['status']) => {
      const variants = {
        active: 'default',
        inactive: 'secondary',
        pending: 'outline',
      } as const;
      
      return (
        <Badge variant={variants[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
];

// Default story
export const Default: Story = {
  args: {
    data: userData,
    columns: userColumns,
  },
};

// With Selection
export const WithSelection: Story = {
  render: () => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">User Management</h3>
          {selectedUsers.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
        
        <DataTable
          data={userData}
          columns={userColumns}
          selectable
          onRowSelect={setSelectedUsers}
        />
        
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-primary-light rounded-lg">
            <h4 className="font-medium mb-2">Selected Users:</h4>
            <ul className="space-y-1">
              {selectedUsers.map(user => (
                <li key={user.id} className="text-sm">
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Data table with row selection functionality. Select individual rows or use the header checkbox to select all.',
      },
    },
  },
};

// Loading State
export const LoadingState: Story = {
  args: {
    data: [],
    columns: userColumns,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner animation.',
      },
    },
  },
};

// Empty State
export const EmptyState: Story = {
  args: {
    data: [],
    columns: userColumns,
    emptyMessage: 'No users found. Add some users to get started.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no data is available.',
      },
    },
  },
};

// Advanced Rendering
export const AdvancedRendering: Story = {
  render: () => {
    const advancedUserColumns: Column<User>[] = [
      {
        key: 'name',
        title: 'User',
        sortable: true,
        render: (name: string, user: User) => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        title: 'Role',
        sortable: true,
        render: (role: string) => (
          <Badge variant="outline">{role}</Badge>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        sortable: true,
        render: (status: User['status']) => {
          const config = {
            active: { color: 'bg-success', label: 'Active' },
            inactive: { color: 'bg-muted', label: 'Inactive' },
            pending: { color: 'bg-warning', label: 'Pending' },
          };
          
          return (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${config[status].color}`} />
              <span className="text-sm">{config[status].label}</span>
            </div>
          );
        },
      },
      {
        key: 'lastLogin',
        title: 'Last Login',
        sortable: true,
        render: (date: string) => {
          const formatted = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          return <span className="text-sm text-muted-foreground">{formatted}</span>;
        },
      },
      {
        key: 'id',
        title: 'Actions',
        align: 'right' as const,
        render: (_, user: User) => (
          <div className="flex space-x-1">
            <button className="px-2 py-1 text-xs bg-secondary hover:bg-secondary-hover rounded">
              Edit
            </button>
            <button className="px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded">
              Delete
            </button>
          </div>
        ),
      },
    ];

    return (
      <div className="p-6">
        <DataTable
          data={userData}
          columns={advancedUserColumns}
          selectable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced table with custom rendering for avatars, badges, status indicators, and action buttons.',
      },
    },
  },
};

// Product Table Example
export const ProductTable: Story = {
  render: () => {
    const productColumns: Column<Product>[] = [
      {
        key: 'name',
        title: 'Product',
        sortable: true,
        render: (name: string, product: Product) => (
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </div>
        ),
      },
      {
        key: 'category',
        title: 'Category',
        sortable: true,
        render: (category: string) => (
          <Badge variant="secondary">{category}</Badge>
        ),
      },
      {
        key: 'price',
        title: 'Price',
        sortable: true,
        align: 'right' as const,
        render: (price: number) => (
          <span className="font-mono">${price.toFixed(2)}</span>
        ),
      },
      {
        key: 'stock',
        title: 'Stock',
        sortable: true,
        align: 'center' as const,
        render: (stock: number) => {
          const isLow = stock < 20;
          return (
            <span className={`font-medium ${isLow ? 'text-warning' : 'text-foreground'}`}>
              {stock}
            </span>
          );
        },
      },
      {
        key: 'rating',
        title: 'Rating',
        sortable: true,
        align: 'center' as const,
        render: (rating: number) => (
          <div className="flex items-center justify-center space-x-1">
            <span className="text-sm">⭐</span>
            <span className="font-medium">{rating}</span>
          </div>
        ),
      },
    ];

    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Catalog</h3>
        <DataTable
          data={productData}
          columns={productColumns}
          selectable
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Product table example with price formatting, stock indicators, and rating display.',
      },
    },
  },
};

// Sortable Demo
export const SortableDemo: Story = {
  render: () => {
    const [sortInfo, setSortInfo] = useState<string>('Click column headers to sort');
    
    const trackingColumns: Column<User>[] = userColumns.map(col => ({
      ...col,
      sortable: true,
    }));

    return (
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Sorting Demo</h3>
          <p className="text-sm text-muted-foreground">{sortInfo}</p>
        </div>
        
        <DataTable
          data={userData}
          columns={trackingColumns}
        />
        
        <div className="text-xs text-muted-foreground">
          💡 Tip: Click a header once for ascending, twice for descending, three times to remove sorting.
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of sorting functionality. All columns are sortable.',
      },
    },
  },
};

// Interactive Demo
export const InteractiveDemo: Story = {
  args: {
    data: userData,
    columns: userColumns,
    selectable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo - use the controls panel to experiment with different props.',
      },
    },
  },
};