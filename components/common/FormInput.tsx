import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { LucideIcon } from 'lucide-react-native'; // Import from lucide
import type { TextInputProps } from 'react-native';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText, Input, InputField, InputIcon, InputSlot } from '@/components/ui';

interface FormInputProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: TextInputProps['autoComplete'];
  autoFocus?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  type?: 'text' | 'password';
  className?: string;
  icon?: LucideIcon; // Add icon prop
  placeholder?: string; // Add placeholder prop
  defaultValue?: string; // Add defaultValue prop
  helperText?: string; // Add helperText prop
  isRequired?: boolean; // Add isRequired prop
  rules?: object; // Add validation rules prop
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  isDisabled = false,
  autoCapitalize = 'none',
  autoComplete,
  autoFocus = false,
  keyboardType = 'default',
  type = 'text',
  className,
  icon: Icon, // Destructure icon prop
  placeholder,
  defaultValue,
  helperText,
  isRequired = false,
  rules = {},
}) => {
  const { control } = useFormContext();
  const {
    field: {
      onChange, onBlur, value,
    },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
  });

  return (
    <FormControl
      className="w-full"
      isDisabled={isDisabled}
      isInvalid={!!error}
      isRequired={isRequired}>
      <FormControlLabel className="mb-1">
        <FormControlLabelText className="text-typography-700">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Input
        className={`w-full ${className}`}
        isDisabled={isDisabled}
        size="lg"
        variant="outline">
        {Icon && (
          <InputSlot>
            <InputIcon
              as={Icon}
              className="pl-10" />
          </InputSlot>
        )}
        <InputField
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          onBlur={onBlur}
          onChangeText={onChange}
          placeholder={placeholder}
          type={type}
          value={value} />
      </Input>
      {helperText && !error && (
        <FormControlError>
          <FormControlErrorText>
            {helperText}
          </FormControlErrorText>
        </FormControlError>
      )}
      {error && (
        <FormControlError>
          <FormControlErrorText>
            {error.message}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default FormInput;