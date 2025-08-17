# React UI Kit with Storybook

A comprehensive, accessible, and beautiful React component library built with TypeScript, TailwindCSS, and Storybook.

## 🎯 Features

- **Modern Design System**: Professional gradients, smooth animations, and elegant styling
- **TypeScript Ready**: Full type safety with comprehensive interfaces
- **Accessibility First**: ARIA compliant with keyboard navigation support
- **Storybook Documentation**: Interactive component playground and documentation
- **Responsive Design**: Mobile-first approach with elegant breakpoints
- **Dark Mode Support**: Complete theming system with light and dark variants

## 📦 Components

### InputField
A flexible input component with multiple variants and states:
- **Variants**: `filled`, `outlined`, `ghost`
- **Sizes**: `sm`, `md`, `lg`
- **States**: default, invalid, loading, disabled
- **Features**: password toggle, clear button, helper text, error messages

### DataTable
A powerful data table with advanced functionality:
- **Sorting**: Multi-column sorting with visual indicators
- **Selection**: Single or multiple row selection
- **Custom Rendering**: Flexible cell content with render functions
- **Loading States**: Built-in loading and empty states
- **Responsive**: Horizontal scrolling on mobile devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build
```

## 📖 Usage Examples

### InputField

```tsx
import { InputField } from '@/components/ui/InputField';

// Basic usage
<InputField
  label="Email"
  placeholder="john@example.com"
  type="email"
/>

// With validation
<InputField
  label="Password"
  type="password"
  invalid={hasError}
  errorMessage="Password is required"
/>

// Clearable input
<InputField
  label="Search"
  clearable
  onClear={() => setValue('')}
/>
```

### DataTable

```tsx
import { DataTable, Column } from '@/components/ui/DataTable';

const columns: Column<User>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    render: (status) => <Badge>{status}</Badge>,
  },
];

<DataTable
  data={users}
  columns={columns}
  selectable
  onRowSelect={setSelectedUsers}
/>
```

## 🎨 Design System

The components use a comprehensive design system with:

- **Semantic Color Tokens**: Primary, secondary, accent, success, warning, destructive
- **Consistent Spacing**: Based on a 8px grid system
- **Typography Scale**: Harmonious font sizes and line heights
- **Elevation System**: Consistent shadow and border patterns
- **Animation Tokens**: Smooth transitions and micro-interactions

## 🔧 Component Architecture

### File Structure
```
src/
├── components/
│   └── ui/
│       ├── InputField.tsx
│       ├── InputField.stories.tsx
│       ├── DataTable.tsx
│       └── DataTable.stories.tsx
├── lib/
│   └── utils.ts
├── hooks/
└── pages/
```

### Design Principles

1. **Composition over Configuration**: Components accept render props and custom renderers
2. **Controlled & Uncontrolled**: Support for both controlled and uncontrolled usage
3. **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
4. **Performance**: Optimized re-renders with React.memo and useCallback
5. **Type Safety**: Comprehensive TypeScript interfaces and strict typing

## 📚 Storybook Documentation

Each component includes comprehensive Storybook stories covering:

- **All Variants**: Visual variants and sizing options
- **All States**: Loading, error, disabled, and interactive states
- **Real-world Examples**: Form implementations and data scenarios
- **Accessibility Notes**: Keyboard navigation and screen reader support
- **API Documentation**: Props, types, and usage guidelines

## 🧪 Testing

Components are designed with testing in mind:

- **Semantic HTML**: Use proper HTML elements for easier testing
- **ARIA Labels**: Consistent labeling for accessibility testing
- **Data Attributes**: Test-friendly selectors
- **Predictable Behavior**: Consistent interaction patterns

## 🎯 Best Practices

### InputField
- Always provide labels for accessibility
- Use appropriate input types (`email`, `tel`, `url`)
- Implement proper validation feedback
- Consider clearable functionality for search inputs

### DataTable
- Keep column configurations simple and readable
- Use custom render functions for complex cell content
- Implement proper loading states for async data
- Consider virtualization for large datasets

## 🔗 Links

- **Live Demo**: [Component Showcase](/)
- **Storybook**: Interactive component documentation
- **GitHub**: Source code and issue tracking

## 🤝 Contributing

1. Follow the existing design patterns
2. Ensure accessibility compliance
3. Add comprehensive Storybook stories
4. Include TypeScript types
5. Test on multiple screen sizes

## 📄 License

MIT License - feel free to use in your projects!

---

Built with ❤️ using React, TypeScript, TailwindCSS, and Storybook