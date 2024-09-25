import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { HelperText, TextInput } from 'react-native-paper';
import type { Control } from 'react-hook-form';
import type { TextInputProps } from 'react-native';

interface FormInputProps {
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoFocus?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  dense?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  control: Control<any>;
  label: string;
  left?: React.ReactNode;
  name: string;
  placeholder?: string;
  right?: React.ReactNode;
  secureTextEntry?: boolean;
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