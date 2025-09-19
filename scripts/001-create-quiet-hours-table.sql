-- Create quiet_hours table for storing user quiet hour blocks
CREATE TABLE IF NOT EXISTS quiet_hours (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  email VARCHAR(255) NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_quiet_hours_user_id ON quiet_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_quiet_hours_start_time ON quiet_hours(start_time);
CREATE INDEX IF NOT EXISTS idx_quiet_hours_notification ON quiet_hours(notification_sent, start_time);

-- Add constraint to prevent overlapping blocks for the same user
CREATE OR REPLACE FUNCTION check_no_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM quiet_hours 
    WHERE user_id = NEW.user_id 
    AND id != COALESCE(NEW.id, -1)
    AND (
      (NEW.start_time >= start_time AND NEW.start_time < end_time) OR
      (NEW.end_time > start_time AND NEW.end_time <= end_time) OR
      (NEW.start_time <= start_time AND NEW.end_time >= end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Quiet hour blocks cannot overlap for the same user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_overlap_trigger
  BEFORE INSERT OR UPDATE ON quiet_hours
  FOR EACH ROW EXECUTE FUNCTION check_no_overlap();
