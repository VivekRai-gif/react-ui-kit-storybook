import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';
import { useState } from 'react';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# InputField Component

A flexible and accessible input component with multiple variants, sizes, and states.

## Features

- **Variants**: \`filled\`, \`outlined\`, \`ghost\`
- **Sizes**: \`sm\`, \`md\`, \`lg\`
- **States**: default, invalid, loading, disabled
- **Additional Features**: password toggle, clear button, helper text, error messages
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support

## Use Cases

- Form inputs with validation feedback
- Search fields with clear functionality
- Password fields with visibility toggle
- Loading states during async operations
- Different visual styles to match design requirements

## Accessibility Features

- Proper ARIA attributes for invalid states
- Screen reader announcements for errors
- Keyboard navigation support
- Focus management
- Semantic HTML structure
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'url'],
      description: 'Input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    invalid: {
      control: 'boolean',
      description: 'Mark input as invalid',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button when input has value',
    },
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (overrides helperText)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    placeholder: 'Enter your text...',
  },
};

// With Label and Helper Text
export const WithLabelAndHelper: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    helperText: 'We\'ll never share your email address',
    type: 'email',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
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
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the InputField component.',
      },
    },
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InputField
        size="sm"
        label="Small"
        placeholder="Small input"
      />
      <InputField
        size="md"
        label="Medium (Default)"
        placeholder="Medium input"
      />
      <InputField
        size="lg"
        label="Large"
        placeholder="Large input"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes of the InputField component.',
      },
    },
  },
};

// States
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <InputField
        label="Default State"
        placeholder="Normal input"
        helperText="This is helper text"
      />
      <InputField
        label="Invalid State"
        placeholder="Invalid input"
        invalid
        errorMessage="This field is required"
        value="invalid@"
      />
      <InputField
        label="Loading State"
        placeholder="Loading..."
        loading
        value="Processing..."
      />
      <InputField
        label="Disabled State"
        placeholder="Disabled input"
        disabled
        value="Cannot edit"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different states of the InputField component.',
      },
    },
  },
};

// Password Input
export const PasswordInput: Story = {
  render: () => {
    const [password, setPassword] = useState('supersecret123');
    
    return (
      <div className="w-80">
        <InputField
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Password must be at least 8 characters"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input with visibility toggle functionality.',
      },
    },
  },
};

// Clearable Input
export const ClearableInput: Story = {
  render: () => {
    const [value, setValue] = useState('Clear me!');
    
    return (
      <div className="w-80">
        <InputField
          label="Clearable Input"
          placeholder="Type something..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
          onClear={() => setValue('')}
          helperText="Click the X button to clear"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with a clear button that appears when there\'s content.',
      },
    },
  },
};

// Form Example
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-96">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            invalid={!!errors.firstName}
            errorMessage={errors.firstName}
          />
          <InputField
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            invalid={!!errors.lastName}
            errorMessage={errors.lastName}
          />
        </div>
        
        <InputField
          type="email"
          label="Email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          invalid={!!errors.email}
          errorMessage={errors.email}
          clearable
          onClear={() => setFormData({ ...formData, email: '' })}
        />
        
        <InputField
          type="password"
          label="Password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          invalid={!!errors.password}
          errorMessage={errors.password}
          helperText="Must be at least 8 characters"
        />
        
        <InputField
          type="password"
          label="Confirm Password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          invalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
        />

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Create Account
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world form example showing validation and different input types.',
      },
    },
  },
};

// Interactive Demo
export const InteractiveDemo: Story = {
  args: {
    label: 'Interactive Demo',
    placeholder: 'Try different props...',
    helperText: 'Customize using the controls panel',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls panel below to interact with all available props.',
      },
    },
  },
};