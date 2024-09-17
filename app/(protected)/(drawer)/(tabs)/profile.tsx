import { useState } from 'react';
import { Edit } from 'lucide-react-native';
import { Text } from 'react-native-paper';
import { toast } from 'sonner-native';
// import { Avatar, AvatarFallbackText, AvatarImage, Box, ButtonSpinner, Fab, FabIcon, FabLabel, Text } from '@/components/ui';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useProfile } from '@/services/user/useProfile';
import { useErrorHandling, useLoading } from '@/hooks';
import { buildImageSrc, friendlyUsername, initials } from '@/helpers';
// import theme from '@/lib/theme';

const ProfileScreen = () => {
  const {
    data, error, isLoading,
  } = useProfile();

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch profile data');

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // const renderFabContent = () => {
  //   if (isSaving) return <ButtonSpinner color={theme.colors.gray[400]} />;
  //   else if (isEditing) return <FabLabel>Save</FabLabel>;
  //   else return <FabIcon
  //     as={Edit}
  //     stroke="white" />;
  // };

  const handleFabPress = () => {
    if (isEditing) {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }, 2000);
    } else {
      setIsEditing(true);
    }
  };
  return (
    <ScreenWrapper>
      <Text>Profile Screen</Text>
      {/* <Box className="h-full items-center">
        <Box className="flex flex-row gap-8 items-center">
          <Avatar size="2xl">
            <AvatarFallbackText>
              {initials(data)}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: buildImageSrc(data?.image) }} />
          </Avatar>
          <Box className="flex flex-col">
            <Text
              bold
              size="2xl">
              {friendlyUsername(data, { includeTrailName: false })}
            </Text>
            {data?.trail_name && (
              <Text size="lg">
                {data?.trail_name}
              </Text>
            )}
            {data?.country && (
              <Text
                italic
                size="lg">
                {data?.country}
              </Text>
            )}
          </Box>
        </Box>
        <Fab
          className="bg-primary-500 hover:bg-primary-600 active:bg-primary-600 transition-all ease-in-out duration-200"
          onPress={handleFabPress}
          placement="bottom right"
          size="lg">
          {renderFabContent()}
        </Fab>
      </Box> */}
    </ScreenWrapper>
  );
};

export default ProfileScreen;