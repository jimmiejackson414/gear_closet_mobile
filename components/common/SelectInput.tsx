import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Button, Menu, TextInput } from 'react-native-paper';
import type { Control } from 'react-hook-form';

interface OptionObject {
  label: string;
  value: string;
}

type Option = string | OptionObject;

interface Props {
  label: string;
  options: Option[];
  control: Control<any>;
  name: string;
  onValueChange?: (value: string) => void; // Make onValueChange optional
}

const SelectInput: React.FC<Props> = ({
  label, options, control, name, onValueChange,
}) => {
  const [visible, setVisible] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (option: Option, onChange: (value: string) => void) => {
    const selectedValue = typeof option === 'string' ? option : option.value;
    onChange(selectedValue);
    if (onValueChange) {
      onValueChange(selectedValue);
    }
    closeMenu();
  };

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    })
      .start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          <TouchableOpacity onPress={openMenu}>
            <TextInput
              editable={false}
              label={label}
              right={<TextInput.Icon icon={({ color, size }) => (
                <Animated.View style={{ transform: [{ rotate }] }}>
                  <ChevronDown
                    color={color}
                    size={size} />
                </Animated.View>
              )} />}
              value={value} />
          </TouchableOpacity>
          <Menu
            anchor={<Button onPress={openMenu}>
              {label}
            </Button>}
            onDismiss={closeMenu}
            visible={visible}>
            {options.map(option => (
              <Menu.Item
                key={typeof option === 'string' ? option : option.value}
                onPress={() => handleSelect(option, onChange)}
                title={typeof option === 'string' ? option : option.label} />
            ))}
          </Menu>
        </View>
      )} />
  );
};

export default SelectInput;