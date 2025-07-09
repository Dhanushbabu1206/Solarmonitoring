# Solar Monitoring Platform - Supabase Database Schema

## Overview

This document outlines the PostgreSQL database schema for the Solar Monitoring SaaS platform using Supabase.

## Tables

### 1. Users (auth.users extended with profiles)

```sql
-- Profiles table to extend Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'client',
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('super_admin', 'epc_admin', 'client', 'technician');
```

### 2. Companies (EPC/Reseller Organizations)

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type company_type NOT NULL DEFAULT 'epc',
  contact_email TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE company_type AS ENUM ('epc', 'reseller', 'client');
```

### 3. Sites (Solar Installations)

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id),
  owner_id UUID REFERENCES profiles(id),
  location JSONB NOT NULL, -- {lat, lng, address}
  capacity_kw DECIMAL(10,2),
  commissioning_date DATE,
  timezone TEXT DEFAULT 'UTC',
  status site_status DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE site_status AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned');
```

### 4. Devices (Inverters, Loggers, Meters)

```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type device_type NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  capacity_kw DECIMAL(10,2),
  communication_config JSONB, -- Modbus, MQTT, API settings
  status device_status DEFAULT 'online',
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE device_type AS ENUM ('inverter', 'logger', 'meter', 'weather_station');
CREATE TYPE device_status AS ENUM ('online', 'offline', 'fault', 'maintenance');
```

### 5. Power Readings (Time-series Data)

```sql
CREATE TABLE power_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  power_kw DECIMAL(10,3),
  voltage_v DECIMAL(8,2),
  current_a DECIMAL(8,2),
  frequency_hz DECIMAL(5,2),
  energy_kwh_daily DECIMAL(10,3),
  energy_kwh_total DECIMAL(15,3),
  temperature_c DECIMAL(5,2),
  efficiency_percent DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for time-series queries
CREATE INDEX idx_power_readings_device_timestamp ON power_readings(device_id, timestamp DESC);
CREATE INDEX idx_power_readings_timestamp ON power_readings(timestamp DESC);
```

### 6. Weather Data

```sql
CREATE TABLE weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  irradiance_wm2 DECIMAL(8,2),
  temperature_c DECIMAL(5,2),
  humidity_percent DECIMAL(5,2),
  wind_speed_ms DECIMAL(5,2),
  cloud_cover_percent DECIMAL(5,2),
  source TEXT DEFAULT 'api', -- 'api', 'sensor', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weather_data_site_timestamp ON weather_data(site_id, timestamp DESC);
```

### 7. Alerts and Faults

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  device_id UUID REFERENCES devices(id),
  type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  status alert_status DEFAULT 'open',
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

CREATE TYPE alert_type AS ENUM ('no_generation', 'low_performance', 'device_offline', 'voltage_anomaly', 'temperature_high', 'communication_failure');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'resolved', 'false_positive');
```

### 8. Reports

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  type report_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generated_by UUID REFERENCES profiles(id),
  file_url TEXT, -- Supabase storage URL
  data JSONB, -- Report summary data
  status report_status DEFAULT 'generated',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE report_type AS ENUM ('daily', 'weekly', 'monthly', 'annual', 'custom');
CREATE TYPE report_status AS ENUM ('generated', 'sent', 'failed');
```

### 9. Notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  alert_id UUID REFERENCES alerts(id),
  type notification_type NOT NULL,
  channel notification_channel NOT NULL,
  recipient TEXT NOT NULL, -- email, phone, telegram_id
  subject TEXT,
  content TEXT NOT NULL,
  status notification_status DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM ('alert', 'report', 'system', 'maintenance');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'telegram', 'whatsapp', 'push');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'bounced');
```

## Row Level Security (RLS) Policies

### Profiles

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Sites

```sql
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Super admins can see all sites
CREATE POLICY "Super admins can view all sites" ON sites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- EPC admins can see their company's sites
CREATE POLICY "EPC admins can view company sites" ON sites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.company_id = sites.company_id
      AND profiles.role = 'epc_admin'
    )
  );

-- Clients can see their own sites
CREATE POLICY "Clients can view own sites" ON sites
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.company_id = sites.company_id
    )
  );
```

## Functions and Triggers

### 1. Update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Alert detection function

```sql
CREATE OR REPLACE FUNCTION detect_performance_alerts()
RETURNS void AS $$
BEGIN
  -- Detect no generation during daylight hours
  INSERT INTO alerts (site_id, device_id, type, severity, title, description)
  SELECT DISTINCT
    d.site_id,
    d.id,
    'no_generation',
    'high',
    'No Power Generation Detected',
    'Device has not generated power during expected daylight hours'
  FROM devices d
  WHERE d.type = 'inverter'
  AND d.status = 'online'
  AND NOT EXISTS (
    SELECT 1 FROM power_readings pr
    WHERE pr.device_id = d.id
    AND pr.timestamp >= NOW() - INTERVAL '2 hours'
    AND pr.power_kw > 0.1
  )
  AND EXTRACT(hour FROM NOW()) BETWEEN 8 AND 18; -- Daylight hours
END;
$$ LANGUAGE plpgsql;
```

## Indexes for Performance

```sql
-- Time-series data indexes
CREATE INDEX idx_power_readings_device_time ON power_readings(device_id, timestamp DESC);
CREATE INDEX idx_weather_data_site_time ON weather_data(site_id, timestamp DESC);

-- Alert management indexes
CREATE INDEX idx_alerts_status_created ON alerts(status, triggered_at DESC);
CREATE INDEX idx_alerts_site_status ON alerts(site_id, status);

-- Device management indexes
CREATE INDEX idx_devices_site_status ON devices(site_id, status);
CREATE INDEX idx_devices_serial ON devices(serial_number);
```

This schema supports:

- Multi-tenant architecture with proper RLS
- Time-series data for monitoring
- Alert and notification system
- Role-based access control
- Audit trails and reporting
- Scalable device management
- Weather data integration
