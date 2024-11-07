import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase';
import type { ExtendedPack } from '@/types/helpers';

/**
 * Fetches the packs of the current user
 * @returns ExtendedPack[]
 */
export const fetchPacks = async (): Promise<ExtendedPack[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: packs, error } = await supabase
      .from('packs')
      .select(
        `
        *,
        categories(*,
          category_items(*,
            item:item_id(*)
          )
        )
      `,
      )
      .eq('profile_id', user.id)
      .returns<ExtendedPack[] | undefined>();

    if (error || !packs?.length) throw new Error(error?.message || 'Packs not found');

    return packs;
  } catch (error) {
    toast.error('Failed to fetch packs');
    return [];
  }
};