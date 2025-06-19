
-- First, update any existing grade values to match the new format
UPDATE public.students 
SET grade = CASE 
  WHEN grade ILIKE '%1%' OR grade = '1' THEN 'Form 1'
  WHEN grade ILIKE '%2%' OR grade = '2' THEN 'Form 2'
  WHEN grade ILIKE '%3%' OR grade = '3' THEN 'Form 3'
  WHEN grade ILIKE '%4%' OR grade = '4' THEN 'Form 4'
  WHEN grade ILIKE '%5%' OR grade = '5' THEN 'Form 5'
  WHEN grade ILIKE '%6%' AND (grade ILIKE '%lower%' OR grade ILIKE '%l6%') THEN 'Lower 6'
  WHEN grade ILIKE '%6%' AND (grade ILIKE '%upper%' OR grade ILIKE '%u6%') THEN 'Upper 6'
  WHEN grade ILIKE '%6%' THEN 'Upper 6' -- Default Form 6 to Upper 6
  ELSE 'Form 1' -- Default fallback
END
WHERE grade NOT IN ('Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Lower 6', 'Upper 6');

-- Now add the other columns first
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female')),
ADD COLUMN IF NOT EXISTS boarding_status text CHECK (boarding_status IN ('boarder', 'day_scholar')) DEFAULT 'day_scholar',
ADD COLUMN IF NOT EXISTS shadow_parent_id uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS needs_counseling boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS counseling_flagged_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS counseling_reason text;

-- Now add the grade constraint
ALTER TABLE public.students 
ADD CONSTRAINT valid_grade CHECK (grade IN ('Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Lower 6', 'Upper 6'));

-- Create shadow parent assignments table for tracking relationships
CREATE TABLE IF NOT EXISTS public.shadow_parent_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shadow_parent_id uuid REFERENCES public.profiles(id) NOT NULL,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(student_id) -- Each student can only have one active shadow parent
);

-- Create counseling alerts table
CREATE TABLE IF NOT EXISTS public.counseling_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) NOT NULL,
  triggered_by_record_id uuid REFERENCES public.behavior_records(id),
  alert_type text NOT NULL, -- 'heat_score_threshold', 'repeat_offender', 'manual_flag'
  severity_level text DEFAULT 'medium' CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  description text,
  is_resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES public.profiles(id),
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.shadow_parent_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counseling_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for shadow parent assignments
CREATE POLICY "Users can view shadow parent assignments they're involved in"
  ON public.shadow_parent_assignments FOR SELECT
  USING (
    auth.uid() = shadow_parent_id OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'counselor'))
  );

CREATE POLICY "Admins can manage shadow parent assignments"
  ON public.shadow_parent_assignments FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- RLS policies for counseling alerts
CREATE POLICY "Counselors and admins can view all counseling alerts"
  ON public.counseling_alerts FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'counselor')));

CREATE POLICY "Counselors and admins can manage counseling alerts"
  ON public.counseling_alerts FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'counselor')));

-- Create function to automatically flag students for counseling based on behavior score
CREATE OR REPLACE FUNCTION public.check_counseling_threshold()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  current_score DECIMAL;
  recent_incidents INTEGER;
