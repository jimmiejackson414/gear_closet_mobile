import { useState } from 'react';
import { View } from 'react-native';
import { Card, Icon, IconButton, Menu, Modal, Portal, Text } from 'react-native-paper';
import PackChart from '@/components/common/PackChart';
import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles } from '@/helpers';
import type { ExtendedPack } from '@/types/helpers';

interface Props {
  data?: ExtendedPack;
}

const PackWidget: React.FC<Props> = ({ data }) => {
  const { theme } = useAppTheme();
  const styles = useStyles(theme);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isChangePackModalVisible, setIsChangePackModalVisible] = useState(false);
  const [isUpdateThemeModalVisible, setIsUpdateThemeModalVisible] = useState(false);

  const handleChangePackModal = () => {
    setIsMenuVisible(false);
    setIsChangePackModalVisible(true);
  };

  const handleChangePack = () => {
    console.log('Change Pack');
  };

  const handleUpdateThemeModal = () => {
    setIsMenuVisible(false);
    setIsUpdateThemeModalVisible(true);
  };

  const handleUpdateTheme = () => {
    console.log('Update Theme');
  };

  return (
    <View>
      <Card
        elevation={0}
        mode="elevated"
        style={styles.card}>
        <Card.Title
          left={() => (
            <Icon
              color={theme.colors.primary}
              size={24}
              source="calendar-check-outline" />
          )}
          leftStyle={{ marginRight: 0 }}
          right={() => (
            <Menu
              anchor={<IconButton
                icon="dots-vertical"
                onPress={() => setIsMenuVisible(true)} />}
              anchorPosition="bottom"
              onDismiss={() => setIsMenuVisible(false)}
              visible={isMenuVisible}>
              <Menu.Item
                onPress={handleChangePackModal}
                title="Change Pack" />
              <Menu.Item
                onPress={handleUpdateThemeModal}
                title="Update Theme Colors" />
            </Menu>
          )}
          title={
            <View style={{
              flexDirection: 'row',
              gap: 16,
              alignContent: 'center',
            }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
                variant="bodyLarge">
                Pack:
              </Text>
              <Text
                style={{ alignSelf: 'center' }}
                variant="bodyLarge">
                {data?.name || 'Unnamed Pack'}
              </Text>
            </View>
          }
          titleStyle={{ marginBottom: 0, justifyContent: 'center' }} />
        <Card.Content>
          <View>
            <PackChart pack={data} />
          </View>
        </Card.Content>
      </Card>

      {/* Change Pack Modal */}
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          onDismiss={() => setIsChangePackModalVisible(false)}
          visible={isChangePackModalVisible}>
          <Text>Change Pack Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>

      {/* Update Pack Theme Modal */}
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          onDismiss={() => setIsUpdateThemeModalVisible(false)}
          visible={isUpdateThemeModalVisible}>
          <Text>Update Pack Theme Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  card: { backgroundColor: theme.colors.onPrimary },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
}));

export default PackWidget;