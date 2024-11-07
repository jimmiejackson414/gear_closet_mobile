import { Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Label, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import type { Control } from 'react-hook-form';

export type FormSelectOption = {
  value: string;
  label: string;
  [key: string]: any;
};

interface FormSelectProps {
  control?: Control<any>;
  name: string;
  label?: string;
  options: FormSelectOption[];
  disabled?: boolean;
  placeholder?: string;
  value?: FormSelectOption;
  containerClass?: string;
  customIndicator?: (option: FormSelectOption) => React.ReactNode;
  [key: string]: any;
}

const FormSelect: React.FC<FormSelectProps> = ({
  control,
  containerClass = 'flex-0',
  name,
  label,
  options,
  disabled = false,
  placeholder = 'Select an option',
  customIndicator,
  value,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const renderSelect = ({
    onChange, value, error,
  }: {
    onChange: (option: FormSelectOption | undefined) => void;
    value: FormSelectOption | undefined;
    error?: any;
  }) => {
    return (
      <View className={containerClass}>
        {label && (
          <Label
            className="mb-2 font-semibold"
            nativeID={name}>
            {label}
          </Label>
        )}
        <Select
          onValueChange={onChange}
          value={value}
          {...rest}>
          <SelectTrigger disabled={disabled}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent insets={contentInsets}>
            <SelectGroup>
              {options.map(option => (
                <SelectItem
                  customIndicator={customIndicator ? customIndicator(option) : undefined}
                  key={option.value}
                  label={option.label}
                  value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && (
          <Text className="mt-2 text-destructive">
            {error.message}
          </Text>
        )}
      </View>
    );
  };

  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => renderSelect({
          onChange, value, error,
        })} />
    );
  }

  const computedValue = options.find(option => option.value === value?.value);
  return renderSelect({
    onChange: rest.onChange || (() => {}),
    value: computedValue,
    error: rest.error,
  });
};

export default FormSelect;