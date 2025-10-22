-- Add created_at column to department_transfers if it's missing
-- Safe to run multiple times because of IF NOT EXISTS
ALTER TABLE public.department_transfers
  ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();

-- Optional: update existing NULLs (if any) to now()
-- UPDATE public.department_transfers SET created_at = now() WHERE created_at IS NULL;
