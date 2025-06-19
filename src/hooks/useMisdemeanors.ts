
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Misdemeanor = Tables<'misdemeanors'>;

export const useMisdemeanors = () => {
  return useQuery({
    queryKey: ['misdemeanors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('misdemeanors')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data as Misdemeanor[];
    },
  });
};
