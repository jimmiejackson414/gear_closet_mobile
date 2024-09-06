import { useRef, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import theme from '@/lib/theme';

interface Props {
  length?: number;
  onChangeCode: (code: string) => void;
}

const CodeInput: React.FC<Props> = ({ length = 6, onChangeCode }) => {
  const [code, setCode] = useState(new Array(length)
    .fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChangeText = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    onChangeCode(newCode.join(''));
    if (text && index < length - 1 && inputs.current[index + 1]) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          ref={(ref) => (inputs.current[index] = ref)}
          style={styles.input}
          value={digit} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    textAlign: 'center',
    fontSize: 18,
  },
});

export default CodeInput;