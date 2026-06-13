
-- Create block_actions table
CREATE TABLE block_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ip_address INET NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE block_actions ENABLE ROW LEVEL SECURITY;

-- Create policy allowing authenticated users to read
CREATE POLICY "Authenticated users can read block actions"
  ON block_actions
  FOR SELECT
  TO authenticated
  USING (true);
