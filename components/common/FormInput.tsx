import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { LucideIcon } from 'lucide-react-native'; // Import from lucide
import type { TextInputProps } from 'react-native';
import { FormControl, FormControlError, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Input, InputField, InputIcon, InputSlot } from '@/components/ui';

interface FormInputProps {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: TextInputProps['autoComplete'];
  autoFocus?: boolean;
  className?: string;
  defaultValue?: string;
  helperText?: string;
  icon?: LucideIcon;
  isDisabled?: boolean;
  isRequired?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'password';
}

const FormInput: React.FC<FormInputProps> = ({
  autoCapitalize = 'none',
  autoComplete,
  autoFocus = false,
  className,
  defaultValue,
  helperText,
  icon: Icon, // Destructure icon prop
  isDisabled = false,
  isRequired = false,
  keyboardType = 'default',
  label,
  name,
  placeholder,
  type = 'text',
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
        <FormControlHelper>
          <FormControlHelperText>
            {helperText}
          </FormControlHelperText>
        </FormControlHelper>
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