BEGIN
  -- Get current behavior score
  current_score := calculate_heat_score(NEW.student_id);
  
  -- Count recent incidents (last 30 days)
  SELECT COUNT(*) INTO recent_incidents
  FROM public.behavior_records
  WHERE student_id = NEW.student_id 
    AND type = 'incident'
    AND created_at >= NOW() - INTERVAL '30 days';
  
  -- Flag for counseling if:
  -- 1. Heat score >= 7.0 (concerning behavior)
  -- 2. 3+ incidents in last 30 days
  -- 3. Heat score >= 9.0 (critical intervention needed)
  IF (current_score >= 7.0 AND recent_incidents >= 3) OR current_score >= 9.0 THEN
    -- Update student counseling flag
    UPDATE public.students 
    SET needs_counseling = true,
        counseling_flagged_at = NOW(),
        counseling_reason = CASE 
          WHEN current_score >= 9.0 THEN 'Critical behavior score (' || current_score || ') requires immediate intervention'
          ELSE 'Concerning behavior pattern: Score ' || current_score || ' with ' || recent_incidents || ' recent incidents'
        END
    WHERE id = NEW.student_id AND needs_counseling = false;
    
    -- Create counseling alert if student wasn't already flagged
    IF FOUND THEN
      INSERT INTO public.counseling_alerts (
        student_id,
        triggered_by_record_id,
        alert_type,
        severity_level,
        description
      ) VALUES (
        NEW.student_id,
        NEW.id,
        CASE WHEN current_score >= 9.0 THEN 'heat_score_critical' ELSE 'heat_score_threshold' END,
        CASE WHEN current_score >= 9.0 THEN 'critical' ELSE 'high' END,
        CASE 
          WHEN current_score >= 9.0 THEN 'Student requires immediate counseling intervention (Score: ' || current_score || ')'
          ELSE 'Student flagged for counseling due to behavioral concerns (Score: ' || current_score || ', Recent incidents: ' || recent_incidents || ')'
        END
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to check counseling threshold after behavior record updates
DROP TRIGGER IF EXISTS check_counseling_after_behavior_record ON public.behavior_records;
CREATE TRIGGER check_counseling_after_behavior_record
  AFTER INSERT OR UPDATE ON public.behavior_records
  FOR EACH ROW
  WHEN (NEW.type = 'incident')
  EXECUTE FUNCTION public.check_counseling_threshold();

-- Create function to send notifications to shadow parents
CREATE OR REPLACE FUNCTION public.notify_shadow_parent()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  shadow_parent_id uuid;
  student_name text;
  notification_message text;
BEGIN
  -- Get shadow parent and student info
  SELECT s.name, spa.shadow_parent_id 
  INTO student_name, shadow_parent_id
  FROM public.students s
  LEFT JOIN public.shadow_parent_assignments spa ON s.id = spa.student_id AND spa.is_active = true
  WHERE s.id = NEW.student_id;
  
  -- Only send notification if shadow parent exists
  IF shadow_parent_id IS NOT NULL THEN
    -- Create notification message
    IF NEW.type = 'incident' THEN
      notification_message := 'Your shadow child ' || student_name || ' has received a disciplinary incident: ' || NEW.description;
    ELSIF NEW.type = 'merit' THEN
      notification_message := 'Your shadow child ' || student_name || ' has been awarded ' || NEW.merit_tier || ' merit points: ' || NEW.description;
    END IF;
    
    -- Insert notification
    INSERT INTO public.notifications (
      user_id,
      type,
      message,
      reference_id,
      reference_type
    ) VALUES (
      shadow_parent_id,
      CASE WHEN NEW.type = 'incident' THEN 'shadow_child_incident' ELSE 'shadow_child_merit' END,
      notification_message,
      NEW.id,
      'behavior_record'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to notify shadow parents
DROP TRIGGER IF EXISTS notify_shadow_parent_on_behavior_record ON public.behavior_records;
CREATE TRIGGER notify_shadow_parent_on_behavior_record
  AFTER INSERT ON public.behavior_records
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_shadow_parent();

-- Update profiles table to include shadow parent role (remove existing constraint first)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_role CHECK (role IN ('admin', 'teacher', 'student', 'parent', 'shadow_parent', 'counselor'));

-- Create view for shadow parent dashboard
CREATE OR REPLACE VIEW public.shadow_parent_dashboard AS
SELECT 
  spa.shadow_parent_id,
  s.id as student_id,
  s.name as student_name,
  s.grade,
  s.gender,
  s.boarding_status,
  s.behavior_score,
  s.needs_counseling,
  COUNT(CASE WHEN br.type = 'incident' AND br.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_incidents,
  COUNT(CASE WHEN br.type = 'merit' AND br.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_merits
FROM public.shadow_parent_assignments spa
JOIN public.students s ON spa.student_id = s.id
LEFT JOIN public.behavior_records br ON s.id = br.student_id
WHERE spa.is_active = true
GROUP BY spa.shadow_parent_id, s.id, s.name, s.grade, s.gender, s.boarding_status, s.behavior_score, s.needs_counseling;
