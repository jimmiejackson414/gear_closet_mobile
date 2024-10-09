import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Icon } from 'react-native-paper';
import GcIcon from '@/assets/gear-closet-icon.svg';
import { buildImageSrc, initials, makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import { SubscriptionLevel, type Tables } from '@/types';
import type { AppTheme } from '@/hooks/useAppTheme';
import type { ExtendedProfile } from '@/types/helpers';

interface Props {
  includeSubscriptionBadge?: boolean;
  profile?: ExtendedProfile | Tables<'profiles'> | null;
  size?: number;
}

const hasSubscriptionData = (profile: any): profile is ExtendedProfile => {
  return profile && 'subscriptions' in profile;
};

const getBadgeColor = (subscription: SubscriptionLevel, theme: AppTheme) => {
  switch (subscription) {
    case SubscriptionLevel.FREE:
      return { background: theme.colors.quarternaryContainer, color: theme.colors.onQuarternary };
    case SubscriptionLevel.MONTHLY:
      return { background: theme.colors.tertiaryContainer, color: theme.colors.onSurface };
    case SubscriptionLevel.ANNUAL, SubscriptionLevel.LIFE:
      return { background: theme.colors.primaryContainer, color: theme.colors.onPrimary };
    default:
      return { background: theme.colors.primary, color: theme.colors.onPrimary };
  }
};

const UserAvatar = forwardRef<any, Props>(({
  includeSubscriptionBadge = false, profile, size = 64,
}, _ref) => {
  const styles = useStyles();
  const theme = useAppTheme();

  const renderAvatar = () => {
    if (!profile) {
      return (
        <Avatar.Icon
          icon={({ size }) => <Icon
            size={size}
            source={() => <GcIcon />} />}
          size={size} />
      );
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
  };

  const subscription = hasSubscriptionData(profile)
    ? profile.subscriptions[0].prices.identifier as SubscriptionLevel ?? SubscriptionLevel.FREE
    : SubscriptionLevel.FREE;
  const badgeColors = getBadgeColor(subscription, theme);

  return (
    <View style={styles.container}>
      {renderAvatar()}
      {includeSubscriptionBadge && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.badgeContainer}>
            <Badge
              size={30}
              style={[
                styles.badge,{
                  backgroundColor: badgeColors.background,
                  color: badgeColors.color,
                },
              ]}
              visible={includeSubscriptionBadge}>
              {subscription.toLocaleUpperCase()}
            </Badge>
          </View>
        </View>
      )}
    </View>
  );
});
  
UserAvatar.displayName = 'UserAvatar';
  
const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  badgeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    marginBottom: -4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
}));

export default UserAvatar;