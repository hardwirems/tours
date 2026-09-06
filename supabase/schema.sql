-- ---------------------------------------------------------------------------
-- Supabase schema — run this in the Supabase SQL editor to set up the tables.
--
-- Tables:
--   clicks       — first-party click records from /go/ redirects
--   leads        — inquiry/lead form submissions with attribution
--   affiliate_mappings — slug → URL mapping (the source of truth for /go/)
--
-- RLS (Row-Level Security): these tables allow anonymous INSERT (so the
-- web route handlers and the Cloudflare Worker can insert without auth).
-- SELECT is restricted — only you (via the anon key with proper RLS) or
-- the dashboard can read. Adjust to your needs.
-- ---------------------------------------------------------------------------

-- Enable the UUID extension.
CREATE EXTENSION IF NOT EXISTS "uuid-osgen";

-- ---------------------------------------------------------------------------
-- clicks
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,                    -- e.g. 'getyourguide/zip-lining-guanacaste'
  source_page TEXT,                      -- the page the click came from
  session_id TEXT,
  user_agent TEXT,
  country TEXT,
  ip_hash TEXT,                          -- hashed IP (no raw IP stored)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anonymous INSERT (so the /go/ route handler can record clicks).
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow anonymous inserts on clicks"
  ON clicks FOR INSERT
  WITH CHECK (true);

-- Allow the owner (you) to SELECT.
CREATE POLICY "allow owner select on clicks"
  ON clicks FOR SELECT
  USING (auth.role() = 'owner');

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  tour_slug TEXT,
  source TEXT,                           -- e.g. 'tour_detail', 'home', 'compare'
  affiliate_ref TEXT,                    -- the guanacaste_go cookie value
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow anonymous inserts on leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow owner select on leads"
  ON leads FOR SELECT
  USING (auth.role() = 'owner');

-- ---------------------------------------------------------------------------
-- affiliate_mappings
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS affiliate_mappings (
  slug TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  program TEXT,                          -- e.g. 'getyourguide', 'viator'
  commission_rate REAL,                  -- e.g. 0.08 for 8%
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE affiliate_mappings ENABLE ROW LEVEL SECURITY;

-- In production, restrict INSERT/UPDATE to the owner.
-- For the scaffold, allow anonymous inserts so you can seed from a script.
CREATE POLICY "allow owner insert on affiliate_mappings"
  ON affiliate_mappings FOR INSERT
  WITH CHECK (auth.role() = 'owner');

CREATE POLICY "allow owner update on affiliate_mappings"
  ON affiliate_mappings FOR UPDATE
  USING (auth.role() = 'owner');

CREATE POLICY "allow anon select on affiliate_mappings"
  ON affiliate_mappings FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- Seed the affiliate_mappings table with the current URLs.
-- ---------------------------------------------------------------------------

INSERT INTO affiliate_mappings (slug, url, program, commission_rate) VALUES
  ('getyourguide/zip-lining-guanacaste', 'https://www.getyourguide.com/guanacaste-l170254/adventure-tours-c86/zip-line-canopy-tours-c49/sku1005799/', 'getyourguide', 0.08),
  ('getyourguide/catamaran-sunset-tamarindo', 'https://www.getyourguide.com/tamarindo-l169319/boat-tours-c93/plana-catamaran-private-sailing-tour-t49/sku1005795/', 'getyourguide', 0.08),
  ('getyourguide/atv-tamarindo', 'https://www.getyourguide.com/tamarindo-l169319/adventure-tours-c86/atv-beach-and-mountain-tour-t49/sku1005801/', 'getyourguide', 0.08),
  ('getyourguide/snorkeling-las-catalinas', 'https://www.getyourguide.com/tamarindo-l169319/boat-tours-c93/snorkeling-at-las-catalinas-islands-t49/sku1005796/', 'getyourguide', 0.08),
  ('getyourguide/rincon-de-la-vieja-volcano', 'https://www.getyourguide.com/santa-rosa-de-guanacaste-l171745/volcano-hiking-tours-c154/rincon-de-la-vieja-volcano-hike-hot-springs-t49/sku1006123/', 'getyourguide', 0.08),
  ('getyourguide/palo-verde-birdwatching', 'https://www.getyourguide.com/liberia-l170255/wildlife-tours-c126/palo-verde-national-park-t49/sku1005987/', 'getyourguide', 0.08),
  ('getyourguide/sport-fishing-guanacaste', 'https://www.getyourguide.com/flamingo-l170810/fishing-tours-c169/sport-fishing-charter-t49/sku2901234/', 'getyourguide', 0.08),
  ('getyourguide/horseback-riding-guanacaste', 'https://www.getyourguide.com/guanacaste-l170254/horse-riding-tours-c155/horseback-riding-tours-c49/sku1005802/', 'getyourguide', 0.08),
  ('getyourguide/liberia-town-tour', 'https://www.getyourguide.com/liberia-l170255/historical-sightseeing-tours-c30/liberia-historic-town-tour-t49/sku1005803/', 'getyourguide', 0.08),
  ('getyourguide/nicaragua-day-trip', 'https://www.getyourguide.com/liberia-l170255/day-trips-c88/nicaragua-day-trip-granada-san-juan-del-sur-t49/sku1005804/', 'getyourguide', 0.08),
  ('getyourguide/guanacaste-adventure-week', 'https://www.getyourguide.com/guanacaste-l170254/multi-day-tours-c94/guanacaste-adventure-week-t49/sku1005805/', 'getyourguide', 0.08),
  ('viator/ziplining-guanacaste', 'https://www.viator.com/Guanacaste-attractions-c2417079', 'viator', 0.08),
  ('viator/catamaran-tamarindo', 'https://www.viator.com/Tamarindo-attractions-c2417099', 'viator', 0.08),
  ('viator/atv-tamarindo', 'https://www.viator.com/Tamarindo-attractions-c2417099', 'viator', 0.08),
  ('bookingcom/liberia-hotels', 'https://www.booking.com/search?ss=Liberia%2C+Costa+Rica', 'bookingcom', 0.25),
  ('bookingcom/tamarindo-hotels', 'https://www.booking.com/search?ss=Tamarindo%2C+Costa+Rica', 'bookingcom', 0.25),
  ('discovercars/liberia', 'https://www.discovercars.com/en/car-rental/costa-rica/liberia', 'discovercars', 0.07),
  ('discovercars/tamarindo', 'https://www.discovercars.com/en/car-rental/costa-rica/tamarindo', 'discovercars', 0.07),
  ('airalo/costa-rica', 'https://www.airalo.com/com/regions/latam/co', 'airalo', 0.20)
ON CONFLICT (slug) DO UPDATE SET
  url = EXCLUDED.url,
  program = EXCLUDED.program,
  commission_rate = EXCLUDED.commission_rate,
  updated_at = NOW();
