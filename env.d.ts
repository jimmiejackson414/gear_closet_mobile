/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_ORIGIN_URL: string;

    // Cloudinary
    EXPO_PUBLIC_CLOUDINARY_API_KEY: string;
    EXPO_PUBLIC_CLOUDINARY_API_SECRET: string;
    EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    EXPO_PUBLIC_CLOUDINARY_AUTH_PAGES_PATH: string;
    EXPO_PUBLIC_CLOUDINARY_AVATARS_PATH: string;

    // Application
    EXPO_PUBLIC_JWT_SECRET: string;
    EXPO_PUBLIC_TOKEN_IDENTIFIER: string;
    EXPO_PUBLIC_COOKIE_KEY: string;

    // Facebook Auth
    EXPO_PUBLIC_FACEBOOK_APP_ID: string;
    EXPO_PUBLIC_FACEBOOK_APP_SECRET: string;
    EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN: string;

    // Apple Auth
    EXPO_PUBLIC_APPLE_CLIENT_ID: string;

    // Google Auth and Analytics
    EXPO_PUBLIC_GOOGLE_API_SECRET: string;
    EXPO_PUBLIC_GOOGLE_CLIENT_ID: string;
    EXPO_PUBLIC_GOOGLE_ANALYTICS_ID: string;

    // Supabase
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_KEY: string;
    EXPO_PUBLIC_SUPABASE_SERVICE_KEY: string;

    // Stripe
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    EXPO_STRIPE_SECRET: string;
    EXPO_STRIPE_WEBHOOK_SECRET: string;

    // Forums
    EXPO_PUBLIC_FORUMS_URL: string;
    EXPO_FORUMS_API_KEY: string;
    EXPO_FORUMS_API_USERNAME: string;

    // Cypress
    EXPO_PLAYWRIGHT_BASE_URL: string;
    EXPO_PLAYWRIGHT_USERNAME: string;
    EXPO_PLAYWRIGHT_PASSWORD: string;

    // Sendgrid
    EXPO_SENDGRID_KEY: string;
  }
}