import { Image } from 'expo-image';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { makeStyles } from '@/helpers';

const PasswordRecoveryScreen = () => {
  const styles = useStyles();
  return (
    <View style={styles.center}>
      <Image
        contentFit="contain"
        source={require('../../assets/gear-closet-icon.png')}
        style={styles.icon} />
      <Text variant="headlineSmall">
        Password Recovery
      </Text>
      <Text style={[ styles.text, { marginVertical: 16 } ]}>
        If an account with this email exists, you will receive an email with a link to reset your password.
      </Text>
      <Text style={styles.text}>
        Please allow a few minutes for the email to arrive, and be sure to check your spam folder.
      </Text>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  center: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  icon: {
    height: 64,
    marginBottom: 8,
    marginTop: 64,
    width: 64,
  },
  text: { textAlign: 'center' },
}));

export default PasswordRecoveryScreen;