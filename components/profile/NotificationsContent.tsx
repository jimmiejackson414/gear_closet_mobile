import { View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { makeStyles } from '@/helpers';
import { useAppTheme, useErrorHandling, useLoading } from '@/hooks';
import { useProfile } from '@/services/profile';
import { PreferenceGroup } from '@/types';
import type { Tables } from '@/types';

const NotificationsContent = () => {
  const {
    data, error, isLoading,
  } = useProfile();
  useErrorHandling(error, 'Failed to fetch profile data');
  useLoading(isLoading);

  const pushGroup = data?.preferences.filter(p => p.preference_group === PreferenceGroup.PUSH);
  const emailGroup = data?.preferences.filter(p => p.preference_group === PreferenceGroup.EMAIL);

  const handlePress = async (preference: Tables<'preferences'>) => {
    // TODO: react-query optimistic update
    console.log('optimistic update', preference);

    // update the preference in supabase
    console.log('preference update');
  };

  const theme = useAppTheme();
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
  header: { fontWeight: 'bold' },
  group: { marginBottom: 32 },
}));

export default NotificationsContent;