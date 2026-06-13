
-- Create investigation_notes table
CREATE TABLE investigation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  threat_id UUID,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE investigation_notes ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own notes
CREATE POLICY "Users can read their own notes"
  ON investigation_notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own notes
CREATE POLICY "Users can insert their own notes"
  ON investigation_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own notes
CREATE POLICY "Users can update their own notes"
  ON investigation_notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON investigation_notes
  FOR DELETE
  USING (auth.uid() = user_id);
