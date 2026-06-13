
-- Create threat_cache table
create table threat_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  source text not null,
  response jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Create indexes
create index idx_threat_cache_cache_key on threat_cache (cache_key);
create index idx_threat_cache_expires_at on threat_cache (expires_at);
create index idx_threat_cache_source on threat_cache (source);
