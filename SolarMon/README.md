# SolarFlow - Solar Monitoring & Analytics Platform

A comprehensive, production-ready solar monitoring and analytics SaaS platform built with modern web technologies. Monitor real-time solar generation, manage devices, track performance metrics, and receive intelligent alerts for your solar installations.

![SolarFlow Dashboard](https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=400&fit=crop)

## 🌟 Features

### 📊 Real-time Monitoring Dashboard

- **Live Power Generation**: Track real-time power output from all inverters
- **Performance Metrics**: Monitor voltage, current, efficiency, and energy yield
- **Interactive Charts**: Hourly, daily, weekly, and monthly generation graphs
- **Weather Integration**: Overlay weather conditions affecting generation
- **Performance Ratios**: CUF, PR, and efficiency calculations

### 🏢 Multi-Tenant Architecture

- **Role-Based Access Control**: Super Admin, EPC Admin, Client, and Technician roles
- **Site Management**: Hierarchical organization of companies → sites → devices
- **Device Configuration**: Support for multiple inverter brands and communication protocols
- **Scalable Infrastructure**: Built for EPCs, resellers, and end customers

### 🚨 Intelligent Alert System

- **Automated Fault Detection**: No generation during sun hours, voltage anomalies
- **Customizable Notifications**: Email, SMS, Telegram, WhatsApp integration
- **Alert Management**: Acknowledgment, resolution tracking, and escalation
- **Performance Degradation**: Early warning system for efficiency drops

### 📈 Advanced Analytics & Reporting

- **Automated Reports**: Daily, weekly, monthly PDF generation
- **Performance Analysis**: Trend analysis and comparative studies
- **Energy Forecasting**: AI-powered generation predictions
- **Data Export**: Comprehensive data export capabilities

### 🔧 Device & IoT Integration

- **Multi-Protocol Support**: Modbus TCP, MQTT, HTTP APIs
- **Device Management**: Add, configure, and monitor inverters and loggers
- **Real-time Communication**: Live device status and health monitoring
- **Offline Buffer**: Local data logging with batch synchronization

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **React Router 6** (SPA mode)
- **TailwindCSS 3** with custom solar theme
- **Radix UI** component library
- **Recharts** for data visualization
- **Vite** for build tooling

### Backend Architecture (Recommended)

- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - Authentication and authorization
- **Supabase Edge Functions** - Serverless functions for automation
- **Row Level Security** - Multi-tenant data isolation

### Communication Protocols

- **Modbus TCP** - Industry standard for inverter communication
- **MQTT** - Lightweight messaging for IoT devices
- **HTTP/REST APIs** - Modern web-based device integration
- **WebSocket** - Real-time data streaming

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for backend)
- Solar inverter/device access (for real integration)

### Installation

1. **Clone and Install**

```bash
git clone <repository-url>
cd solar-monitoring-platform
npm install
```

2. **Start Development Server**

```bash
npm run dev
```

3. **Access the Application**

- Open http://localhost:8080 in your browser
- Use demo credentials: `demo@solarflow.com` / `demo123`

### Database Setup (Supabase)

1. **Create Supabase Project**

   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project

2. **Run Database Schema**

   - Use the SQL from `docs/database-schema.md`
   - Set up Row Level Security policies
   - Configure authentication settings

3. **Environment Variables**

```bash
# Add to your environment
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📋 Database Schema

The platform uses a comprehensive PostgreSQL schema designed for scalability:

- **profiles** - User management with role-based access
- **companies** - EPC/reseller organizations
- **sites** - Solar installation sites
- **devices** - Inverters, loggers, and monitoring equipment
- **power_readings** - Time-series data for monitoring
- **weather_data** - Environmental conditions
- **alerts** - Fault detection and notifications
- **reports** - Automated reporting system

See `docs/database-schema.md` for complete schema details.

## 🎨 Design System

### Color Palette

- **Primary**: Solar Blue (`hsl(195, 100%, 35%)`)
- **Accent**: Solar Orange (`hsl(45, 100%, 60%)`)
- **Success**: Energy Green (`hsl(142, 76%, 36%)`)
- **Warning**: Alert Orange (`hsl(38, 92%, 50%)`)

### Components

- Consistent design language across all pages
- Responsive layout for desktop, tablet, and mobile
- Dark/light theme support
- Accessible UI components

## 📱 Pages & Features

### Dashboard (`/`)

- Real-time power generation monitoring
- Key performance metrics
- Device status overview
- Weather conditions
- Recent alerts summary

### Sites Management (`/sites`)

- Comprehensive site listing and search
- Site performance overview
- Device management
- Maintenance scheduling

### Authentication (`/login`)

- Email/password authentication
- Magic link support
- Role-based redirection
- Demo credentials for testing

### Coming Soon

- Device Management (`/devices`)
- Analytics & Reports (`/analytics`, `/reports`)
- Alert Management (`/alerts`)
- User Management (`/users`)
- System Settings (`/settings`)

## 🔌 Integration Guide

### Adding New Inverter Support

1. **Create Device Configuration**

```typescript
const newInverterConfig = {
  brand: "SolarEdge",
  model: "SE10K",
  protocol: "modbus_tcp",
  registers: {
    power: 40083,
    voltage: 40079,
    current: 40081,
  },
};
```

2. **Implement Data Polling**

```typescript
// In Supabase Edge Function
const pollInverterData = async (device) => {
  const client = new ModbusRTU();
  await client.connectTCP(device.ip_address);

  const power = await client.readHoldingRegisters(40083, 1);
  const voltage = await client.readHoldingRegisters(40079, 1);

  // Store in database
  await supabase.from("power_readings").insert({
    device_id: device.id,
    power_kw: power.data[0] / 1000,
    voltage_v: voltage.data[0] / 10,
  });
};
```

### Alert Configuration

Create custom alert rules in Supabase Edge Functions:

```sql
-- Custom alert detection
CREATE OR REPLACE FUNCTION detect_custom_alerts()
RETURNS void AS $$
BEGIN
  -- Detect inverter offline for > 1 hour during daylight
  INSERT INTO alerts (site_id, device_id, type, severity, title)
  SELECT d.site_id, d.id, 'device_offline', 'critical', 'Inverter Offline'
  FROM devices d
  WHERE d.type = 'inverter'
  AND d.last_seen < NOW() - INTERVAL '1 hour'
  AND EXTRACT(hour FROM NOW()) BETWEEN 8 AND 18;
END;
$$ LANGUAGE plpgsql;
```

## 🔒 Security & Compliance

### Data Security

- **Row Level Security** enforced at database level
- **API Authentication** via Supabase Auth tokens
- **HTTPS Encryption** for all communications
- **Data Isolation** between tenants

### Compliance

- **GDPR Ready** - Data export and deletion capabilities
- **SOC 2 Compatible** - Audit logging and access controls
- **Industry Standards** - Follows IEC 61724 for solar monitoring

## 🚦 Performance & Scalability

### Optimization Features

- **Real-time Subscriptions** via Supabase Realtime
- **Efficient Querying** with proper indexing
- **Data Archival** for historical records
- **CDN Integration** for static assets

### Monitoring

- **Application Performance** monitoring
- **Database Query** optimization
- **Error Tracking** and alerting
- **Usage Analytics** and reporting

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts** - Beautiful and composable charts
- **Radix UI** - Low-level UI primitives
- **Supabase** - Backend infrastructure
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## 📞 Support

For support and questions:

- 📧 Email: support@solarflow.com
- 📖 Documentation: [docs.solarflow.com](https://docs.solarflow.com)
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord Server

---

**Built with ❤️ for the renewable energy industry**
