import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default fullConfig as typeof fullConfig & { theme: { colors: Record<string, string> } };