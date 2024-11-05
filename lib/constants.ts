import type { SubscriptionLevel } from '@/types';

export const CUSTOM_THEME = {
  light: {
    accent: 'hsl(166 30% 88%)', // accent
    accentAlt: 'hsl(166 50% 25%)', // accent-alt
    accentForeground: 'hsl(204 5% 15%)', // accent-foreground
    background: 'hsl(204 51% 95%)', // background
    border: 'hsl(204 30% 82%)', // border
    card: 'hsl(204 50% 90%)', // card
    cardForeground: 'hsl(204 5% 15%)', // card-foreground
    destructive: 'hsl(0 51% 50%)', // destructive
    destructiveForeground: 'hsl(204 5% 90%)', // destructive-foreground
    foreground: 'hsl(204 5% 10%)', // foreground
    input: 'hsl(204 30% 50%)', // input
    muted: 'hsl(166 30% 88%)', // muted
    mutedForeground: 'hsl(204 5% 40%)', // muted-foreground
    popover: 'hsl(204 51% 95%)', // popover
    popoverForeground: 'hsl(204 95% 10%)', // popover-foreground
    primary: 'hsl(204 100% 26.9%)', // primary
    primaryForeground: 'hsl(0 0% 100%)', // primary-foreground
    radius: '1rem', // radius
    ring: 'hsl(204 100% 26.9%)', // ring
    secondary: 'hsl(204 30% 88%)', // secondary
    secondaryForeground: 'hsl(0 0% 0%)', // secondary-foreground
    tertiaryForeground: 'hsl(21 10% 90%)',
    tertiary: 'hsl(21 69% 73%)',
    text: 'hsl(204 5% 10%)', // text
  },
  dark: {
    accent: 'hsl(166 30% 25%)', // accent
    accentAlt: 'hsl(166 30% 88%)', // accent-alt
    accentForeground: 'hsl(204 5% 90%)', // accent-foreground
    background: 'hsl(204 50% 10%)', // background
    border: 'hsl(204 30% 50%)', // border
    card: 'hsl(204 50% 10%)', // card
    cardForeground: 'hsl(204 5% 90%)', // card-foreground
    destructive: 'hsl(0 51% 50%)', // destructive
    destructiveForeground: 'hsl(204 5% 90%)', // destructive-foreground
    foreground: 'hsl(204 5% 90%)', // foreground
    input: 'hsl(204 30% 50%)', // input
    muted: 'hsl(166 30% 25%)', // muted
    mutedForeground: 'hsl(204 5% 65%)', // muted-foreground
    popover: 'hsl(204 50% 5%)', // popover
    popoverForeground: 'hsl(204 5% 90%)', // popover-foreground
    primary: 'hsl(204 100% 26.9%)', // primary
    primaryForeground: 'hsl(0 0% 100%)', // primary-foreground
    radius: '1rem', // radius
    ring: 'hsl(204 100% 26.9%)', // ring
    secondary: 'hsl(204 30% 20%)', // secondary
    secondaryForeground: 'hsl(0 0% 100%)', // secondary-foreground
    tertiaryForeground: 'hsl(21 69% 73%)',
    tertiary: 'hsl(21 10% 90%)',
    text: 'hsl(204 5% 90%)', // text
  },
};

export const BADGE_COLOR_MAP: Record<SubscriptionLevel | 'DEFAULT', 'default' | 'accent' | 'secondary' | 'destructive' | 'outline' | 'tertiary'> = {
  FREE: 'tertiary',
  MONTHLY: 'accent',
  ANNUAL: 'default',
  LIFE: 'default',
  DEFAULT: 'default',
};