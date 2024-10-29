import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
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

  return (
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
  );
};

const useStyles = makeStyles(theme => ({ card: { backgroundColor: theme.colors.onPrimary } }));

export default PackWidget;