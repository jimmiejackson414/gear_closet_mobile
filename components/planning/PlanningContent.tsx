import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';
import { Button, Divider, Icon, Text } from 'react-native-paper';
import { Dropdown, type Option } from 'react-native-paper-dropdown';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { makeStyles } from '@/helpers';
import { decrypt } from '@/helpers/encryption';
import { useAppTheme, useErrorHandling, useLoading } from '@/hooks';
import { usePlanningQuery } from '@/services/planning';

const PlanningContent = () => {
  // const [tripId, setTripId] = useState<string | null>(null);
  // const {
  //   data, error, isLoading,
  // } = usePlanningQuery(trip ? Number(tripId) : 0);

  // const tripOptions: Option[] = data?.trips.map(t => ({ label: t.name || '', value: String(t.id) })) || [];

  // const { trip: searchTrip } = useLocalSearchParams();
  // useLoading(isLoading);
  // useErrorHandling(error, 'Failed to fetch planning data');

  // useEffect(() => {
  //   const initializeTripId = async () => {
  //     let identifier: string | null = null;

  //     if (searchTrip) {
  //       identifier = decrypt(searchTrip);
  //     } else {
  //       const encryptedTripId = await AsyncStorage.getItem('selectedTripId');
  //       if (encryptedTripId) {
  //         identifier = decrypt(encryptedTripId);
  //       }
  //     }

  //     if (identifier) {
  //       setTripId(String(identifier));
  //     } else if (tripOptions.length > 0) {
  //       setTripId(String(tripOptions[0].value));
  //     }
  //   };

  //   initializeTripId();
  // }, [searchTrip, tripOptions]);

  const handleCreateTrip = () => {
    console.log('Add Trip');
  };

  const theme = useAppTheme();
  const styles = useStyles();
  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <View style={styles.settingsRow}>
        <BlurView
          blurAmount={10}
          blurType="light"
          reducedTransparencyFallbackColor="white"
          style={styles.blurView}>
          {/* <Dropdown
            hideMenuHeader
            label="Selected Trip"
            menuDownIcon={
              <Icon
                color={theme.colors.primary}
                size={24}
                source="chevron-down" />
            }
            menuUpIcon={
              <Icon
                color={theme.colors.primary}
                size={24}
                source="chevron-up" />
            }
            mode="outlined"
            onSelect={(value?: string) => setTripId(value || '0')}
            options={tripOptions}
            value={tripId} /> */}
        </BlurView>
        <Button
          compact
          icon="plus"
          mode="contained"
          onPress={handleCreateTrip}>
          Create Trip
        </Button>
      </View>
      <Divider style={{ marginVertical: 16 }} />
      <View>
        <Text>Planning Content</Text>
      </View>
    </ScreenWrapper>
  );
};

const useStyles = makeStyles(() => ({
  screenWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
  },
  blurView: { backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '50%' },
}));

export default PlanningContent;
