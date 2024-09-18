import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface FormInputProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  [key: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({
  autoCapitalize = 'none',
  autoComplete,
  autoFocus = false,
  control,
  dense = false,
  disabled = false,
  keyboardType = 'default',
  label,
  left,
  name,
  placeholder,
  readOnly = false,
  right,
  secureTextEntry,
  ...rest
}) => (
  <Controller
    control={control}
    name={name}
    render={({
      field: {
        onChange, onBlur, value,
      }, fieldState: { error },
    }) => (
      <View>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          dense={dense}
          disabled={disabled}
          error={!!error}
          keyboardType={keyboardType}
          label={label}
          left={left}
          mode="outlined"
          onBlur={onBlur}
          onChangeText={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          right={right}
          secureTextEntry={secureTextEntry}
          value={value}
          {...rest} />
        <HelperText
          type="error"
          visible={!!error}>
          {error?.message}
        </HelperText>
      </View>
    )} />
);

export default FormInput;