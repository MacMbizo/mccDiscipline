
# Technical Documentation

## 🏗️ Architecture Overview

### System Architecture
The MCC Discipline Tracker follows a modern client-server architecture with a React frontend and Supabase backend, providing real-time data synchronization, authentication, and serverless functions.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│   Supabase      │◄──►│  External APIs  │
│   (Frontend)    │    │   (Backend)     │    │  (Email/SMS)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **React 18**: Component-based UI library with hooks
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Reusable component library
- **React Router DOM**: Client-side routing
- **TanStack Query**: Server state management
- **Recharts**: Data visualization library

#### Backend (Supabase)
- **PostgreSQL**: Primary database with advanced features
- **Row Level Security (RLS)**: Fine-grained access control
- **Edge Functions**: Serverless JavaScript functions
- **Real-time Subscriptions**: Live data updates
- **Authentication**: JWT-based user management
- **Storage**: File upload and management

#### External Integrations
- **Email Service**: Automated email notifications
- **SMS Service**: Text message alerts
- **Push Notifications**: Mobile app notifications

## 🗄️ Database Design

### Core Tables

#### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  gender TEXT,
  boarding_status TEXT DEFAULT 'day_scholar',
  behavior_score NUMERIC DEFAULT 0.0,
  needs_counseling BOOLEAN DEFAULT false,
  counseling_reason TEXT,
  counseling_flagged_at TIMESTAMPTZ,
  parent_contacts JSONB,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Behavior Records Table
```sql
CREATE TABLE behavior_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('incident', 'merit')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location TEXT,
  misdemeanor_id UUID REFERENCES misdemeanors(id),
  offense_number INTEGER,
  sanction TEXT,
  merit_tier TEXT,
  points NUMERIC,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  attachment_url TEXT,
  reported_by UUID REFERENCES profiles(id) NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent', 'shadow_parent', 'counselor')),
  profile_image TEXT,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{
    "email_incidents": true,
    "email_merits": true,
    "sms_incidents": false,
    "sms_merits": false,
    "push_incidents": true,
    "push_merits": true,
    "digest_frequency": "daily"
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Database Functions

#### Heat Score Calculation
```sql
CREATE OR REPLACE FUNCTION calculate_heat_score(student_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  incident_score DECIMAL := 0;
  merit_score DECIMAL := 0;
  final_score DECIMAL;
BEGIN
  -- Calculate incident score (progressive weighting)
  SELECT COALESCE(SUM(
    CASE offense_number 
      WHEN 1 THEN 1.0
      WHEN 2 THEN 2.0
      WHEN 3 THEN 3.0
      ELSE 4.0
    END
  ), 0) INTO incident_score
  FROM behavior_records
  WHERE student_id = student_uuid 
    AND type = 'incident'
    AND created_at >= NOW() - INTERVAL '6 months';
  
  -- Calculate merit score reduction
  SELECT COALESCE(SUM(points), 0) INTO merit_score
  FROM behavior_records
  WHERE student_id = student_uuid 
    AND type = 'merit'
    AND created_at >= NOW() - INTERVAL '6 months';
  
  -- Final score with merit reduction
  final_score := GREATEST(0, incident_score - (merit_score * 0.5));
  
  RETURN LEAST(10.0, final_score);
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security Policies

#### Student Access Control
```sql
-- Students can only view their own records
CREATE POLICY "Students view own records" ON behavior_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
        AND role = 'student'
        AND student_id = behavior_records.student_id
    )
  );

-- Teachers can view records for their students
CREATE POLICY "Teachers view student records" ON behavior_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
        AND role IN ('teacher', 'admin')
    )
  );
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. **User Registration**: Handled by Supabase Auth with role assignment
2. **Login Process**: JWT token generation with role claims
3. **Session Management**: Automatic token refresh and validation
4. **Logout**: Token invalidation and cleanup

### Role-Based Access Control
```typescript
// Role hierarchy and permissions
const ROLE_PERMISSIONS = {
  admin: ['*'], // Full access
  teacher: ['read:students', 'write:behavior_records', 'read:analytics'],
  counselor: ['read:students', 'read:counseling_alerts', 'write:interventions'],
  parent: ['read:own_child', 'read:notifications'],
  shadow_parent: ['read:assigned_students', 'read:notifications'],
  student: ['read:own_records', 'read:own_analytics']
};
```

### Security Implementation
- **JWT Tokens**: Secure authentication with expiration
- **RLS Policies**: Database-level access control
- **API Validation**: Server-side input validation
- **CORS Configuration**: Restricted cross-origin requests
- **Rate Limiting**: Protection against abuse

## 🔄 State Management

### TanStack Query Integration
```typescript
// Query configuration with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.code === 'PGRST301') return false;
        return failureCount < 3;
      },
    },
  },
});

// Example query hook
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};
```

### Context Providers
- **AuthContext**: User authentication state
- **ThemeContext**: UI theming and preferences
- **NotificationContext**: System-wide notifications

## 📡 Real-time Features

### Supabase Subscriptions
```typescript
// Real-time behavior record updates
useEffect(() => {
  const subscription = supabase
    .channel('behavior-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'behavior_records',
      },
      (payload) => {
        // Update local state
        queryClient.invalidateQueries(['behavior-records']);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### Live Dashboard Updates
- **Real-time Metrics**: Instant updates to dashboard statistics
- **Notification Delivery**: Live notification center updates
- **Behavior Alerts**: Immediate counseling flag notifications

## 🔧 API Design

### REST API Patterns
```typescript
// Standard API response format
interface APIResponse<T> {
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Error handling
class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
  }
}
```

### Edge Functions
```typescript
// Notification edge function
export default async function handler(req: Request) {
  const { type, userId, message } = await req.json();
  
  // Process notification
  await sendNotification(type, userId, message);
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
```

## 📊 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Responsive images with lazy loading
- **Caching Strategy**: Browser and CDN caching

### Database Optimization
- **Indexing Strategy**: Optimized queries with proper indexes
- **Query Optimization**: Efficient SQL with minimal N+1 queries
- **Connection Pooling**: Efficient database connection management
- **Data Pagination**: Large dataset handling

### Monitoring & Analytics
- **Performance Metrics**: Core web vitals tracking
- **Error Monitoring**: Real-time error reporting
- **Usage Analytics**: Feature usage tracking
- **Database Monitoring**: Query performance analysis

## 🚀 Deployment Architecture

### Production Environment
```yaml
# Docker configuration
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration
- **Production**: Optimized build with monitoring
- **Staging**: Feature testing environment
- **Development**: Local development setup

### CI/CD Pipeline
1. **Code Push**: Trigger automated pipeline
2. **Testing**: Run unit and integration tests
3. **Build**: Create production-ready bundle
4. **Deploy**: Deploy to production environment
5. **Monitor**: Track deployment health

## 🔍 Testing Strategy

### Test Types
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database interaction testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

### Testing Tools
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **Lighthouse**: Performance auditing
