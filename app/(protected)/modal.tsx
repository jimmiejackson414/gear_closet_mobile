import { StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import { X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { Box, Button, ButtonIcon, Divider, Text } from '@/components/ui';
import useAppStore from '@/stores/appStore';
import theme from '@/lib/theme';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

const NotificationsModal = () => {
  const navigation = useNavigation();
  const readNotifications = useAppStore((state) => state.readNotifications());
  const unreadNotifications = useAppStore((state) => state.unreadNotifications());

  return (
    <Box style={styles.modal}>
      <Button
        action="secondary"
        className="rounded-full p-3.5 w-12 h-12"
        onPress={() => navigation.goBack()}
        size="lg"
        style={styles.closeButton}
        variant="outline">
        <ButtonIcon
          as={X}
          size="lg" />
      </Button>
      <Text bold>
        Notifications (
        {unreadNotifications.length}
        )
      </Text>
      <Divider className="my-4" />
      {unreadNotifications.map((notification) => (
        <Box
          key={notification.id}
          style={styles.notification}>
          <Box
            className="absolute -left-4 top-2"
            style={{
              backgroundColor: theme.colors.red[500],
              borderRadius: 999,
              height: 6,
              width: 6,
            }}>
          </Box>
          <Text
            bold
            size="lg">
            {notification.title}
          </Text>
          <Text>
            {notification.content}
          </Text>
          <Text size="xs">
            {dayjs()
              .to(dayjs(notification.created_at))}
          </Text>
          <Divider className="my-4" />
        </Box>
      ))}
      {readNotifications.map((notification) => (
        <Box
          key={notification.id}
          style={styles.notification}>
          <Text size="lg">
            {notification.title}
          </Text>
          <Text>
            {notification.content}
          </Text>
          <Text size="xs">
            {dayjs()
              .to(dayjs(notification.created_at))}
          </Text>
          <Divider className="my-4" />
        </Box>
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
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
});

export default NotificationsModal;