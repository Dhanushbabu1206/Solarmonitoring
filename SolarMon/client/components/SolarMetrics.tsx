import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Sun,
  Battery,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  status?: "good" | "warning" | "critical";
  description?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon: Icon,
  status = "good",
  description,
}: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-success";
      case "warning":
        return "text-warning";
      case "critical":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "good":
        return (
          <Badge variant="secondary" className="bg-success/10 text-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Normal
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", getStatusColor())} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">
            {value}
            {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center space-x-2 mt-2">
            {change > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span
              className={cn(
                "text-xs",
                change > 0 ? "text-success" : "text-destructive",
              )}
            >
              {change > 0 ? "+" : ""}
              {change}% {changeLabel}
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
        {status !== "good" && <div className="mt-2">{getStatusBadge()}</div>}
      </CardContent>
    </Card>
  );
}

export function PowerGenerationCard({ data }: { data: any[] }) {
  const currentPower = data[data.length - 1]?.power || 0;
  const dailyGeneration = data.reduce(
    (sum, item) => sum + (item.power || 0),
    0,
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live Power Generation
        </CardTitle>
        <CardDescription>
          Real-time power output from all inverters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Power</p>
            <p className="text-3xl font-bold text-primary">
              {currentPower.toFixed(1)} <span className="text-lg">kW</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Generation</p>
            <p className="text-3xl font-bold text-success">
              {(dailyGeneration / 1000).toFixed(1)}{" "}
              <span className="text-lg">MWh</span>
            </p>
          </div>
        </div>
        <div className="h-64 w-full">
          {/* Chart would go here */}
          <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Power Generation Chart</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DeviceStatusGrid({ devices }: { devices: any[] }) {
  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const totalDevices = devices.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Device Status
        </CardTitle>
        <CardDescription>
          {onlineDevices}/{totalDevices} devices online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.slice(0, 6).map((device, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    device.status === "online"
                      ? "bg-success"
                      : device.status === "offline"
                        ? "bg-destructive"
                        : "bg-warning",
                  )}
                />
                <div>
                  <p className="font-medium text-sm">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {device.power?.toFixed(1) || "0.0"} kW
                </p>
                <p
                  className={cn(
                    "text-xs capitalize",
                    device.status === "online"
                      ? "text-success"
                      : device.status === "offline"
                        ? "text-destructive"
                        : "text-warning",
                  )}
                >
                  {device.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherCard({ weather }: { weather: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-warning" />
          Weather Conditions
        </CardTitle>
        <CardDescription>
          Current conditions affecting generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Irradiance</p>
              <p className="text-lg font-semibold">{weather.irradiance} W/m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-lg font-semibold">{weather.temperature}°C</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="text-lg font-semibold">{weather.windSpeed} m/s</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
