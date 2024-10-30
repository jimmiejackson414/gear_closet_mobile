import { Text, View } from 'react-native';
// import PlanningContent from '@/components/planning/PlanningContent';
import { makeStyles } from '@/helpers';

const PlanningScreen = () => {
  const styles = useStyles();
  return (
    // <View style={styles.container}>
    //   <PlanningContent />
    // </View>
    <Text>PlanningContent</Text>
  );
};

const useStyles = makeStyles(() => ({ container: { flex: 1 } }));

export default PlanningScreen;