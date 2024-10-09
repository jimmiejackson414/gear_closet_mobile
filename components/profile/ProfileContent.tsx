import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon, SaveIcon } from 'lucide-react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator, AnimatedFAB, Text } from 'react-native-paper';
import { toast } from 'sonner-native';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import FormPicker from '@/components/common/FormPicker';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import UserAvatar from '@/components/common/UserAvatar';
import { friendlyUsername, makeStyles } from '@/helpers';
import { useErrorHandling, useLoading } from '@/hooks';
import { useProfile, useUpdateProfileMutation } from '@/services/profile';
import { MeasuringSystem } from '@/types';
import type { NativeScrollEvent } from 'react-native';

const profileSchema = z.object({
  first_name: z.string()
    .min(1, 'First name is required'),
  last_name: z.string()
    .min(1, 'Last name is required'),
  trail_name: z.string(),
  email: z.string()
    .email('Please enter a valid email address'),
  measuring_system: z.enum([MeasuringSystem.IMPERIAL, MeasuringSystem.METRIC]),
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
      measuring_system: data?.measuring_system || MeasuringSystem.IMPERIAL,
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

  const openAvatarSheet = () => {
    // TODO: Implement bottom sheet with options of "Take new photo", "Select photo", "View in full screen"
    console.log('Avatar sheet opened');
  };

  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ScreenWrapper onScroll={onScroll}>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <TouchableOpacity onPress={openAvatarSheet}>
              <UserAvatar
                includeSubscriptionBadge
                profile={data}
                size={128} />
            </TouchableOpacity>
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
                autoComplete="given-name"
                control={control}
                disabled={isSaving || !isEditing}
                label="First Name"
                name="first_name"  />
              <FormInput
                autoComplete="family-name"
                control={control}
                disabled={isSaving || !isEditing}
                label="Last Name"
                name="last_name"  />
              <FormInput
                autoComplete="nickname"
                control={control}
                disabled={isSaving || !isEditing}
                label="Trail Name"
                name="trail_name"  />
              <FormInput
                autoComplete="email"
                control={control}
                disabled={isSaving || !isEditing}
                label="Email"
                name="email"  />
              <FormPicker
                control={control}
                disabled={isSaving || !isEditing}
                label="Preferred measuring system"
                name="measuring_system"
                onValueChange={value => console.log('Selected value: ', value)}
                options={[
                  { label: 'Imperial (lb, oz)', value: MeasuringSystem.IMPERIAL },
                  { label: 'Metric (kg, g)', value: MeasuringSystem.METRIC },
                ]} />
            </FormProvider>
          </View>
        </View>
      </ScreenWrapper>
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
  );
};
  
const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fabStyle: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  formWrapper: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 24,
  },
  wrapper: {
    height: '100%',
    alignItems: 'center',
    paddingBottom: 64,
  },
}));

export default ProfileContent;