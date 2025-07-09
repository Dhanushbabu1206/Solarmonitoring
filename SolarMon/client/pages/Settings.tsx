import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Plus,
  Edit,
  Trash2,
  Key,
  Wifi,
  Database,
  Shield,
  Bell,
  Download,
  FileSpreadsheet,
  TestTube,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Mock API integrations data
const mockAPIIntegrations = [
  {
    id: "1",
    name: "SolarEdge API",
    type: "inverter",
    brand: "SolarEdge",
    endpoint: "https://monitoringapi.solaredge.com",
    apiKey: "SE1234****",
    status: "active",
    lastSync: "2024-12-01T11:30:00Z",
    sitesConnected: 3,
    description: "Official SolarEdge monitoring API",
  },
  {
    id: "2",
    name: "Huawei FusionSolar",
    type: "inverter",
    brand: "Huawei",
    endpoint: "https://eu5.fusionsolar.huawei.com",
    apiKey: "HW5678****",
    status: "active",
    lastSync: "2024-12-01T11:25:00Z",
    sitesConnected: 2,
    description: "Huawei FusionSolar cloud platform API",
  },
  {
    id: "3",
    name: "Fronius Solar.web",
    type: "inverter",
    brand: "Fronius",
    endpoint: "https://www.solarweb.com/Api/",
    apiKey: "FR9012****",
    status: "error",
    lastSync: "2024-11-30T14:20:00Z",
    sitesConnected: 1,
    description: "Fronius Solar.web live monitoring API",
  },
  {
    id: "4",
    name: "Weather API",
    type: "weather",
    brand: "OpenWeatherMap",
    endpoint: "https://api.openweathermap.org/data/2.5",
    apiKey: "OW3456****",
    status: "active",
    lastSync: "2024-12-01T11:30:00Z",
    sitesConnected: 5,
    description: "Weather data for irradiance calculations",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success";
    case "error":
      return "bg-destructive/10 text-destructive";
    case "inactive":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "inverter":
      return "bg-primary/10 text-primary";
    case "weather":
      return "bg-blue-500/10 text-blue-500";
    case "meter":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - time.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// Download functions
const downloadAPIConfigExcel = () => {
  const csvContent = [
    [
      "Name",
      "Type",
      "Brand",
      "Endpoint",
      "Status",
      "Sites Connected",
      "Last Sync",
    ].join(","),
    ...mockAPIIntegrations.map((api) =>
      [
        api.name,
        api.type,
        api.brand,
        api.endpoint,
        api.status,
        api.sitesConnected,
        formatTimeAgo(api.lastSync),
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `api_integrations_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

const testAPIConnection = (apiId: string) => {
  // In real implementation, this would test the actual API connection
  alert(`Testing connection for API ${apiId}...`);
};

const setupAPISync = (apiId: string, apiType: string) => {
  // Different sync configurations for different API types
  const syncOptions = {
    inverter: {
      interval: "5 minutes",
      dataPoints: ["power", "voltage", "current", "energy", "temperature"],
      schedule: "Continuous during daylight hours",
    },
    weather: {
      interval: "15 minutes",
      dataPoints: ["irradiance", "temperature", "humidity", "wind_speed"],
      schedule: "24/7",
    },
    meter: {
      interval: "1 minute",
      dataPoints: ["energy_import", "energy_export", "power_factor"],
      schedule: "24/7",
    },
  };

  const config =
    syncOptions[apiType as keyof typeof syncOptions] || syncOptions.inverter;
  alert(
    `Setting up ${apiType} sync:\n- Interval: ${config.interval}\n- Data: ${config.dataPoints.join(", ")}\n- Schedule: ${config.schedule}`,
  );
};

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">
                  Configure system settings and API integrations
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="api" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api">API Integrations</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-6">
              {/* API Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total APIs
                        </p>
                        <p className="text-2xl font-bold">
                          {mockAPIIntegrations.length}
                        </p>
                      </div>
                      <Database className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold text-success">
                          {
                            mockAPIIntegrations.filter(
                              (api) => api.status === "active",
                            ).length
                          }
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Errors</p>
                        <p className="text-2xl font-bold text-destructive">
                          {
                            mockAPIIntegrations.filter(
                              (api) => api.status === "error",
                            ).length
                          }
                        </p>
                      </div>
                      <XCircle className="h-8 w-8 text-destructive" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* API Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>API Integrations</CardTitle>
                      <CardDescription>
                        Manage inverter APIs and external data sources
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={downloadAPIConfigExcel}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add API
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add New API Integration</DialogTitle>
                            <DialogDescription>
                              Configure a new inverter or data source API
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="api-name">Name</Label>
                                <Input
                                  id="api-name"
                                  placeholder="e.g., SolarEdge Site 1"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="api-type">Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="inverter">
                                      Inverter API
                                    </SelectItem>
                                    <SelectItem value="weather">
                                      Weather API
                                    </SelectItem>
                                    <SelectItem value="meter">
                                      Energy Meter
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="api-brand">Brand</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select brand" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="solaredge">
                                      SolarEdge
                                    </SelectItem>
                                    <SelectItem value="huawei">
                                      Huawei
                                    </SelectItem>
                                    <SelectItem value="fronius">
                                      Fronius
                                    </SelectItem>
                                    <SelectItem value="abb">ABB</SelectItem>
                                    <SelectItem value="sma">SMA</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="api-endpoint">
                                  API Endpoint
                                </Label>
                                <Input
                                  id="api-endpoint"
                                  placeholder="https://api.example.com"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="api-key">API Key</Label>
                              <Input
                                id="api-key"
                                type="password"
                                placeholder="Enter API key"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="api-description">
                                Description
                              </Label>
                              <Textarea
                                id="api-description"
                                placeholder="Brief description of this integration"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>
                                <TestTube className="h-4 w-4 mr-2" />
                                Test & Save
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sites</TableHead>
                          <TableHead>Last Sync</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAPIIntegrations.map((api) => (
                          <TableRow key={api.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{api.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {api.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={getTypeColor(api.type)}
                              >
                                {api.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{api.brand}</TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={getStatusColor(api.status)}
                              >
                                {api.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{api.sitesConnected}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatTimeAgo(api.lastSync)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => testAPIConnection(api.id)}
                                  title="Test Connection"
                                >
                                  <TestTube className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setupAPISync(api.id, api.type)}
                                  title="Setup Sync"
                                >
                                  <SettingsIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Settings</CardTitle>
                  <CardDescription>
                    Configure alert thresholds and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Alert Thresholds</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="power-threshold">
                          Low Power Threshold (%)
                        </Label>
                        <Input
                          id="power-threshold"
                          type="number"
                          defaultValue="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="efficiency-threshold">
                          Low Efficiency Threshold (%)
                        </Label>
                        <Input
                          id="efficiency-threshold"
                          type="number"
                          defaultValue="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temp-threshold">
                          High Temperature Threshold (°C)
                        </Label>
                        <Input
                          id="temp-threshold"
                          type="number"
                          defaultValue="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offline-threshold">
                          Device Offline Timeout (minutes)
                        </Label>
                        <Input
                          id="offline-threshold"
                          type="number"
                          defaultValue="30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-alerts">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts via email
                          </p>
                        </div>
                        <Checkbox id="email-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-alerts">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive critical alerts via SMS
                          </p>
                        </div>
                        <Checkbox id="sms-alerts" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="telegram-alerts">Telegram Bot</Label>
                          <p className="text-sm text-muted-foreground">
                            Connect Telegram for instant alerts
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="webhook-alerts">
                            Webhook Integration
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Send alerts to custom webhook URL
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Setup
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Report Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="daily-reports">
                          Daily Performance Reports
                        </Label>
                        <Select defaultValue="enabled">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weekly-reports">
                          Weekly Summary Reports
                        </Label>
                        <Select defaultValue="enabled">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="monthly-reports">
                          Monthly Analysis Reports
                        </Label>
                        <Select defaultValue="enabled">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button>Save Alert Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage access control and security policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Password Policy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Minimum Password Length</Label>
                          <p className="text-sm text-muted-foreground">
                            Characters required
                          </p>
                        </div>
                        <Select defaultValue="8">
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Special Characters</Label>
                          <p className="text-sm text-muted-foreground">
                            !@#$%^&* etc.
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Numbers</Label>
                          <p className="text-sm text-muted-foreground">
                            At least one digit
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Password Expiry</Label>
                          <p className="text-sm text-muted-foreground">
                            Force password change
                          </p>
                        </div>
                        <Select defaultValue="90">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">Never</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Access Control</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Require 2FA for all users
                          </p>
                        </div>
                        <Checkbox />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Session Timeout</Label>
                          <p className="text-sm text-muted-foreground">
                            Auto-logout inactive users
                          </p>
                        </div>
                        <Select defaultValue="240">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                            <SelectItem value="480">8 hours</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>IP Whitelist</Label>
                          <p className="text-sm text-muted-foreground">
                            Restrict access by IP
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Audit & Logging</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Login Attempts Logging</Label>
                          <p className="text-sm text-muted-foreground">
                            Track all login attempts
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Data Access Logging</Label>
                          <p className="text-sm text-muted-foreground">
                            Log data exports and views
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Configuration Changes</Label>
                          <p className="text-sm text-muted-foreground">
                            Log all system changes
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button>Save Security Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic application and system configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">System Preferences</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Default Timezone</Label>
                        <Select defaultValue="utc">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="ist">
                              IST (Asia/Kolkata)
                            </SelectItem>
                            <SelectItem value="est">
                              EST (America/New_York)
                            </SelectItem>
                            <SelectItem value="pst">
                              PST (America/Los_Angeles)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="inr">INR (₹)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="units">Power Units</Label>
                        <Select defaultValue="kw">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kw">Kilowatts (kW)</SelectItem>
                            <SelectItem value="mw">Megawatts (MW)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Retention</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Raw Data Retention</Label>
                          <p className="text-sm text-muted-foreground">
                            How long to keep detailed readings
                          </p>
                        </div>
                        <Select defaultValue="1y">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6m">6 months</SelectItem>
                            <SelectItem value="1y">1 year</SelectItem>
                            <SelectItem value="2y">2 years</SelectItem>
                            <SelectItem value="5y">5 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Aggregated Data Retention</Label>
                          <p className="text-sm text-muted-foreground">
                            How long to keep summarized data
                          </p>
                        </div>
                        <Select defaultValue="forever">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2y">2 years</SelectItem>
                            <SelectItem value="5y">5 years</SelectItem>
                            <SelectItem value="10y">10 years</SelectItem>
                            <SelectItem value="forever">Forever</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Backup & Export</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Automatic Backup</Label>
                          <p className="text-sm text-muted-foreground">
                            Regular data backups
                          </p>
                        </div>
                        <Select defaultValue="daily">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Export Data</Label>
                          <p className="text-sm text-muted-foreground">
                            Download system backup
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button>Save General Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
