/*
  # Create friendships table

  1. New Tables
    - `friendships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `friend_id` (uuid, references profiles)
      - `status` (enum: pending, accepted, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `friendships` table
    - Add policies for users to manage their own friendships
*/

-- Create enum for friendship status
DO $$ BEGIN
  CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status friendship_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Allow users to read friendships they're involved in
CREATE POLICY "Users can read own friendships"
  ON friendships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Allow users to insert friendship requests
CREATE POLICY "Users can send friend requests"
  ON friendships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update friendships they're involved in
CREATE POLICY "Users can update own friendships"
  ON friendships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Allow users to delete friendships they're involved in
CREATE POLICY "Users can delete own friendships"
  ON friendships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create trigger for friendships
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();