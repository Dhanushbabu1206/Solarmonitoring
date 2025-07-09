import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import {
  MetricCard,
  PowerGenerationCard,
  DeviceStatusGrid,
  WeatherCard,
} from "@/components/SolarMetrics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  Sun,
  Battery,
  Gauge,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for demonstration
const generateMockData = () => {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    let power = 0;

    // Generate realistic solar power curve
    if (hour >= 6 && hour <= 18) {
      const midday = 12;
      const maxPower = 2500;
      power =
        maxPower *
        Math.sin(((hour - 6) / 12) * Math.PI) *
        (0.8 + Math.random() * 0.4);
    }

    data.push({
      time: time.toISOString(),
      hour: time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      power: Math.max(0, power),
      voltage: 385 + Math.random() * 20,
      current: power > 0 ? power / 400 + Math.random() * 2 : 0,
      efficiency: power > 0 ? 85 + Math.random() * 10 : 0,
    });
  }

  return data;
};

const mockDevices = [
  {
    name: "Inverter 1",
    type: "String Inverter",
    status: "online",
    power: 850.5,
    capacity: 1000,
  },
  {
    name: "Inverter 2",
    type: "String Inverter",
    status: "online",
    power: 920.3,
    capacity: 1000,
  },
  {
    name: "Inverter 3",
    type: "String Inverter",
    status: "warning",
    power: 650.8,
    capacity: 1000,
  },
  {
    name: "Data Logger",
    type: "Communication",
    status: "online",
    power: 0,
    capacity: 0,
  },
  {
    name: "Weather Station",
    type: "Sensor",
    status: "online",
    power: 0,
    capacity: 0,
  },
  {
    name: "Inverter 4",
    type: "String Inverter",
    status: "offline",
    power: 0,
    capacity: 1000,
  },
];

const mockWeather = {
  irradiance: 875,
  temperature: 28,
  humidity: 45,
  windSpeed: 3.2,
  cloudCover: 15,
};

const mockAlerts = [
  {
    id: 1,
    type: "Low Performance",
    severity: "warning",
    device: "Inverter 3",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "Communication Error",
    severity: "critical",
    device: "Inverter 4",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "Temperature High",
    severity: "warning",
    device: "Inverter 2",
    time: "1 day ago",
  },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("24h");
  const [powerData] = useState(generateMockData());

  const currentPower = powerData[powerData.length - 1]?.power || 0;
  const dailyGeneration =
    powerData.reduce((sum, item) => sum + item.power, 0) / 1000; // Convert to MWh
  const peakPower = Math.max(...powerData.map((d) => d.power));
  const avgEfficiency =
    powerData
      .filter((d) => d.power > 0)
      .reduce((sum, item) => sum + item.efficiency, 0) /
    powerData.filter((d) => d.power > 0).length;

  const onlineDevices = mockDevices.filter((d) => d.status === "online").length;
  const totalCapacity = mockDevices.reduce((sum, d) => sum + d.capacity, 0);
  const currentOutput = mockDevices.reduce((sum, d) => sum + d.power, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Real-time monitoring of your solar installations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Current Power"
              value={currentPower.toFixed(1)}
              unit="kW"
              change={12.5}
              changeLabel="vs yesterday"
              icon={Zap}
              status="good"
            />
            <MetricCard
              title="Today's Generation"
              value={dailyGeneration.toFixed(2)}
              unit="MWh"
              change={8.3}
              changeLabel="vs yesterday"
              icon={TrendingUp}
              status="good"
            />
            <MetricCard
              title="System Efficiency"
              value={avgEfficiency.toFixed(1)}
              unit="%"
              change={-2.1}
              changeLabel="vs yesterday"
              icon={Gauge}
              status="warning"
            />
            <MetricCard
              title="Devices Online"
              value={onlineDevices}
              unit={`/${mockDevices.length}`}
              icon={Battery}
              status={onlineDevices === mockDevices.length ? "good" : "warning"}
            />
          </div>

          {/* Charts and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Power Generation Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Power Generation - {timeRange}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={powerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="hour"
                        axisLine={true}
                        tickLine={true}
                        tick={true}
                        type="category"
                        allowDuplicatedCategory={true}
                      />
                      <YAxis
                        axisLine={true}
                        tickLine={true}
                        tick={true}
                        type="number"
                        allowDecimals={true}
                      />
                      <ChartTooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)} kW`,
                          "Power",
                        ]}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="power"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Status */}
            <DeviceStatusGrid devices={mockDevices} />
          </div>

          {/* Weather and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WeatherCard weather={mockWeather} />

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Capacity Utilization
                    </span>
                    <span className="font-semibold">
                      {((currentOutput / totalCapacity) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(currentOutput / totalCapacity) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Performance Ratio
                    </span>
                    <span className="font-semibold">87.3%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{ width: "87%" }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      CUF (Capacity Utilization Factor)
                    </span>
                    <span className="font-semibold">22.1%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full"
                      style={{ width: "22%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Recent Alerts
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          alert.severity === "warning"
                            ? "bg-warning/10 text-warning"
                            : ""
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.device}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
