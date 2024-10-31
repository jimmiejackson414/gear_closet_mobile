import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import config from '@/helpers/theme';
import { EyeIcon, EyeOffIcon } from '@/lib/icons'; // Assuming you have these icons
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
  label?: string;
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
  // dense = false,
  disabled = false,
  keyboardType = 'default',
  label,
  name,
  placeholder,
  readOnly = false,
  secureTextEntry,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const { theme } = config;

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
          {label && (
            <Text className="mb-2 font-semibold">
              {label}
            </Text>
          )}
          <View className="relative">
            <Input
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              editable={!disabled && !readOnly}
              keyboardType={keyboardType}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry && !showPassword}
              value={value}
              {...rest} />
            {secureTextEntry && (
              <TouchableOpacity
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onPress={() => setShowPassword(prev => !prev)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TouchableOpacity>
            )}
          </View>
          {error && (
            <Text className="mt-2 text-destructive">
              {error.message}
            </Text>
          )}
        </View>
      )} />
  );
};

export default FormInput;