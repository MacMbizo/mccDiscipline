# Development Setup Guide - MCC Discipline Tracker

## 🛠️ Development Environment Setup

### Prerequisites

#### Required Software
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: Latest version for version control
- **VS Code**: Recommended IDE with extensions

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

### Project Setup

#### Clone Repository
```bash
# Clone the repository
git clone <repository-url>
cd mcc-discipline-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Development Scripts
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check
```

### Supabase Development Setup

#### Local Supabase Setup (Optional)
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
supabase init

# Start local Supabase stack
supabase start

# Run migrations
supabase db push
```

#### Using Hosted Supabase (Recommended)
1. **Project Configuration**:
   - The project is pre-configured to use the hosted Supabase instance
   - No local environment variables needed
   - All configuration handled through Supabase integration

2. **Database Access**:
   - Access database through Supabase Dashboard
   - Use SQL Editor for database queries
   - Monitor real-time activity

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── analytics/      # Charts and analytics
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── dashboard/      # Dashboard components
│   ├── forms/          # Form components
│   ├── settings/       # Settings components
│   ├── student/        # Student-related components
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── main.tsx            # Application entry point
```

### Development Workflow

#### Branch Strategy
```bash
# Feature development
git checkout -b feature/feature-name
git commit -m "feat: implement feature"
git push origin feature/feature-name

# Bug fixes
git checkout -b fix/bug-description
git commit -m "fix: resolve issue"
git push origin fix/bug-description

# Hotfixes
git checkout -b hotfix/critical-fix
git commit -m "hotfix: critical issue"
git push origin hotfix/critical-fix
```

#### Commit Message Convention
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat(auth): add password reset functionality
fix(dashboard): resolve heat score calculation
docs(api): update endpoint documentation
```

### Code Standards

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### ESLint Configuration
```javascript
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...reactHooks.configs.recommended,
  {
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
];
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Component Development

#### Component Structure
```typescript
// ComponentName.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
  // Other props
}

const ComponentName: React.FC<ComponentNameProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {children}
    </div>
  );
};

export default ComponentName;
```

#### Custom Hooks
```typescript
// useCustomHook.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomHook = (dependency: string) => {
  const [state, setState] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['custom-data', dependency],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('table')
        .select('*')
        .eq('field', dependency);
      
      if (error) throw error;
      return data;
    },
    enabled: !!dependency,
  });

  useEffect(() => {
    // Side effects
  }, [dependency]);

  return { data, isLoading, error, state, setState };
};
```

### Database Development

#### Migration Files
```sql
-- Migration: 20240115_add_new_feature.sql
-- Add new table
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own records" ON new_table
  FOR SELECT USING (auth.uid() = user_id);
```

#### Database Functions
```sql
-- Function: calculate_metric.sql
CREATE OR REPLACE FUNCTION calculate_metric(input_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  result NUMERIC := 0;
BEGIN
  -- Calculation logic
  SELECT SUM(value) INTO result
  FROM table_name
  WHERE id = input_id;
  
  RETURN COALESCE(result, 0);
END;
$$ LANGUAGE plpgsql;
```

### Testing

#### Unit Testing
```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const mockFn = vi.fn();
    render(<Component onClick={mockFn} />);
    
    await user.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

#### Integration Testing
```typescript
// api.test.ts
import { describe, it, expect } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('API Integration', () => {
  it('fetches data correctly', async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

### Performance Optimization

#### Code Splitting
```typescript
// Lazy loading components
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

#### Query Optimization
```typescript
// Efficient data fetching
const { data } = useQuery({
  queryKey: ['students', { grade, limit }],
  queryFn: async () => {
    const { data } = await supabase
      .from('students')
      .select('id, name, grade, behavior_score') // Select only needed fields
      .eq('grade', grade)
      .limit(limit);
    
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Debugging

#### Development Tools
1. **React Developer Tools**:
   - Component inspection
   - State debugging
   - Performance profiling

2. **TanStack Query DevTools**:
   - Query state monitoring
   - Cache inspection
   - Network request tracking

3. **Browser DevTools**:
   - Network monitoring
   - Console debugging
   - Performance analysis

#### Common Debugging Techniques
```typescript
// Debug logging
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### Environment Configuration

#### Development vs Production
```typescript
// Environment-specific configuration
const config = {
  development: {
    logLevel: 'debug',
    showDevTools: true,
    apiRetries: 1,
  },
  production: {
    logLevel: 'error',
    showDevTools: false,
    apiRetries: 3,
  }
};

export const currentConfig = config[process.env.NODE_ENV || 'development'];
```

### Build Process

#### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
      },
    },
  },
});
```

### Troubleshooting

#### Common Issues
1. **TypeScript Errors**:
   ```bash
   # Fix common TypeScript issues
   npm run type-check
   
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   ```

2. **Build Failures**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Check for circular dependencies
   npm run build -- --verbose
   ```

3. **Database Connection Issues**:
   ```typescript
   // Check Supabase connection
   const { data, error } = await supabase.auth.getSession();
   console.log('Session:', data, error);
   ```

#### Getting Help
- **Documentation**: Check project documentation
- **Error Messages**: Read error messages carefully
- **Community**: React, Supabase, and TypeScript communities
- **Stack Overflow**: Search for similar issues
- **GitHub Issues**: Check project repository issues

### Contributing Guidelines

#### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request
6. Address review feedback

#### Code Review Checklist
- [ ] Code follows project standards
- [ ] TypeScript types are properly defined
- [ ] Components are accessible
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Performance is acceptable

### Deployment Preparation

#### Pre-deployment Checklist
- [ ] All tests pass
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Performance benchmarks met
- [ ] Security review completed

#### Build Optimization
```bash
# Analyze bundle size
npm run build
npm run preview

# Check bundle analyzer
npx vite-bundle-analyzer dist
```
