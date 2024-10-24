import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { HelperText, Menu, TextInput, useTheme } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import type { Control } from 'react-hook-form';

export interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  placeholder: string;
  options: Option[];
  value: string | number | null;
  onChange: (_value: string | number | null) => void;
  control?: Control<any>;
  name?: string; // react-hook-form field name
  error?: string;
  searchable?: boolean; // Future support for searchable dropdown
  style?: any;
  [key: string]: any;
}

const FormSelect: React.FC<FormSelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
  control,
  name,
  error,
  searchable = false,
  style,
  ...rest
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setMenuVisible(false);
  };

  const selectedOptionLabel = options.find(option => String(option.value) === String(value))?.label || '';

  const styles = useStyles();
  const renderDropdown = () => (
    <View style={[styles.wrapper, style]}>
      {searchable ? (
        <TextInput
          label={placeholder}
          mode="outlined"
          onBlur={() => setMenuVisible(false)}
          onFocus={() => setMenuVisible(true)}
          right={<TextInput.Icon
            icon={menuVisible ? 'chevron-up' : 'chevron-down'}
            onPress={() => setMenuVisible(prev => !prev)} />}
          style={styles.textInput}
          value={selectedOptionLabel}
          {...rest} />
      ) : (
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <TextInput
            editable={false}
            label={placeholder}
            mode="outlined"
            pointerEvents="none"
            right={<TextInput.Icon
              icon={menuVisible ? 'chevron-up' : 'chevron-down'}
              onPress={() => setMenuVisible(prev => !prev)} />}
            style={styles.textInput}
            value={selectedOptionLabel}
            {...rest} />
        </TouchableOpacity>
      )}
      <Menu
        anchor={<View style={styles.anchor} />}
        contentStyle={{ backgroundColor: theme.colors.surface }}
        onDismiss={() => setMenuVisible(false)}
        visible={menuVisible}>
        {options.map(option => (
          <Menu.Item
            key={String(option.value)}
            onPress={() => handleSelect(option.value)}
            title={option.label} />
        ))}
      </Menu>
      {error && (
        <HelperText
          type="error"
          visible={!!error}>
          {error}
        </HelperText>
      )}
    </View>
  );

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange: onControllerChange, value: controllerValue }, fieldState: { error: controllerError } }) => (
          <FormSelect
            error={controllerError?.message}
            onChange={onControllerChange}
            options={options}
            placeholder={placeholder}
            searchable={searchable}
            style={style}
            value={controllerValue}
            {...rest} />
        )} />
    );
  }

  return renderDropdown();
};

const useStyles = makeStyles(() => ({
  anchor: {
    width: 1,
    height: 1,
  },
  textInput: { width: '100%' },
  wrapper: { width: 'auto' },
}));

export default FormSelect;