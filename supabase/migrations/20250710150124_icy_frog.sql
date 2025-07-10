/*
  # Create profile automatically on user signup

  1. New Functions
    - `handle_new_user()` - Automatically creates a profile when a new user signs up
  
  2. New Triggers
    - Trigger on auth.users table to call handle_new_user function
  
  3. Security
    - Function runs with security definer privileges to bypass RLS during profile creation
*/

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, bio)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'bio'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();