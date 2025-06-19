
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/auth/LoginScreen';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ParentDashboard from '@/components/dashboard/ParentDashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  // Route based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <LoginScreen />;
  }
};

export default Index;
