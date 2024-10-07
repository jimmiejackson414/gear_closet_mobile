import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ChevronDownIcon } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Button, Dialog, Portal, TextInput, useTheme } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import type { Control } from 'react-hook-form';

interface Item {
  label: string;
  value: string;
}

interface Props {
  control: Control<any>;
  disabled?: boolean;
  label: string;
  options: Item[];
  name: string;
  onValueChange?: (value: string) => void;
}

const FormPicker: React.FC<Props> = ({
  control, disabled, label, options, name, onValueChange,
}) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const styles = useStyles({ theme, disabled });

  const handlePress = () => {
    console.log('TextInput pressed');
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              disabled={disabled}
              editable={false}
              label={label}
              mode="outlined"
              onPress={handlePress}
              right={
                <TextInput.Icon icon={({ size }) => <ChevronDownIcon
                  color={theme.colors.primary}
                  size={size} />} />}
              style={styles.textInput}
              value={options.find(option => option.value === value)?.label || ''} />
            <Portal>
              {visible && (
                <BlurView
                  blurAmount={5}
                  blurType="xlight"
                  reducedTransparencyFallbackColor="white"
                  style={StyleSheet.absoluteFill} />
              )}
              <Dialog
                onDismiss={hideDialog}
                style={styles.dialog}
                visible={visible}>
                <Dialog.Title>
                  {label}
                </Dialog.Title>
                <Dialog.ScrollArea>
                  <FlatList
                    data={options}
                    keyExtractor={item => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          onChange(item.value);
                          setVisible(false);
                          if (onValueChange) {
                            onValueChange(item.value);
                          }
                        }}
                        style={styles.item}>
                        <Text style={styles.itemText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )} />
                </Dialog.ScrollArea>
                <Dialog.Actions>
                  <Button onPress={hideDialog}>Close</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )} />
    </View>
  );
};

const useStyles = makeStyles((theme, { disabled }) => ({
  textInput: { width: '100%' },
  dialog: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  item: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
    color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary,
  },
}));

export default FormPicker;