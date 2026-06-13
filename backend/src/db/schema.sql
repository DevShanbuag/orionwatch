-- OrionWatch Database Schema
-- Created for Supabase

-- 1. Threats Table
CREATE TABLE IF NOT EXISTS threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  indicator TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')) NOT NULL,
  country TEXT,
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threats_severity ON threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_created_at ON threats(created_at DESC);

-- 2. Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')) NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('Open', 'Investigating', 'Resolved', 'Closed')) NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at DESC);

-- 3. Feeds Table
CREATE TABLE IF NOT EXISTS feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT,
  source_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Blocked IPs Table
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  reason TEXT,
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
