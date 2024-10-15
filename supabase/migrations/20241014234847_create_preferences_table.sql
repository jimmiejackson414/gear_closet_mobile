-- Create the enum type for preference groups
CREATE TYPE preference_group AS ENUM ('EMAIL', 'PUSH');

-- Create the preferences table
CREATE TABLE preferences (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preference_key VARCHAR(50) NOT NULL,
  preference_label VARCHAR(100) NOT NULL,
  preference_value BOOLEAN NOT NULL DEFAULT true,
  preference_group preference_group NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (profile_id, preference_key)
);