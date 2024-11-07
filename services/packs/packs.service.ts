import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase';
import type { TablesUpdate } from '@/types';
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

/**
 * Fetches a single pack by id
 * @param packId
 * @returns ExtendedPack
 */
export const fetchPack = async (packId: number) => {
  try {
    const { data, error } = await supabase
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
      .eq('id', packId)
      .single();

    if (error || !data) throw new Error(error?.message || 'Pack not found');

    return data;
  } catch (error) {
    toast.error('Failed to fetch pack');
    return null;
  }
};

/**
 * Updates the pack with the given id
 * @param packId
 * @param pack
 * @returns ExtendedPack
 */
export const updatePack = async (pack: TablesUpdate<'packs'>) => {
  if (!pack.id) throw new Error('Pack id is required');
  try {
    const { data, error } = await supabase
      .from('packs')
      .update(pack)
      .eq('id', pack.id)
      .select();

    if (error || !data) throw new Error(error?.message || 'Failed to update pack');

    const updatedPack = await fetchPack(pack.id);
    if (!updatedPack) throw new Error('Failed to fetch updated pack');

    return updatedPack;
  } catch (error) {
    toast.error('Failed to update pack');
    return null;
  }
};