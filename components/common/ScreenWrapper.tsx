import * as React from 'react';
import { ActivityIndicator, ScrollView, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppStore from '@/stores/appStore';

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
  const isLoading = useAppStore((state) => state.isLoading);

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
            color="#0000ff"
            size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScreenWrapper;