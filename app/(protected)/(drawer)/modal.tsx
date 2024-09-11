import { StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { Box, Button, ButtonIcon, Text } from '@/components/ui';

const NotificationsModal = () => {
  const navigation = useNavigation();

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
      <Text>Notifications</Text>
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
});

export default NotificationsModal;