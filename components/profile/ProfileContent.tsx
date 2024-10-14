import { useState } from 'react';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { EditIcon, SaveIcon, XIcon } from 'lucide-react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator, AnimatedFAB, Divider, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { toast } from 'sonner-native';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import FormPicker from '@/components/common/FormPicker';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import UserAvatar from '@/components/common/UserAvatar';
import { friendlyUsername, makeStyles } from '@/helpers';
import { useErrorHandling, useLoading } from '@/hooks';
import { useProfile, useUpdateAvatarMutation, useUpdateProfileMutation } from '@/services/profile';
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
  country: z.string(),
  new_password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
  password_confirm: z.string()
    .min(6, 'Password must be at least 6 characters.'),
})
  .refine(data => data.new_password === data.password_confirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
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
    try {
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
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getFabIcon = () => {
    if (isSaving) return ActivityIndicator;
    return isEditing ? SaveIcon : EditIcon;
  };

  // Image picker
  const updateAvatarMutation = useUpdateAvatarMutation();
  const [isAvatarFullscreen, setIsAvatarFullscreen] = useState(false);
  const pickImage = async () => {
    try {
      const { status: mediaLibraryStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (mediaLibraryStatus !== 'granted') {
        const { status: requestStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (requestStatus !== 'granted') {
          Alert.alert(
            'Media Library Permission',
            'Media library permission is required to select photos. Please enable it in the app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: .5,
      });

      if (!result.canceled) {
        setIsSaving(true);
        const asset = result.assets[0];

        try {
          await updateAvatarMutation.mutateAsync(asset);
          toast.success('Avatar updated successfully!');
        } catch (error: any) {
          toast.error(error.message || 'Failed to update avatar.');
        } finally {
          setIsSaving(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to pick image.');
      setIsSaving(false);
    }
  };

  // Image taker
  const takeImage = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();

      if (cameraStatus !== 'granted') {
        const { status: requestStatus } = await ImagePicker.requestCameraPermissionsAsync();

        if (requestStatus !== 'granted') {
          Alert.alert(
            'Camera Permission',
            'Camera permission is required to take photos. Please enable it in the app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: .5,
      });

      if (!result.canceled) {
        setIsSaving(true);
        const asset = result.assets[0];

        try {
          await updateAvatarMutation.mutateAsync(asset);
          toast.success('Avatar updated successfully!');
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message || 'Failed to update avatar.');
          } else {
            toast.error('Failed to update avatar.');
          }
        } finally {
          setIsSaving(false);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to take image.');
      } else {
        toast.error('Failed to take image.');
      }
      setIsSaving(false);
    }
  };

  // Avatar action sheet
  const { showActionSheetWithOptions } = useActionSheet();
  const openAvatarSheet = () => {
    if (isSaving || isLoading) return;

    const options = ['Take new photo', 'Select photo', 'View in full screen', 'Cancel'];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    }, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          takeImage();
          break;
        case 1:
          pickImage();
          break;
        case 2:
          setIsAvatarFullscreen(true);
          break;
        case cancelButtonIndex:
          // Cancelled and closed ActionSheet
          break;
        default:
          break;
      }
    });
  };

  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ScreenWrapper onScroll={onScroll}>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <TouchableOpacity onPress={openAvatarSheet}>
              <UserAvatar
                disabled={isLoading || isSaving}
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
                disabled={isSaving || !isEditing || isLoading}
                label="First Name"
                name="first_name"  />
              <FormInput
                autoComplete="family-name"
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="Last Name"
                name="last_name"  />
              <FormInput
                autoComplete="nickname"
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="Trail Name"
                name="trail_name"  />
              <FormInput
                autoComplete="email"
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="Email"
                name="email"  />
              <FormPicker
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="Preferred measuring system"
                name="measuring_system"
                onValueChange={value => console.log('Selected value: ', value)}
                options={[
                  { label: 'Imperial (lb, oz)', value: MeasuringSystem.IMPERIAL },
                  { label: 'Metric (kg, g)', value: MeasuringSystem.METRIC },
                ]} />
              <FormInput
                autoComplete="postal-address-country"
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="Country"
                name="country"  />
              <Divider style={{ marginBottom: 16 }} />
              <FormInput
                autoComplete="new-password"
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="New Password"
                name="new_password"
                secureTextEntry />
              <FormInput
                control={control}
                disabled={isSaving || !isEditing || isLoading}
                label="Confirm Password"
                name="confirm_password"
                secureTextEntry />
            </FormProvider>
          </View>
        </View>
      </ScreenWrapper>

      {/* Edit FAB Button */}
      <AnimatedFAB
        animateFrom='right'
        disabled={isSaving || isLoading}
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

      {/* Avatar Fullscreen Modal */}
      <Portal>
        {isAvatarFullscreen && (
          <View style={styles.portalBackground}>
            <Modal
              contentContainerStyle={styles.modalContainer}
              onDismiss={() => setIsAvatarFullscreen(false)}
              visible={isAvatarFullscreen}>
              <TouchableOpacity
                onPress={() => setIsAvatarFullscreen(false)}
                style={styles.modalCloseButton}>
                <IconButton icon={({ size }) => (
                  <XIcon
                    color="white"
                    size={size} />
                )} />
              </TouchableOpacity>
              <View style={styles.avatarContainer}>
                <UserAvatar
                  profile={data}
                  size={250} />
              </View>
            </Modal>
          </View>
        )}
      </Portal>
    </View>
  );
};
  
const useStyles = makeStyles(() => ({
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  portalBackground: {
    flex: 1,
    backgroundColor: 'black',
  },
  wrapper: {
    height: '100%',
    alignItems: 'center',
    paddingBottom: 64,
  },
}));

export default ProfileContent;