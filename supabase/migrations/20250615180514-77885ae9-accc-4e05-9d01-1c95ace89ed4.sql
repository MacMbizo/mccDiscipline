
-- Add audit logging trigger for all major tables
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP || '_' || TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
      ELSE row_to_json(NEW)
    END,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers for key tables
CREATE TRIGGER audit_behavior_records
  AFTER INSERT OR UPDATE OR DELETE ON public.behavior_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_students
  AFTER INSERT OR UPDATE OR DELETE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Add notification preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{
  "email_incidents": true,
  "email_merits": true,
  "sms_incidents": false,
  "sms_merits": false,
  "push_incidents": true,
  "push_merits": true,
  "digest_frequency": "daily"
}'::jsonb;

-- Create notification delivery log table
CREATE TABLE IF NOT EXISTS public.notification_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE,
  delivery_method text NOT NULL, -- 'email', 'sms', 'push'
  delivery_status text NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered'
  delivery_attempt integer DEFAULT 1,
  error_message text,
  delivered_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.notification_delivery_log ENABLE ROW LEVEL SECURITY;

-- Create policies for notification delivery log (admin only)
CREATE POLICY "Admins can manage notification delivery logs"
ON public.notification_delivery_log
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create function to automatically update behavior scores after record changes
CREATE OR REPLACE FUNCTION public.update_student_heat_score()
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

-- Create trigger to update heat scores automatically
DROP TRIGGER IF EXISTS update_heat_score_trigger ON public.behavior_records;
CREATE TRIGGER update_heat_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.behavior_records
  FOR EACH ROW EXECUTE FUNCTION public.update_student_heat_score();
