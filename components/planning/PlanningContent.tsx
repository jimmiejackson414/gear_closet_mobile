import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';
import { Button, Divider, Menu, Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { makeStyles } from '@/helpers';
import { decrypt } from '@/helpers/encryption';
import { useAppTheme, useErrorHandling, useLoading } from '@/hooks';
import { usePlanningQuery } from '@/services/planning';

const PlanningContent = () => {
  const [tripId, setTripId] = useState(0);
  const { trip } = useLocalSearchParams();
  const {
    data, error, isLoading,
  } = usePlanningQuery(tripId);
  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch planning data');

  useEffect(() => {
    const initializeTripId = async () => {
      let identifier = 0;

      if (trip) {
        identifier = Number(decrypt(trip as string)) || 0;
      } else {
        const encryptedTripId = await AsyncStorage.getItem('selectedTripId');
        if (encryptedTripId) {
          identifier = Number(decrypt(encryptedTripId)) || 0;
        }
      }
      setTripId(identifier);
    };
    initializeTripId();
  }, [trip]);

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const theme = useAppTheme();
  const styles = useStyles();
  return (
    <ScreenWrapper>
      <BlurView
        blurAmount={10}
        blurType="light"
        reducedTransparencyFallbackColor="white"
        style={styles.blurView}>
        <Menu
          anchor={<Button
            icon="swap-horizontal"
            onPress={openMenu}>
            Change trips
          </Button>}
          anchorPosition="bottom"
          contentStyle={{ backgroundColor: theme.colors.onPrimaryContainer }}
          onDismiss={closeMenu}
          visible={menuVisible}>
          <Menu.Item
            onPress={() => {}}
            title="Item 1" />
          <Menu.Item
            onPress={() => {}}
            title="Item 2" />
        </Menu>
      </BlurView>
    </ScreenWrapper>
  );
};

export default PlanningContent;

const useStyles = makeStyles(() => ({
  blurView: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start',
  },
}));
