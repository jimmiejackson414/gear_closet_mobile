import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormSelect from '@/components/common/FormSelect';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Button, P, Separator, Text } from '@/components/ui';
import { makeStyles } from '@/helpers';
import { decrypt } from '@/helpers/encryption';
import { useErrorHandling, useLoading } from '@/hooks';
import { PlusIcon } from '@/lib/icons';
import { usePlanningQuery } from '@/services/planning';
import { TripDetailsType } from '@/types';
import FriendsWidget from './widgets/FriendsWidget';
import HikeDetailsWidget from './widgets/HikeDetailsWidget';
import PackWidget from './widgets/PackWidget';
import PollWidget from './widgets/PollWidget';
import ShoppingListWidget from './widgets/ShoppingListWidget';
import TodosWidget from './widgets/TodosWidget';
import TripDetailsWidget from './widgets/TripDetailsWidget';
import type { FormSelectOption } from '@/components/common/FormSelect';

const PlanningContent = () => {
  const [tripId, setTripId] = useState<number | null>(null);
  const {
    data, error, isLoading,
  } = usePlanningQuery(tripId ?? 0);

  const tripOptions: FormSelectOption[] = data?.trips.map(t => ({ label: t.name || '', value: String(t.id) })) || [];

  // const { trip: searchTrip } = useLocalSearchParams();
  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch planning data');

  const initialTripIdSet = useRef(false);
  useEffect(() => {
    const trips = data?.trips ?? [];
    if (!initialTripIdSet.current && trips?.length > 0) {
      const identifier = Number(data?.trips[0]?.id) ?? null;
      setTripId(identifier);
      initialTripIdSet.current = true;
    }

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
  }, [data]);

  const handleCreateTrip = () => {
    console.log('Add Trip');
  };

  const handleTripChange = (value: string | number | null) => setTripId(Number(value) ?? null);

  const styles = useStyles();
  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <View style={styles.settingsRow}>
        {/* <FormSelect
          onChange={handleTripChange}
          options={tripOptions}
          placeholder="Selected Trip"
          style={styles.formSelect}
          value={tripId} /> */}
        <Button
          className="flex-0"
          onPress={handleCreateTrip}
          variant="outline">
          <PlusIcon />
          <P>Create Trip</P>
        </Button>
      </View>
      <Separator className="my-4" />
      <View>
        {!data?.trips.length ? (
          <Text>No trips found</Text>
        ) : (
          <View style={styles.contentWrapper}>
            {/* Pack Widget */}
            {/* <PackWidget data={data.pack} /> */}

            {/* Hike Details */}
            {/* <HikeDetailsWidget data={data.trip_details.filter(detail => detail.type === TripDetailsType.HIKE)} /> */}

            {/* Trip Details */}
            {/* <TripDetailsWidget data={data.trip_details.filter(detail => detail.type === TripDetailsType.TRIP)} /> */}

            {/* Friends */}
            {/* <FriendsWidget data={data.friends} /> */}

            {/* Todos */}
            {/* <TodosWidget data={data.todos} /> */}

            {/* Shopping List */}
            {/* <ShoppingListWidget data={data.shopping_items} /> */}

            {/* Poll */}
            {/* <PollWidget data={data.poll} /> */}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const useStyles = makeStyles(() => ({
  addButton: { flex: 0 },
  blurView: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '50%',
  },
  contentWrapper: {
    flexDirection: 'column',
    gap: 16,
  },
  formSelect: { flex: 1 },
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
    gap: 32,
    width: '100%',
  },
}));

export default PlanningContent;
