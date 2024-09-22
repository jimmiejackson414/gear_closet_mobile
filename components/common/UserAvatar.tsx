/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef } from 'react';
import { Avatar } from 'react-native-paper';
import { buildImageSrc, initials } from '@/helpers';
import type { Tables } from '@/types';
import type { ExtendedUser } from '@/types/helpers';

interface Props {
  profile: ExtendedUser | Tables<'profiles'>;
  size?: number;
}

const UserAvatar = forwardRef<any, Props>(({ profile, size = 64 }, _ref) => {
  const avatarSrc = buildImageSrc(profile?.image);

  if (avatarSrc) {
    return (
      <Avatar.Image
        size={size}
        source={{ uri: avatarSrc }} />
    );
  }

  return (
    <Avatar.Text
      label={initials(profile)}
      size={size} />
  );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;