import { Edit } from 'lucide-react-native';
import { Avatar, AvatarFallbackText, AvatarImage, Box, Fab, FabIcon, Text } from '@/components/ui';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useProfile } from '@/services/user/useProfile';
import { useErrorHandling, useLoading } from '@/hooks';
import { buildImageSrc, friendlyUsername, initials } from '@/helpers';

const ProfileScreen = () => {
  const {
    data, error, isLoading,
  } = useProfile();

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch profile data');

  return (
    <ScreenWrapper>
      <Box className="h-full items-center">
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
          placement="bottom right"
          size="lg">
          <FabIcon
            as={Edit}
            stroke="white" />
        </Fab>
      </Box>
    </ScreenWrapper>
  );
};

export default ProfileScreen;