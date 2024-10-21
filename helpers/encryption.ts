import crypto from 'crypto';

const cookieKey = process.env.EXPO_PUBLIC_COOKIE_KEY;
const algorithm = 'aes-256-cbc';
const key = Buffer.from(cookieKey, 'utf8');

export const encrypt = (value: any): string => {
  const iv = crypto.randomBytes(16); // generate a random Initialization Vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const ivString = iv.toString('base64');
  return `${ivString}:${encrypted}`; // return the encrypted data
};

export const decrypt = (value: any): string => {
  if (!value) return '';
  const [ivString, encrypted] = value.split(':');
  const iv = Buffer.from(ivString, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
