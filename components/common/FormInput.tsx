import { useState } from 'react';
import { View } from 'react-native';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { HelperText, TextInput } from 'react-native-paper';
import { useAppTheme } from '@/hooks';
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
  secureTextEntry,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useAppTheme();

  return (
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
            right={
              secureTextEntry ? (
                <TextInput.Icon icon={({ size, color }) =>
                  !showPassword ? (
                    <EyeIcon
                      color={disabled ? theme.colors.secondaryContainer : color}
                      height={size}
                      onPress={!disabled ? () => setShowPassword(prev => !prev) : undefined}
                      width={size} />
                  ) : (
                    <EyeOffIcon
                      color={disabled ? theme.colors.secondaryContainer : color}
                      height={size}
                      onPress={!disabled ? () => setShowPassword(prev => !prev) : undefined}
                      width={size} />
                  )
                } />
              ) : null
            }
            secureTextEntry={secureTextEntry && !showPassword}
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
};

export default FormInput;