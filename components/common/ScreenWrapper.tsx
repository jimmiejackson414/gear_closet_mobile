import * as React from 'react';
import { ScrollView, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {withScrollView ? (
        <ScrollView
          {...rest}
          contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <View style={styles.innerView}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View style={[styles.innerView, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    paddingLeft: 16, // Adjust the padding value as needed
    paddingRight: 16, // Adjust the padding value as needed
  },
  innerView: { flex: 1 },
});

export default ScreenWrapper;