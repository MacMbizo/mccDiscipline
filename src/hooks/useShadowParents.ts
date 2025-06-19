
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type ShadowParentAssignment = Tables<'shadow_parent_assignments'>;
export type ShadowParentDashboard = Tables<'shadow_parent_dashboard'>;

export const useShadowParentAssignments = () => {
  return useQuery({
    queryKey: ['shadow_parent_assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shadow_parent_assignments')
        .select(`
          *,
          shadow_parent:profiles!shadow_parent_id(*),
          student:students(*)
        `)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useShadowParentDashboard = (shadowParentId: string) => {
  return useQuery({
    queryKey: ['shadow_parent_dashboard', shadowParentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shadow_parent_dashboard')
        .select('*')
        .eq('shadow_parent_id', shadowParentId);
      
      if (error) throw error;
      return data as ShadowParentDashboard[];
    },
    enabled: !!shadowParentId,
  });
};

export const useCreateShadowParentAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignment: TablesInsert<'shadow_parent_assignments'>) => {
      const { data, error } = await supabase
        .from('shadow_parent_assignments')
        .insert(assignment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shadow_parent_assignments'] });
      queryClient.invalidateQueries({ queryKey: ['shadow_parent_dashboard'] });
    },
  });
};

export const useRemoveShadowParentAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('shadow_parent_assignments')
        .update({ is_active: false })
        .eq('id', assignmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shadow_parent_assignments'] });
      queryClient.invalidateQueries({ queryKey: ['shadow_parent_dashboard'] });
    },
  });
};
