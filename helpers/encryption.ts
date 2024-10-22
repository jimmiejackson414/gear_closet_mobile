import Crypto from 'crypto-es';

const cookieKey = process.env.EXPO_PUBLIC_COOKIE_KEY;

export const encrypt = (value: any): string => {
  return Crypto.AES.encrypt(JSON.stringify(value), cookieKey)
    .toString();
};

export const decrypt = (value: any): string => {
  if (!value) return '';
  const bytes = Crypto.AES.decrypt(value, cookieKey);
  return bytes.toString(Crypto.enc.Utf8);
};
