import { Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Label , Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import type { Control } from 'react-hook-form';

interface FormSelectProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: { label: string; value: string }[];
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

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }) => {
        const computedValue = options.find(option => option.value === value);

        return (
          <View>
            {label && (
              <Label
                className="mb-2 font-semibold"
                nativeID={name}>
                {label}
              </Label>
            )}
            <Select
              onValueChange={onChange}
              value={computedValue}
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
        );}} />
  );
};

export default FormSelect;