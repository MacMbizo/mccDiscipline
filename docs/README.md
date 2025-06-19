
# Midlands Christian College Discipline Tracker

A comprehensive behavior management system designed specifically for Midlands Christian College to track student discipline records, merit awards, and behavioral analytics.

## 🎯 Project Overview

The MCC Discipline Tracker is a modern web application built to streamline the management of student behavior records, providing real-time insights and automated reporting for teachers, administrators, parents, and students.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend services)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd mcc-discipline-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
The application uses Supabase for backend services. No local environment variables are needed as the configuration is handled through Supabase integration.

## 📋 Features Overview

### Core Functionality
- **Multi-Role Dashboard System** - Role-based access for Admin, Teacher, Student, Parent, Shadow Parent, and Counselor
- **Behavior Recording** - Log disciplinary incidents and merit awards
- **Heat Score System** - Visual behavior scoring with color-coded indicators
- **Real-time Analytics** - Comprehensive reporting and trend analysis
- **Notification System** - Automated alerts via email, SMS, and push notifications
- **Shadow Parent System** - Secondary parent oversight functionality
- **Counseling Alerts** - Automated flagging for intervention needs

### User Roles & Permissions
- **Admin**: Full system access, user management, configuration
- **Teacher**: Record incidents/merits, view class analytics
- **Student**: View personal records and progress
- **Parent**: Monitor child's behavior and receive notifications
- **Shadow Parent**: Oversight of assigned students
- **Counselor**: Access to counseling alerts and intervention tools

## 📚 Documentation Structure

- [Features Documentation](./FEATURES.md) - Detailed feature descriptions
- [Technical Documentation](./TECHNICAL.md) - Architecture and implementation details
- [User Guide](./USER_GUIDE.md) - End-user documentation
- [Admin Guide](./ADMIN_GUIDE.md) - Administrator manual
- [API Documentation](./API.md) - Backend API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- [Development Setup](./DEVELOPMENT.md) - Developer onboarding

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: TanStack Query, React Context
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Notifications**: Sonner

## 📞 Support

For technical support or questions, please refer to the [User Guide](./USER_GUIDE.md) or contact the development team.

## 📄 License

© 2025 Midlands Christian College. All rights reserved.
