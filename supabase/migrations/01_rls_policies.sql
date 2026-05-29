-- RLS baseline (v0).
-- Our Prisma client connects as the superuser, which has BYPASSRLS — so these
-- policies do not block our Server Actions. They protect against leaked
-- non-superuser credentials and act as defense-in-depth.
--
-- Phase 2 will add per-user policies that read the user id from a session
-- variable set by the Next.js Server Action layer.

-- ============================================================
-- Public-read content (scripture, chapters, commentaries)
-- ============================================================

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON chapters;
CREATE POLICY "public_read" ON chapters FOR SELECT USING (true);

ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON verses;
CREATE POLICY "public_read" ON verses FOR SELECT USING (true);

ALTER TABLE commentaries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON commentaries;
CREATE POLICY "public_read" ON commentaries FOR SELECT USING (true);

-- ============================================================
-- AI cache (no end-user direct access; all via Server Actions)
-- ============================================================

ALTER TABLE ai_query_cache ENABLE ROW LEVEL SECURITY;
-- No policies. Default deny. Server Actions (as superuser) bypass.

-- ============================================================
-- User-owned data (only owner reads/writes; checked in app layer for now)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
-- No policies on the above — default deny.
-- Phase 2 TODO: add per-user policies based on current_setting('app.user_id').
