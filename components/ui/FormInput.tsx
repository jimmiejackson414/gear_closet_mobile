// import { Text, TextInput } from 'react-native-paper';
import { Control, type UseControllerProps, useController } from 'react-hook-form';
import { StyleSheet, TextInputIOSProps, View } from 'react-native';
import theme from '@/lib/theme';

interface Props {
  [key: string]: any;
  control: Control<any>;
  dense?: boolean;
  disabled?: boolean;
  label: string;
  name: string;
  placeholder?: string;
  rules: UseControllerProps['rules'];
  textContentType?: TextInputIOSProps['textContentType']
}

const FormInput = ({
  control,
  dense = false,
  disabled = false,
  label,
  name,
  placeholder,
  rules,
  textContentType = 'none',
  ...inputProps
}: Props) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <View style={styles.formInput}>
      {/* <TextInput
        {...inputProps}
        activeOutlineColor={theme.colors.primary}
        autoCapitalize='none'
        dense={dense}
        disabled={disabled}
        error={!!error}
        label={label}
        mode={'outlined'}
        onBlur={field.onBlur}
        onChangeText={field.onChange}
        outlineColor={theme.colors.outline}
        outlineStyle={{
          borderRadius: 8,
          borderWidth: 1,
        }}
        placeholderTextColor={theme.colors.outlineVariant}
        ref={field.ref}
        textColor={theme.colors.scrim}
        textContentType={textContentType}
        value={field.value} />
      {error && <Text style={styles.error}>{error.message}</Text>} */}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  error: { color: theme.colors.error },
  formInput: { gap: 4 },
});