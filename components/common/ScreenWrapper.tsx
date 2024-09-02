import * as React from 'react';
import { ScrollView, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ScrollViewProps & {
  children: React.ReactNode;
  withScrollView?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ScreenWrapper({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    {
      backgroundColor: 'transparent',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    style,
  ];

  const combinedContentContainerStyle: StyleProp<ViewStyle> = [
    { flexGrow: 1 },
    contentContainerStyle,
  ];

  return (
    <SafeAreaView style={containerStyle}>
      {withScrollView ? (
        <ScrollView
          {...rest}
          alwaysBounceVertical={false}
          contentContainerStyle={combinedContentContainerStyle}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: 'transparent' }}>
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});