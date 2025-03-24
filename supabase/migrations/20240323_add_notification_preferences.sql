-- Add notification_preferences column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN notification_preferences JSONB DEFAULT '{"blood_scarcity": true}'::jsonb;

-- Add RLS policy for notification_preferences
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update their own notification preferences"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add comment to explain the column
COMMENT ON COLUMN user_profiles.notification_preferences IS 'JSON object containing user notification preferences. Example: {"blood_scarcity": true}'; 