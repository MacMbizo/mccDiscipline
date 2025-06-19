
-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  behavior_score DECIMAL(3,1) DEFAULT 0.0,
  profile_image TEXT,
  parent_contacts JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create misdemeanors table
CREATE TABLE public.misdemeanors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL CHECK (location IN ('Main School', 'Hostel')),
  name TEXT NOT NULL,
  sanctions JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  category TEXT,
  severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create behavior_records table (for both incidents and merits)
CREATE TABLE public.behavior_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('incident', 'merit')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Incident-specific fields
  location TEXT,
  misdemeanor_id UUID REFERENCES public.misdemeanors(id),
  offense_number INTEGER,
  sanction TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  
  -- Merit-specific fields
  merit_tier TEXT CHECK (merit_tier IN ('Bronze', 'Silver', 'Gold', 'Diamond', 'Platinum')),
  points DECIMAL(3,1),
  
  -- Common fields
  description TEXT NOT NULL,
  reported_by UUID REFERENCES public.profiles(id) NOT NULL,
  attachment_url TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  ip_address INET,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misdemeanors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "Teachers and admins can view all students" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Students can view their own record" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'student'
      AND profiles.name = students.name
    )
  );

CREATE POLICY "Parents can view their children" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'parent'
    )
  );

CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for behavior_records
CREATE POLICY "Teachers and admins can view all records" ON public.behavior_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can create records" ON public.behavior_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Students can view their own records" ON public.behavior_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.students s ON p.name = s.name
      WHERE p.id = auth.uid() 
      AND p.role = 'student'
      AND s.id = behavior_records.student_id
    )
  );

-- RLS Policies for misdemeanors
CREATE POLICY "All authenticated users can view misdemeanors" ON public.misdemeanors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage misdemeanors" ON public.misdemeanors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert sample misdemeanors
INSERT INTO public.misdemeanors (location, name, sanctions, category, severity_level) VALUES
('Main School', 'Late to Class', '{"1st": "Verbal Warning", "2nd": "Detention", "3rd": "Parent Conference"}', 'Punctuality', 2),
('Main School', 'Uniform Violation', '{"1st": "Warning", "2nd": "Detention", "3rd": "Parent Contact"}', 'Dress Code', 1),
('Main School', 'Disrespectful Behavior', '{"1st": "Detention", "2nd": "Suspension (1 day)", "3rd": "Suspension (3 days)"}', 'Behavior', 4),
('Hostel', 'Room Inspection Failure', '{"1st": "Re-clean", "2nd": "Weekend Duty", "3rd": "Privileges Suspended"}', 'Maintenance', 2),
('Hostel', 'Curfew Violation', '{"1st": "Early Curfew", "2nd": "Weekend Restriction", "3rd": "Parent Conference"}', 'Rules', 3);

-- Insert sample students
INSERT INTO public.students (student_id, name, grade, behavior_score) VALUES
('S001', 'John Smith', 'Grade 10', 4.2),
('S002', 'Sarah Johnson', 'Grade 9', 2.8),
('S003', 'Michael Brown', 'Grade 11', 7.5),
('S004', 'Emily Chen', 'Grade 10', 5.2),
('S005', 'David Wilson', 'Grade 12', 3.1);

-- Function to calculate heat score
CREATE OR REPLACE FUNCTION calculate_heat_score(student_uuid UUID)
RETURNS DECIMAL(3,1)
LANGUAGE plpgsql
AS $$
DECLARE
  incident_score DECIMAL := 0;
  merit_score DECIMAL := 0;
  final_score DECIMAL;
BEGIN
  -- Calculate incident score (higher offense numbers = more points)
  SELECT COALESCE(SUM(
    CASE offense_number 
      WHEN 1 THEN 1.0
      WHEN 2 THEN 2.0
      WHEN 3 THEN 3.0
      ELSE 4.0
    END
  ), 0) INTO incident_score
  FROM public.behavior_records
  WHERE student_id = student_uuid AND type = 'incident'
  AND created_at >= NOW() - INTERVAL '6 months';
  
  -- Calculate merit score (deduct points based on tier)
  SELECT COALESCE(SUM(points), 0) INTO merit_score
  FROM public.behavior_records
  WHERE student_id = student_uuid AND type = 'merit'
  AND created_at >= NOW() - INTERVAL '6 months';
  
  -- Calculate final score (incidents add, merits subtract)
  final_score := GREATEST(0, incident_score - (merit_score * 0.5));
  
  RETURN LEAST(10.0, final_score);
END;
$$;

-- Trigger to update student heat score
CREATE OR REPLACE FUNCTION update_student_heat_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.students 
  SET behavior_score = calculate_heat_score(COALESCE(NEW.student_id, OLD.student_id)),
      updated_at = NOW()
  WHERE id = COALESCE(NEW.student_id, OLD.student_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_heat_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.behavior_records
  FOR EACH ROW EXECUTE FUNCTION update_student_heat_score();
