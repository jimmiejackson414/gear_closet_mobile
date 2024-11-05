import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage, Badge, Text } from '@/components/ui';
import { buildImageSrc, friendlyUsername, initials, makeStyles } from '@/helpers';
import { BADGE_COLOR_MAP } from '@/lib/constants';
import { SubscriptionLevel, type Tables } from '@/types';
import type { ExtendedProfile } from '@/types/helpers';

interface Props {
  includeSubscriptionBadge?: boolean;
  disabled?: boolean;
  profile?: ExtendedProfile | Tables<'profiles'> | null;
  size?: string;
}

const hasSubscriptionData = (profile: any): profile is ExtendedProfile => {
  return profile && 'subscriptions' in profile;
};

const UserAvatar = forwardRef<any, Props>(({
  disabled, includeSubscriptionBadge = false, profile, size = '!size-16',
}, _ref) => {
  const styles = useStyles({ disabled });

  const subscription = hasSubscriptionData(profile)
    ? profile.subscriptions[0].prices.identifier as SubscriptionLevel ?? SubscriptionLevel.FREE
    : SubscriptionLevel.FREE;

  const avatarSrc = buildImageSrc(profile?.image);

  return (
    <View style={styles.container}>
      <Avatar
        alt={`${friendlyUsername(profile)} Avatar`}
        className={size}>
        <AvatarImage source={{ uri: avatarSrc }} />
        <AvatarFallback>
          <Text>
            {initials(profile)}
          </Text>
        </AvatarFallback>
      </Avatar>
      {includeSubscriptionBadge && (
        <View style={styles.badgeContainer}>
          <Badge
            style={styles.badge}
            variant={BADGE_COLOR_MAP[subscription] || BADGE_COLOR_MAP.DEFAULT}>
            <Text>
              {subscription.toLocaleUpperCase()}
            </Text>
          </Badge>
        </View>
      )}
    </View>
  );
});

UserAvatar.displayName = 'UserAvatar';

const useStyles = makeStyles((_theme, { disabled }) => ({
  container: {
    position: 'relative',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  },
  badgeContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
}));

export default UserAvatar;