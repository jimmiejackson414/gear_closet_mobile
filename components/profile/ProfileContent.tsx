import { useState } from 'react';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon, SaveIcon } from 'lucide-react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator, AnimatedFAB, Text } from 'react-native-paper';
import { toast } from 'sonner-native';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import UserAvatar from '@/components/common/UserAvatar';
import { friendlyUsername, makeStyles } from '@/helpers';
import { useErrorHandling, useLoading } from '@/hooks';
import { useProfile, useUpdateProfileMutation } from '@/services/profile';
import type { NativeScrollEvent } from 'react-native';

const profileSchema = z.object({
  first_name: z.string()
    .min(1, 'First name is required'),
  last_name: z.string()
    .min(1, 'Last name is required'),
  trail_name: z.string(),
  email: z.string()
    .email('Please enter a valid email address'),
});

const ProfileContent = () => {
  const {
    data, error, isLoading,
  } = useProfile();
  useErrorHandling(error, 'Failed to fetch profile data');
  useLoading(isLoading);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
      trail_name: data?.trail_name || '',
      email: data?.email || '',
    },
  });
  const { control, handleSubmit } = form;

  const [isExtended, setIsExtended] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fabLabel, setFabLabel] = useState('Edit Profile');

  const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const updateProfileMutation = useUpdateProfileMutation();
  const handleSaveProfile = async () => {
    const values = form.getValues();
    await updateProfileMutation.mutateAsync(values);
  };

  const handleFabPress = async () => {
    if (isEditing) {
      setIsSaving(true);
      setFabLabel('Saving...');
      await handleSubmit(handleSaveProfile)();
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
        <View style={styles.formWrapper}>
          <FormProvider {...form}>
            <FormInput
              autoComplete="first_name"
              control={control}
              disabled={isSaving || !isEditing}
              label="First Name"
              name="first_name"  />
            <FormInput
              autoComplete="last_name"
              control={control}
              disabled={isSaving || !isEditing}
              label="Last Name"
              name="last_name"  />
            <FormInput
              autoComplete="trail_name"
              control={control}
              disabled={isSaving || !isEditing}
              label="Trail Name"
              name="trail_name"  />
          </FormProvider>
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
  formWrapper: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 24,
  },
  wrapper: {
    height: '100%',
    alignItems: 'center',
    position: 'relative',
  },
}));

export default ProfileContent;