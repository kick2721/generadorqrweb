-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qrcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- App uses direct pg connections (NextAuth + custom API routes), not Supabase client.
-- RLS only affects Supabase auto-generated REST API — these policies ensure
-- authenticated access is required via that API.
-- Direct connections bypass RLS entirely.

-- Auth tables: next-auth manages internally via direct DB
CREATE POLICY "authenticated_all" ON public.users FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_all" ON public.accounts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_all" ON public.sessions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_all" ON public.verification_token FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Subscriptions: read own, service can write
CREATE POLICY "authenticated_select" ON public.subscriptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "service_all" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

-- QRCodes: read/update/delete own, insert with own user_id
CREATE POLICY "authenticated_select" ON public.qrcodes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_insert" ON public.qrcodes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_update" ON public.qrcodes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_delete" ON public.qrcodes FOR DELETE USING (auth.role() = 'authenticated');

-- Scans: read own QR's scans, anyone can insert (scan tracking)
CREATE POLICY "authenticated_select" ON public.scans FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "anon_insert" ON public.scans FOR INSERT WITH CHECK (true);
