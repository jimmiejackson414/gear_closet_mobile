import { useState } from 'react';
import { Text, View } from 'react-native';
import convert from 'convert';
import round from 'lodash.round';
import { PieChart, type pieDataItem } from 'react-native-gifted-charts';
import { useAppTheme } from '@/context/ThemeProvider';
import { calculateCategoryWeight, findTheme, makeStyles } from '@/helpers';
import type { ExtendedPack } from '@/types/helpers';

interface Props {
  pack?: ExtendedPack;
}

const PackChart: React.FC<Props> = ({ pack }) => {
  console.log('pack: ', pack);
  const { theme } = useAppTheme();
  const styles = useStyles();
  const [activeSlice, setActiveSlice] = useState<number | null>(0);
  console.log({ activeSlice });

  if (!pack) {
    return (
      <View>
        <Text>No data</Text>
      </View>
    );
  }

  // color: (params: any) => {
  //   const theme = findTheme(data.value.pack?.theme as Theme);
  //   return theme[params.dataIndex % theme.length];
  // },
  // const weight = round(convert(categoryWeight, 'mg')
  // .to('lb'), 2);

  const themeColors = findTheme(pack.theme);
  const computedData = pack.categories.map(( category, i ) => {
    const value = calculateCategoryWeight(category);

    return {
      value: round(convert(value, 'mg')
        .to('lb'), 2),
      color: themeColors[i % themeColors.length],
      focused: false,
    };
  }) satisfies pieDataItem[];

  return (
    <PieChart
      centerLabelComponent={() => {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              width: 10, height: 10, borderRadius: 50, backgroundColor: themeColors[activeSlice ? activeSlice % themeColors.length : 0],
            }} />
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
              {activeSlice !== null ? computedData[activeSlice].value : '0'}
              %
            </Text>
            <Text style={{ fontSize: 14, color: 'white' }}>Excellent</Text>
          </View>
        );
      }}
      data={computedData}
      donut
      innerRadius={60}
      onPress={({ item }: { item: any }) => setActiveSlice(item)}
      radius={90}
      sectionAutoFocus />
  );
};

const useStyles = makeStyles(() => {});

export default PackChart;