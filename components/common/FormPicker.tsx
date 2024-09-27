import { View } from 'react-native';
import { ChevronDownIcon } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { TextInput, useTheme } from 'react-native-paper';
import RNPickerSelect, { type Item } from 'react-native-picker-select';
import { makeStyles } from '@/helpers';
import type { Control } from 'react-hook-form';

interface Props {
  disabled?: boolean;
  label: string;
  options: Item[];
  control: Control<any>;
  name: string;
  onValueChange?: (value: string) => void;
}

const FormPicker: React.FC<Props> = ({
  disabled, label, options, control, name, onValueChange, ...rest
}) => {
  const theme = useTheme();
  const styles = useStyles({ theme, disabled });

  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            disabled={disabled}
            label={label}
            mode="outlined"
            render={() => (
              <RNPickerSelect
                disabled={disabled}
                Icon={() => (
                  <ChevronDownIcon
                    color={theme.colors.primary}
                    size={24} />
                )}
                items={options}
                onValueChange={itemValue => {
                  onChange(itemValue);
                  if (onValueChange) {
                    onValueChange(itemValue);
                  }
                }}
                placeholder={{ label: '', value: '' }}
                style={styles}
                useNativeAndroidPickerStyle={false}
                value={value} />
            )}
            value={value}
            {...rest} />
        )} />
    </View>
  );
};

const useStyles = makeStyles((theme, { disabled }) => ({
  iconContainer: {
    justifyContent: 'center',
    height: '100%',
    marginRight: 5,
  },
  inputIOS: {
    fontSize: 16,
    height: 50,
    paddingHorizontal: 14,
    color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary,
    textAlignVertical: 'center',
    width: '100%',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    height: 50,
    paddingHorizontal: 14,
    color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary,
    textAlignVertical: 'center',
    width: '100%',
    paddingRight: 30,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 16 },
}));

export default FormPicker;