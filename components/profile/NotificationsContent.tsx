import { View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { toast } from 'sonner-native';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { makeStyles } from '@/helpers';
import { useAppTheme, useErrorHandling, useLoading } from '@/hooks';
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

  const { theme } = useAppTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ScreenWrapper>
        <View style={styles.group}>
          <Text
            style={styles.header}
            variant="titleMedium">
            Push Notifications
          </Text>
          {pushGroup?.map(preference => (
            <Checkbox.Item
              color={theme.colors.tertiary}
              key={preference.id}
              label={preference.preference_label}
              labelStyle={{ textAlign: 'left', marginLeft: 8 }}
              mode="android"
              onPress={() => handlePress(preference)}
              position="leading"
              status={preference.preference_value ? 'checked' : 'unchecked'} />
          ))}
        </View>
        <View style={styles.group}>
          <Text
            style={styles.header}
            variant="titleMedium">
            Email Notifications
          </Text>
          {emailGroup?.map(preference => (
            <Checkbox.Item
              key={preference.id}
              label={preference.preference_label}
              labelStyle={{ textAlign: 'left', marginLeft: 8 }}
              mode="android"
              onPress={() => handlePress(preference)}
              position="leading"
              status={preference.preference_value ? 'checked' : 'unchecked'} />
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
  group: { marginBottom: 32 },
}));

export default NotificationsContent;