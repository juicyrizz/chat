/*
  # Create stories table

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `image_url` (text, optional)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `stories` table
    - Add policies for users to read all active stories and manage their own
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Allow users to read all active stories
CREATE POLICY "Users can read active stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (expires_at > now());

-- Allow users to insert their own stories
CREATE POLICY "Users can insert own stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own stories
CREATE POLICY "Users can update own stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own stories
CREATE POLICY "Users can delete own stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);