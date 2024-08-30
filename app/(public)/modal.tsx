import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Box, Center, Progress, ProgressFilledTrack } from '@/components/ui';

export default function Modal() {
  const [step, setStep] = useState(1);

  return (
    <Box style={styles.modal}>
      <Progress
        className="w-80 h-1"
        value={step * 50}>
        <ProgressFilledTrack className="bg-primary-500 rounded-full h-1" />
      </Progress>
    </Box>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 24,
    flex: 1,
    alignItems: 'center',
  },
});