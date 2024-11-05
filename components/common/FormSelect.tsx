import { Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Label, type Option, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import type { Control } from 'react-hook-form';

export type FormSelectOption = Exclude<Option, undefined>;

interface FormSelectProps {
  control?: Control<any>; // Made optional
  name: string;
  label?: string;
  options: FormSelectOption[];
  placeholder?: string;
  [key: string]: any;
}

const FormSelect: React.FC<FormSelectProps> = ({
  control,
  name,
  label,
  options,
  placeholder = 'Select an option',
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
      <View className="flex-1">
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
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className="w-full"
            insets={contentInsets}>
            <SelectGroup>
              {options.map(option => (
                <SelectItem
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

  // Render select input directly if control is not provided
  return renderSelect({
    onChange: rest.onChange || (() => {}),
    value: rest.value || undefined,
    error: rest.error,
  });
};

export default FormSelect;