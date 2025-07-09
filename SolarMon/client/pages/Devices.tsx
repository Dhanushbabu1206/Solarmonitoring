import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  Plus,
  Search,
  MoreHorizontal,
  Settings,
  Trash2,
  Eye,
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Filter,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock devices data
const mockDevices = [
  {
    id: "1",
    name: "Inverter 1",
    type: "inverter",
    brand: "SolarEdge",
    model: "SE10K",
    serialNumber: "SE1001234567",
    site: "Suntech Industrial Park",
    capacity: 10000,
    status: "online",
    power: 8500,
    voltage: 385.2,
    current: 22.1,
    efficiency: 92.3,
    temperature: 48.5,
    lastSeen: "2024-12-01T11:30:00Z",
    commissionDate: "2023-03-15",
    ipAddress: "192.168.1.101",
    protocol: "Modbus TCP",
  },
  {
    id: "2",
    name: "Inverter 2",
    type: "inverter",
    brand: "Huawei",
    model: "SUN2000-8KTL",
    serialNumber: "HW2001234567",
    site: "Green Valley Mall",
    capacity: 8000,
    status: "online",
    power: 7200,
    voltage: 380.1,
    current: 18.9,
    efficiency: 90.8,
    temperature: 52.1,
    lastSeen: "2024-12-01T11:29:00Z",
    commissionDate: "2023-01-20",
    ipAddress: "192.168.1.102",
    protocol: "Modbus TCP",
  },
  {
    id: "3",
    name: "Data Logger 1",
    type: "logger",
    brand: "SolarLog",
    model: "SL1200",
    serialNumber: "SL1001234567",
    site: "Suntech Industrial Park",
    capacity: 0,
    status: "online",
    power: 0,
    voltage: 0,
    current: 0,
    efficiency: 0,
    temperature: 35.2,
    lastSeen: "2024-12-01T11:30:00Z",
    commissionDate: "2023-03-15",
    ipAddress: "192.168.1.201",
    protocol: "HTTP API",
  },
  {
    id: "4",
    name: "Inverter 3",
    type: "inverter",
    brand: "Fronius",
    model: "Primo 6.0-1",
    serialNumber: "FR3001234567",
    site: "Textile Factory Rooftop",
    capacity: 6000,
    status: "warning",
    power: 4200,
    voltage: 375.8,
    current: 11.2,
    efficiency: 85.3,
    temperature: 65.8,
    lastSeen: "2024-12-01T11:25:00Z",
    commissionDate: "2022-11-10",
    ipAddress: "192.168.1.103",
    protocol: "Modbus TCP",
  },
  {
    id: "5",
    name: "Weather Station",
    type: "weather_station",
    brand: "Campbell Scientific",
    model: "CR1000X",
    serialNumber: "CS4001234567",
    site: "Airport Terminal Solar",
    capacity: 0,
    status: "online",
    power: 0,
    voltage: 0,
    current: 0,
    efficiency: 0,
    temperature: 28.5,
    lastSeen: "2024-12-01T11:30:00Z",
    commissionDate: "2022-08-12",
    ipAddress: "192.168.1.301",
    protocol: "MQTT",
  },
  {
    id: "6",
    name: "Inverter 4",
    type: "inverter",
    brand: "ABB",
    model: "PVS-50-TL",
    serialNumber: "AB5001234567",
    site: "Residential Complex A",
    capacity: 50000,
    status: "offline",
    power: 0,
    voltage: 0,
    current: 0,
    efficiency: 0,
    temperature: 0,
    lastSeen: "2024-11-30T14:20:00Z",
    commissionDate: "2023-06-05",
    ipAddress: "192.168.1.104",
    protocol: "Modbus TCP",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-success/10 text-success";
    case "offline":
      return "bg-destructive/10 text-destructive";
    case "warning":
      return "bg-warning/10 text-warning";
    case "maintenance":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "online":
      return <CheckCircle className="h-4 w-4" />;
    case "offline":
      return <WifiOff className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "maintenance":
      return <Settings className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "inverter":
      return "bg-primary/10 text-primary";
    case "logger":
      return "bg-purple-500/10 text-purple-500";
    case "weather_station":
      return "bg-green-500/10 text-green-500";
    case "meter":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "inverter":
      return "Inverter";
    case "logger":
      return "Data Logger";
    case "weather_station":
      return "Weather Station";
    case "meter":
      return "Energy Meter";
    default:
      return type;
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

export default function Devices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  const onlineDevices = mockDevices.filter(
    (device) => device.status === "online",
  );
  const inverters = mockDevices.filter((device) => device.type === "inverter");
  const totalCapacity = inverters.reduce(
    (sum, device) => sum + device.capacity,
    0,
  );
  const currentOutput = inverters.reduce(
    (sum, device) => sum + device.power,
    0,
  );

  // Filter devices based on search and filters
  const filteredDevices = mockDevices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || device.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || device.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Add device handler
  const handleAddDevice = () => {
    // In real implementation, this would call an API
    setIsAddDeviceOpen(false);
    alert("Device added successfully!");
  };

  // More filters handler
  const handleMoreFilters = () => {
    alert("Advanced filtering options would be implemented here");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Devices</h1>
                <p className="text-muted-foreground">
                  Monitor and manage all solar equipment and sensors
                </p>
              </div>
              <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                      Register a new device for monitoring and data collection
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="device-name">Device Name</Label>
                        <Input
                          id="device-name"
                          placeholder="e.g., Inverter 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device-type">Device Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inverter">Inverter</SelectItem>
                            <SelectItem value="logger">Data Logger</SelectItem>
                            <SelectItem value="weather_station">
                              Weather Station
                            </SelectItem>
                            <SelectItem value="meter">Energy Meter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="device-brand">Brand</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solaredge">SolarEdge</SelectItem>
                            <SelectItem value="huawei">Huawei</SelectItem>
                            <SelectItem value="fronius">Fronius</SelectItem>
                            <SelectItem value="abb">ABB</SelectItem>
                            <SelectItem value="sma">SMA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="device-model">Model</Label>
                        <Input id="device-model" placeholder="Device model" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serial-number">Serial Number</Label>
                        <Input
                          id="serial-number"
                          placeholder="Device serial number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity (kW)</Label>
                        <Input
                          id="capacity"
                          type="number"
                          placeholder="e.g., 1000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-assignment">Assign to Site</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="site1">
                            Suntech Industrial Park
                          </SelectItem>
                          <SelectItem value="site2">
                            Green Valley Mall
                          </SelectItem>
                          <SelectItem value="site3">
                            Airport Terminal Solar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="communication">
                        Communication Settings
                      </Label>
                      <Textarea
                        id="communication"
                        placeholder="IP address, Modbus ID, MQTT settings, etc."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDeviceOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddDevice}>Add Device</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Device Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Devices
                    </p>
                    <p className="text-2xl font-bold">{mockDevices.length}</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Online</p>
                    <p className="text-2xl font-bold text-success">
                      {onlineDevices.length}
                    </p>
                  </div>
                  <Wifi className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Capacity
                    </p>
                    <p className="text-2xl font-bold">
                      {(totalCapacity / 1000).toFixed(1)} MW
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Output
                    </p>
                    <p className="text-2xl font-bold">
                      {(currentOutput / 1000).toFixed(1)} MW
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search devices by name, serial, or site..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Device Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inverter">Inverter</SelectItem>
                    <SelectItem value="logger">Data Logger</SelectItem>
                    <SelectItem value="weather_station">
                      Weather Station
                    </SelectItem>
                    <SelectItem value="meter">Energy Meter</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleMoreFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Devices Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Devices ({filteredDevices.length})</CardTitle>
              <CardDescription>
                Monitor and configure solar equipment across all sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Power</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {device.brand} {device.model}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {device.serialNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getTypeColor(device.type)}
                          >
                            {getTypeLabel(device.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {device.site}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(device.status)}
                            <Badge
                              variant="secondary"
                              className={getStatusColor(device.status)}
                            >
                              {device.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {device.type === "inverter" ? (
                            <span
                              className={cn(
                                "font-medium",
                                device.power > 0
                                  ? "text-success"
                                  : "text-muted-foreground",
                              )}
                            >
                              {device.power > 0
                                ? `${(device.power / 1000).toFixed(1)} kW`
                                : "0 kW"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {device.type === "inverter" &&
                          device.efficiency > 0 ? (
                            <span
                              className={cn(
                                "font-medium",
                                device.efficiency > 90
                                  ? "text-success"
                                  : device.efficiency > 80
                                    ? "text-warning"
                                    : "text-destructive",
                              )}
                            >
                              {device.efficiency}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {device.temperature > 0 ? (
                            <span
                              className={cn(
                                "font-medium",
                                device.temperature > 60
                                  ? "text-destructive"
                                  : device.temperature > 50
                                    ? "text-warning"
                                    : "text-foreground",
                              )}
                            >
                              {device.temperature.toFixed(1)}°C
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimeAgo(device.lastSeen)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="mr-2 h-4 w-4" />
                                View Data
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Device
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
