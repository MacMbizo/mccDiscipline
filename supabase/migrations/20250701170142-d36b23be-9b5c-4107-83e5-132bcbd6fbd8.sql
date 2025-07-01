
-- Add gender field to profiles table for teachers
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female'));

-- Update shadow_parent_assignments table to add assignment metadata
ALTER TABLE public.shadow_parent_assignments 
ADD COLUMN IF NOT EXISTS assigned_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS assignment_notes text,
ADD COLUMN IF NOT EXISTS priority_score integer DEFAULT 0;

-- Create function to get shadow parent assignment recommendations
CREATE OR REPLACE FUNCTION public.get_shadow_assignment_recommendations()
RETURNS TABLE (
  student_id uuid,
  student_name text,
  grade text,
  behavior_score numeric,
  recent_incidents bigint,
  recent_merits bigint,
  priority_score integer,
  needs_counseling boolean
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    s.id as student_id,
    s.name as student_name,
    s.grade,
    s.behavior_score,
    COUNT(CASE WHEN br.type = 'incident' AND br.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_incidents,
    COUNT(CASE WHEN br.type = 'merit' AND br.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_merits,
    -- Priority scoring: higher scores need more support
    (
      CASE WHEN s.behavior_score >= 7 THEN 50 ELSE 0 END +
      CASE WHEN s.needs_counseling THEN 30 ELSE 0 END +
      (COUNT(CASE WHEN br.type = 'incident' AND br.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) * 5) +
      CASE WHEN COUNT(CASE WHEN br.type = 'merit' AND br.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) = 0 THEN 20 ELSE 0 END
    )::integer as priority_score,
    s.needs_counseling
  FROM public.students s
  LEFT JOIN public.behavior_records br ON s.id = br.student_id
  LEFT JOIN public.shadow_parent_assignments spa ON s.id = spa.student_id AND spa.is_active = true
  WHERE spa.student_id IS NULL -- Only unassigned students
  GROUP BY s.id, s.name, s.grade, s.behavior_score, s.needs_counseling
  ORDER BY priority_score DESC, s.behavior_score DESC, s.name;
$$;

-- Create function to get teacher shadow assignment capacity
CREATE OR REPLACE FUNCTION public.get_teacher_shadow_capacity(teacher_id uuid)
RETURNS TABLE (
  assigned_count bigint,
  remaining_capacity integer,
  can_assign_more boolean
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COUNT(spa.student_id) as assigned_count,
    (5 - COUNT(spa.student_id)::integer) as remaining_capacity,
    COUNT(spa.student_id) < 5 as can_assign_more
  FROM public.shadow_parent_assignments spa
  WHERE spa.shadow_parent_id = teacher_id AND spa.is_active = true;
$$;

-- Create trigger to send notification when shadow child gets behavior record
CREATE OR REPLACE FUNCTION public.notify_shadow_parent_enhanced()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  shadow_parent_id uuid;
  shadow_parent_name text;
  shadow_parent_gender text;
  student_name text;
  notification_message text;
  relationship_term text;
BEGIN
  -- Get shadow parent info including gender
  SELECT 
    spa.shadow_parent_id, 
    p.name, 
    p.gender,
    s.name
  INTO shadow_parent_id, shadow_parent_name, shadow_parent_gender, student_name
  FROM public.students s
  LEFT JOIN public.shadow_parent_assignments spa ON s.id = spa.student_id AND spa.is_active = true
  LEFT JOIN public.profiles p ON spa.shadow_parent_id = p.id
  WHERE s.id = NEW.student_id;
  
  -- Only send notification if shadow parent exists
  IF shadow_parent_id IS NOT NULL THEN
    -- Determine relationship term based on gender
    relationship_term := CASE 
      WHEN shadow_parent_gender = 'male' THEN 'shadow son'
      WHEN shadow_parent_gender = 'female' THEN 'shadow daughter'
      ELSE 'shadow child'
    END;
    
    -- Create notification message
    IF NEW.type = 'incident' THEN
      notification_message := 'SHADOW ALERT: Your ' || relationship_term || ' ' || student_name || ' has received a disciplinary incident: ' || NEW.description;
    ELSIF NEW.type = 'merit' THEN
      notification_message := 'SHADOW UPDATE: Your ' || relationship_term || ' ' || student_name || ' has been awarded ' || NEW.merit_tier || ' merit points: ' || NEW.description;
    END IF;
    
    -- Insert notification with high priority for shadow alerts
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

-- Replace the existing trigger
DROP TRIGGER IF EXISTS notify_shadow_parent_on_behavior_record ON public.behavior_records;
CREATE TRIGGER notify_shadow_parent_enhanced_on_behavior_record
  AFTER INSERT ON public.behavior_records
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_shadow_parent_enhanced();

-- Add RLS policy for shadow assignment recommendations
CREATE POLICY "Admins and teachers can view shadow recommendations"
  ON public.students FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'teacher')
    )
  );
