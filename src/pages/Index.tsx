import React, { useState } from 'react';
import { InputField } from '@/components/ui/InputField';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Book, Github, Play, Palette, Code2, Layers } from 'lucide-react';

// Sample data for demonstrations
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15T10:30:00Z' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastLogin: '2024-01-14T15:45:00Z' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'inactive', lastLogin: '2024-01-10T09:15:00Z' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'pending', lastLogin: '2024-01-16T14:20:00Z' },
];

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
    render: (role: string) => <Badge variant="outline">{role}</Badge>,
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
      return <Badge variant={variants[status]} className="capitalize">{status}</Badge>;
    },
  },
];

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: <Palette className="h-5 w-5" />,
      title: 'Beautiful Design System',
      description: 'Modern gradients, smooth animations, and professional styling'
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: 'Component Variants',
      description: 'Multiple sizes, states, and visual variants for every use case'
    },
    {
      icon: <Code2 className="h-5 w-5" />,
      title: 'TypeScript Ready',
      description: 'Full type safety with comprehensive interfaces and props'
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert('Form submitted successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              React UI Kit & Storybook
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Professional, accessible, and beautiful React components built with TypeScript, TailwindCSS, and modern design principles.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="shadow-glow">
                <Play className="mr-2 h-4 w-4" />
                View Live Demo
              </Button>
              <Button variant="outline" size="lg">
                <Book className="mr-2 h-4 w-4" />
                Open Storybook
              </Button>
              <Button variant="ghost" size="lg">
                <Github className="mr-2 h-4 w-4" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-elegant transition-all duration-normal">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Component Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive component library with live examples and interactive demos.
            </p>
          </div>

          <Tabs defaultValue="inputs" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="inputs">InputField Component</TabsTrigger>
              <TabsTrigger value="tables">DataTable Component</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs">
              <Card>
                <CardHeader>
                  <CardTitle>InputField Component</CardTitle>
                  <CardDescription>
                    Flexible input component with validation states, variants, and accessibility features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Examples */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Variants & Sizes</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">Variants</h4>
                        <InputField
                          variant="outlined"
                          label="Outlined (Default)"
                          placeholder="Outlined input"
                        />
                        <InputField
                          variant="filled"
                          label="Filled"
                          placeholder="Filled input"
                        />
                        <InputField
                          variant="ghost"
                          label="Ghost"
                          placeholder="Ghost input"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">Sizes</h4>
                        <InputField
                          size="sm"
                          label="Small"
                          placeholder="Small input"
                        />
                        <InputField
                          size="md"
                          label="Medium"
                          placeholder="Medium input"
                        />
                        <InputField
                          size="lg"
                          label="Large"
                          placeholder="Large input"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Interactive Form */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Interactive Form</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="First Name"
                          placeholder="John"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                        <InputField
                          type="email"
                          label="Email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          clearable
                          onClear={() => setFormData({ ...formData, email: '' })}
                          required
                        />
                      </div>
                      
                      <InputField
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        helperText="Must be at least 8 characters"
                        required
                      />
                      
                      <InputField
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        invalid={formData.confirmPassword && formData.password !== formData.confirmPassword}
                        errorMessage={
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? "Passwords don't match"
                            : undefined
                        }
                        required
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </div>

                  {/* States Demo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">States & Features</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Error State"
                        placeholder="Invalid input"
                        invalid
                        errorMessage="This field is required"
                        value="invalid@"
                      />
                      <InputField
                        label="Loading State"
                        placeholder="Processing..."
                        loading
                        value="Processing data..."
                      />
                      <InputField
                        label="Disabled State"
                        placeholder="Cannot edit"
                        disabled
                        value="Read only"
                      />
                      <InputField
                        label="Clearable Input"
                        placeholder="Type to see clear button"
                        defaultValue="Clear me!"
                        clearable
                        helperText="Clear button appears with content"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tables">
              <Card>
                <CardHeader>
                  <CardTitle>DataTable Component</CardTitle>
                  <CardDescription>
                    Powerful data table with sorting, selection, custom rendering, and responsive design.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">User Management Table</h3>
                      {selectedUsers.length > 0 && (
                        <Badge variant="secondary">
                          {selectedUsers.length} selected
                        </Badge>
                      )}
                    </div>
                    
                    <DataTable
                      data={sampleUsers}
                      columns={userColumns}
                      selectable
                      onRowSelect={setSelectedUsers}
                    />
                    
                    {selectedUsers.length > 0 && (
                      <div className="mt-4 p-4 bg-primary-light rounded-lg">
                        <h4 className="font-medium mb-2">Selected Users:</h4>
                        <div className="text-sm space-y-1">
                          {selectedUsers.map(user => (
                            <div key={user.id}>
                              {user.name} ({user.email}) - {user.role}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Features Highlight</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium mb-2">Sortable Columns</h4>
                        <p className="text-sm text-muted-foreground">
                          Click headers to sort ascending, descending, or remove sorting
                        </p>
                      </div>
                      <div className="text-center p-4 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium mb-2">Row Selection</h4>
                        <p className="text-sm text-muted-foreground">
                          Select individual rows or use header checkbox for all
                        </p>
                      </div>
                      <div className="text-center p-4 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium mb-2">Custom Rendering</h4>
                        <p className="text-sm text-muted-foreground">
                          Render badges, buttons, or any custom components
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Documentation Links */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Documentation & Resources</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" size="lg">
              <Book className="mr-2 h-4 w-4" />
              Component Documentation
            </Button>
            <Button variant="outline" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Interactive Storybook
            </Button>
            <Button variant="outline" size="lg">
              <Github className="mr-2 h-4 w-4" />
              GitHub Repository
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>Built with React, TypeScript, TailwindCSS, and Storybook</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;