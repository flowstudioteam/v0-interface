-- Migration: add UNIQUE constraint on visitors.session_id
-- Required for ON CONFLICT (session_id) DO UPDATE upsert pattern.
-- Safe to run multiple times — constraint is created only if it doesn't exist.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'visitors_session_id_key'
      AND conrelid = 'visitors'::regclass
  ) THEN
    ALTER TABLE visitors ADD CONSTRAINT visitors_session_id_key UNIQUE (session_id);
  END IF;
END;
$$;
