import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientBackground from '@/components/common/GradientBackground';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
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
  const { theme } = useAppTheme();
  const styles = useStyles(theme);

  return (
    <GradientBackground>
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
              color={theme.colors.primaryContainer}
              size="large" />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
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