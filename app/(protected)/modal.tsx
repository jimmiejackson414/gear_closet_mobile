import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import { Button, Dot, H4, P, Separator, Small } from '@/components/ui';
import { makeStyles } from '@/helpers';
import { XIcon } from '@/lib/icons';
import { useReadNotifications } from '@/services/profile';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

const NotificationsModal = () => {
  const navigation = useNavigation();
  const { data: readNotifications = [] } = useReadNotifications();
  const { data: unreadNotifications = [] } = useReadNotifications();

  const styles = useStyles();
  return (
    <View style={styles.modal}>
      <Button
        className="absolute right-4 top-4"
        onPress={() => navigation.goBack()}
        variant="ghost">
        <XIcon />
      </Button>
      <H4 style={{ fontWeight: 'bold' }}>
        {`Notifications (${unreadNotifications.length})`}
      </H4>
      <Separator className="my-4" />
      {unreadNotifications.map(notification => (
        <View
          key={notification.id}
          style={styles.notification}>
          <Dot
            style={styles.notificationDot}
            variant="destructive" />
          <P className="font-bold">
            {notification.title}
          </P>
          <P>
            {notification.content}
          </P>
          <Small className="mt-4">
            {dayjs()
              .to(dayjs(notification.created_at))}
          </Small>
          <Separator className="my-4" />
        </View>
      ))}
      {readNotifications.map(notification => (
        <View
          key={notification.id}
          style={styles.notification}>
          <P className="font-bold">
            {notification.title}
          </P>
          <P>
            {notification.content}
          </P>
          <Small className="mt-4">
            {dayjs()
              .to(dayjs(notification.created_at))}
          </Small>
          <Separator className="my-4" />
        </View>
      ))}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  modal: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  notification: { position: 'relative' },
  notificationDot: {
    position: 'absolute',
    top: 8,
    left: -16,
    backgroundColor: theme.destructive,
  },
}));

export default NotificationsModal;