
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CounselingAlert = Tables<'counseling_alerts'>;

export const useCounselingAlerts = () => {
  return useQuery({
    queryKey: ['counseling_alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counseling_alerts')
        .select(`
          *,
          student:students(*),
          triggered_by_record:behavior_records(*),
          resolved_by_profile:profiles!resolved_by(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUnresolvedCounselingAlerts = () => {
  return useQuery({
    queryKey: ['counseling_alerts', 'unresolved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counseling_alerts')
        .select(`
          *,
          student:students(*)
        `)
        .eq('is_resolved', false)
        .order('severity_level', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useResolveCounselingAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ alertId, resolvedBy }: { alertId: string; resolvedBy: string }) => {
      const { error } = await supabase
        .from('counseling_alerts')
        .update({
          is_resolved: true,
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counseling_alerts'] });
    },
  });
};

export const useCreateCounselingAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alert: TablesInsert<'counseling_alerts'>) => {
      const { data, error } = await supabase
        .from('counseling_alerts')
        .insert(alert)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counseling_alerts'] });
    },
  });
};
