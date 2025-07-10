/*
  # Create posts table

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `posts` table
    - Add policies for users to read all posts and manage their own
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow users to read all posts
CREATE POLICY "Users can read all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own posts
CREATE POLICY "Users can insert own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();