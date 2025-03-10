-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  image TEXT,
  name TEXT,
  credits TEXT,
  subscription TEXT,
  token_identifier TEXT NOT NULL,
  user_id TEXT
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Enable realtime
alter publication supabase_realtime add table public.users;