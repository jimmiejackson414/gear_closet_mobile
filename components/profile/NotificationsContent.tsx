import { View } from 'react-native';
import { toast } from 'sonner-native';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Checkbox, Large } from '@/components/ui';
import { makeStyles } from '@/helpers';
import { useErrorHandling, useLoading } from '@/hooks';
import { useProfile, useUpdatePreferenceMutation } from '@/services/profile';
import { PreferenceGroup } from '@/types';
import type { Tables } from '@/types';

const NotificationsContent = () => {
  const {
    data, error, isLoading,
  } = useProfile();
  useErrorHandling(error, 'Failed to fetch profile data');
  useLoading(isLoading);

  const updatePreferenceMutation = useUpdatePreferenceMutation();
  const handlePress = async (preference: Tables<'preferences'>) => {
    try {
      await updatePreferenceMutation.mutateAsync({
        id: preference.id,
        preference_value: !preference.preference_value,
      });
      toast.success('Preference updated');
    } catch (error) {
      toast.error('Failed to update preference');
    }
  };

  const pushGroup = data?.preferences.filter(p => p.preference_group === PreferenceGroup.PUSH);
  const emailGroup = data?.preferences.filter(p => p.preference_group === PreferenceGroup.EMAIL);

  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ScreenWrapper>
        <View style={styles.group}>
          <Large style={styles.header}>
            Push Notifications
          </Large>
          {pushGroup?.map(preference => (
            <Checkbox
              checked={preference.preference_value}
              key={preference.id}
              label={preference.preference_label}
              onCheckedChange={() => handlePress(preference)} />
          ))}
        </View>
        <View style={styles.group}>
          <Large style={styles.header}>
            Email Notifications
          </Large>
          {emailGroup?.map(preference => (
            <Checkbox
              checked={preference.preference_value}
              key={preference.id}
              label={preference.preference_label}
              onCheckedChange={() => handlePress(preference)} />
          ))}
        </View>
      </ScreenWrapper>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  fabStyle: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  header: { fontWeight: 'bold' },
  group: { marginBottom: 32, gap: 16 },
}));

export default NotificationsContent;