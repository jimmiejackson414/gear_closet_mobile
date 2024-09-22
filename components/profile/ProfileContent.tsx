import { useState } from 'react';
import { View } from 'react-native';
import { EditIcon, SaveIcon } from 'lucide-react-native';
import { ActivityIndicator, AnimatedFAB, Text } from 'react-native-paper';
import { toast } from 'sonner-native';
import { friendlyUsername, makeStyles } from '@/helpers';
import { useErrorHandling, useLoading } from '@/hooks';
import { useProfile } from '@/services/user/useProfile';
import ScreenWrapper from '../common/ScreenWrapper';
import UserAvatar from '../common/UserAvatar';
import type { NativeScrollEvent } from 'react-native';

const ProfileContent = () => {
  const {
    data, error, isLoading,
  } = useProfile();
  useErrorHandling(error, 'Failed to fetch profile data');
  useLoading(isLoading);

  const [isExtended, setIsExtended] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fabLabel, setFabLabel] = useState('Edit Profile');

  const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const handleFabPress = () => {
    if (isEditing) {
      setIsSaving(true);
      setFabLabel('Saving...');
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        setFabLabel('Edit Profile');
        toast.success('Profile updated successfully');
      }, 2000);
    } else {
      setIsEditing(true);
      setFabLabel('Save Profile');
    }
  };

  const getFabIcon = () => {
    if (isSaving) return ActivityIndicator;
    return isEditing ? SaveIcon : EditIcon;
  };

  const styles = useStyles();
  return (
    <ScreenWrapper onScroll={onScroll}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <UserAvatar
            profile={data}
            size={128} />
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              style={{ fontWeight: 'bold', textAlign: 'center' }}
              variant="displaySmall">
              {friendlyUsername(data, { includeTrailName: false })}
            </Text>
            {data?.trail_name && (
              <Text
                style={{ textAlign: 'center' }}
                variant="titleLarge">
                {data?.trail_name}
              </Text>
            )}
            {data?.country && (
              <Text
                style={{ fontStyle: 'italic', textAlign: 'center'  }}
                variant="bodyLarge">
                {data?.country}
              </Text>
            )}
          </View>
        </View>
        <AnimatedFAB
          animateFrom='right'
          disabled={isSaving}
          extended={isExtended}
          icon={({ color, size }) => {
            const IconComponent = getFabIcon();
            return <IconComponent
              color={color}
              size={size} />;
          }}
          iconMode="dynamic"
          label={fabLabel}
          onPress={handleFabPress}
          style={styles.fabStyle}
          visible={true} />
      </View>
    </ScreenWrapper>
  );
};
  
const useStyles = makeStyles(() => ({
  content: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  wrapper: {
    height: '100%',
    alignItems: 'center',
    position: 'relative',
  },
}));

export default ProfileContent;