import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import convert from 'convert';
import round from 'lodash.round';
import { useClickOutside } from 'react-native-click-outside';
import { PieChart, type pieDataItem } from 'react-native-gifted-charts';
import { Text } from '@/components/ui';
import { calculateCategoryWeight, findTheme } from '@/helpers';
import { useTheme } from '@/hooks';
import type { ExtendedPack } from '@/types/helpers';

interface Props {
  pack?: ExtendedPack;
}

const PackChart: React.FC<Props> = ({ pack }) => {
  const [activeSlice, setActiveSlice] = useState<number | null>(0);
  const chartRef = useClickOutside<View>(() => setActiveSlice(null));
  const theme = useTheme();

  if (!pack) {
    return (
      <View style={{
        width: '100%', flexDirection: 'row', justifyContent: 'center',
      }}>
        <Text>No data</Text>
      </View>
    );
  }

  const themeColors = findTheme(pack.theme);
  const computedData = pack.categories.map(( category, i ) => {
    const value = calculateCategoryWeight(category);

    return {
      value: round(convert(value, 'mg')
        .to('lb'), 2),
      color: themeColors[i % themeColors.length],
      focused: i === activeSlice,
    };
  }) satisfies pieDataItem[];

  return (
    <View
      ref={chartRef}
      style={{ alignItems: 'center' }}>
      <PieChart
        centerLabelComponent={
          activeSlice !== null ? () => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{
                width: 10,
                height: 10,
                borderRadius: 50,
                backgroundColor: themeColors[activeSlice % themeColors.length],
                marginBottom: 12,
              }} />
              <Text style={{
                fontSize: 22, fontWeight: 'bold', textAlign: 'center',
              }}>
                {`${computedData[activeSlice].value} lbs`}
              </Text>
              <Text style={{ fontSize: 14, textAlign: 'center' }}>
                {pack.categories[activeSlice].name}
              </Text>
            </View>
          ) : undefined
        }
        data={computedData}
        donut
        innerCircleColor={theme.card}
        innerRadius={60}
        onPress={(_item: pieDataItem, index: number) => setActiveSlice(index)}
        radius={90}
        sectionAutoFocus />
      <View style={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        marginTop: 20,
        gap: 16,
      }}>
        {computedData.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveSlice(i)}
            style={{ flexDirection: 'row' }}>
            <View style={{
              height: 18,
              width: 18,
              marginRight: 10,
              borderRadius: 4,
              backgroundColor: item.color || 'red',
            }} />
            <Text style={{ color: item.color, fontSize: 16 }}>
              {pack.categories[i].name || 'Unknown'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PackChart;