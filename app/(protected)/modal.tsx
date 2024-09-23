import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import { X } from 'lucide-react-native';
import { Badge, Divider, IconButton, Text } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import useAppStore from '@/stores/appStore';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

const NotificationsModal = () => {
  const navigation = useNavigation();
  const readNotifications = useAppStore(state => state.readNotifications());
  const unreadNotifications = useAppStore(state => state.unreadNotifications());

  const styles = useStyles();
  return (
    <View style={styles.modal}>
      <IconButton
        icon={({ size }) => <X size={size} />}
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.closeButton} />
      <Text style={{ fontWeight: 'bold' }}>
        {`Notifications (${unreadNotifications.length})`}
      </Text>
      <Divider style={{ marginVertical: 16 }} />
      {unreadNotifications.map(notification => (
        <View
          key={notification.id}
          style={styles.notification}>
          <Badge
            size={8}
            style={styles.notificationDot}
            visible={true} />
          <Text variant="bodyLarge">
            {notification.title}
          </Text>
          <Text>
            {notification.content}
          </Text>
          <Text variant="bodySmall">
            {dayjs()
              .to(dayjs(notification.created_at))}
          </Text>
          <Divider style={{ marginVertical: 16 }} />
        </View>
      ))}
      {readNotifications.map(notification => (
        <View
          key={notification.id}
          style={styles.notification}>
          <Text variant="bodyLarge">
            {notification.title}
          </Text>
          <Text>
            {notification.content}
          </Text>
          <Text variant="bodySmall">
            {dayjs()
              .to(dayjs(notification.created_at))}
          </Text>
          <Divider style={{ marginVertical: 16 }} />
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
    backgroundColor: theme.colors.error,
  },
}));

export default NotificationsModal;