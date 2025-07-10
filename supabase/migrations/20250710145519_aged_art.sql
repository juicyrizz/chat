/*
  # Create comments table

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `post_id` (uuid, references posts)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `comments` table
    - Add policies for users to read all comments and manage their own
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow users to read all comments
CREATE POLICY "Users can read all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert comments
CREATE POLICY "Users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for comments
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);