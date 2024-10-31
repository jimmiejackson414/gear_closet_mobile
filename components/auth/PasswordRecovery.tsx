import { View } from 'react-native';
import { Image } from 'expo-image';
import { H4, P } from '@/components/ui';
import { makeStyles } from '@/helpers';

const PasswordRecoveryScreen = () => {
  const styles = useStyles();
  return (
    <View style={styles.center}>
      <Image
        contentFit="contain"
        source={require('../../assets/gear-closet-icon.png')}
        style={styles.icon} />
      <H4>Password Recovery</H4>
      <P className="text-center mt-4">
        If an account with this email exists, you will receive an email with a link to reset your password.
      </P>
      <P className="text-center mt-4">
        Please allow a few minutes for the email to arrive, and be sure to check your spam folder.
      </P>
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
}));

export default PasswordRecoveryScreen;