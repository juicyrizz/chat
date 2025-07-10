/*
  # Create likes table

  1. New Tables
    - `likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `post_id` (uuid, references posts)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `likes` table
    - Add policies for users to manage their own likes
*/

CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow users to read all likes
CREATE POLICY "Users can read all likes"
  ON likes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own likes
CREATE POLICY "Users can insert own likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own likes
CREATE POLICY "Users can delete own likes"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON likes(post_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes(user_id);