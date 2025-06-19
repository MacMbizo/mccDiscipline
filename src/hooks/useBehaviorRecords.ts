
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type BehaviorRecord = Tables<'behavior_records'>;
export type BehaviorRecordInsert = TablesInsert<'behavior_records'>;

export const useBehaviorRecords = (studentId?: string) => {
  return useQuery({
    queryKey: ['behavior_records', studentId],
    queryFn: async () => {
      let query = supabase
        .from('behavior_records')
        .select(`
          *,
          student:students(*),
          misdemeanor:misdemeanors(*),
          reporter:profiles(*)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching behavior records:', error);
        return [];
      }
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBehaviorRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: BehaviorRecordInsert) => {
      const { data, error } = await supabase
        .from('behavior_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['behavior_records'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
