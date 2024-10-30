import { ActivityIndicator, ScrollView, StyleSheet , View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@/helpers';
import config from '@/helpers/theme';
import useAppStore from '@/stores/appStore';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

type Props = ScrollViewProps & {
  children: React.ReactNode;
  withScrollView?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const ScreenWrapper = ({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  ...rest
}: Props) => {
  const isLoading = useAppStore(state => state.isLoading);
  const { theme } = config;
  const styles = useStyles(theme);

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[styles.safeArea, style]}>
      {withScrollView ? (
        <ScrollView
          {...rest}
          contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          pointerEvents={isLoading ? 'none' : 'auto'}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <View style={styles.innerView}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View
          pointerEvents={isLoading ? 'none' : 'auto'}
          style={[styles.innerView, contentContainerStyle]}>
          {children}
        </View>
      )}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator
            animating={true}
            color={theme.colors.primary.DEFAULT}
            size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeArea: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  innerView: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default ScreenWrapper;