-- Phase 1.B — Postgres full-text search on verse translations.
-- Idempotent: safe to re-run.

-- Drop existing if present (for safe re-run during development).
DROP INDEX IF EXISTS verse_translations_search_idx;
ALTER TABLE verse_translations DROP COLUMN IF EXISTS search_tsv;

-- Add generated tsvector column.
-- Using 'simple' config: works for both English and Hindi without language-aware
-- stemming. English-specific stemming is a Phase 1.C+ enhancement.
ALTER TABLE verse_translations
  ADD COLUMN search_tsv tsvector
    GENERATED ALWAYS AS (
      to_tsvector('simple', coalesce(text, ''))
    ) STORED;

-- GIN index for fast text search.
CREATE INDEX verse_translations_search_idx
  ON verse_translations USING GIN(search_tsv);

-- Sanity check: confirm count of indexed rows matches verse_translations rowcount.
DO $$
DECLARE
  expected INTEGER;
  indexed  INTEGER;
BEGIN
  SELECT COUNT(*) INTO expected FROM verse_translations;
  SELECT COUNT(*) INTO indexed FROM verse_translations WHERE search_tsv IS NOT NULL;
  RAISE NOTICE 'verse_translations: % expected, % indexed', expected, indexed;
END $$;
