/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `receiver_id` (uuid, references profiles)
      - `content` (text)
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for users to read and send messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CHECK (sender_id != receiver_id)
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to read messages they sent or received
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Allow users to send messages
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Allow users to update read status of messages they received
CREATE POLICY "Users can update received messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS messages_sender_receiver_idx ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);