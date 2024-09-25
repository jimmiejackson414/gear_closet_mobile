/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef } from 'react';
import { Avatar, Icon } from 'react-native-paper';
import GcIcon from '@/assets/gear-closet-icon.svg';
import { buildImageSrc, initials } from '@/helpers';
import type { Tables } from '@/types';
import type { ExtendedProfile } from '@/types/helpers';

interface Props {
  profile?: ExtendedProfile | Tables<'profiles'> | null;
  size?: number;
}

const UserAvatar = forwardRef<any, Props>(({ profile, size = 64 }, _ref) => {
  if (!profile) {
    return <Avatar.Icon
      icon={({ size }) => <Icon
        size={size}
        source={() => <GcIcon />} />}
      size={size} />;
  }

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