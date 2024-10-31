import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input, Label } from '@/components/ui';
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
            <Label
              className="mb-2 font-semibold"
              nativeID={name}>
              {label}
            </Label>
          )}
          <View className="relative">
            <Input
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              autoFocus={autoFocus}
              className={secureTextEntry ? 'pr-10' : ''}
              editable={!disabled && !readOnly}
              error={!!error}
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
                onPress={() => !disabled && setShowPassword(prev => !prev)}>
                {showPassword ? (
                  <EyeOffIcon className={`stroke-muted-foreground ${disabled ? 'opacity-50' : ''}`} />
                ) : (
                  <EyeIcon className={`stroke-muted-foreground ${disabled ? 'opacity-50' : ''}`} />
                )}
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