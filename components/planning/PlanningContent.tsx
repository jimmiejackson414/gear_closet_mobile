import { Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';

const PlanningContent = () => {
  const theme = useAppTheme();
  const styles = useStyles();
  return (
    <ScreenWrapper>
      <Text>Planning Content</Text>
    </ScreenWrapper>
  );
};

export default PlanningContent;

const useStyles = makeStyles(() => ({}));
