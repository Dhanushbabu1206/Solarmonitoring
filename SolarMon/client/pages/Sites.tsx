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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Settings,
  Trash2,
  Zap,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock sites data
const mockSites = [
  {
    id: "1",
    name: "Suntech Industrial Park",
    location: "Mumbai, Maharashtra",
    capacity: 2500,
    status: "active",
    devices: 8,
    lastReading: "2 minutes ago",
    monthlyGeneration: 485.2,
    efficiency: 89.5,
    alerts: 0,
    commissioned: "2023-03-15",
    company: "Adani Solar",
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
  {
    id: "2",
    name: "Green Valley Mall",
    location: "Pune, Maharashtra",
    capacity: 1800,
    status: "active",
    devices: 6,
    lastReading: "5 minutes ago",
    monthlyGeneration: 342.8,
    efficiency: 91.2,
    alerts: 1,
    commissioned: "2023-01-20",
    company: "Tata Solar",
    coordinates: { lat: 18.5204, lng: 73.8567 },
  },
  {
    id: "3",
    name: "Textile Factory Rooftop",
    location: "Coimbatore, Tamil Nadu",
    capacity: 3200,
    status: "maintenance",
    devices: 12,
    lastReading: "2 hours ago",
    monthlyGeneration: 0,
    efficiency: 0,
    alerts: 3,
    commissioned: "2022-11-10",
    company: "Solar Power India",
    coordinates: { lat: 11.0168, lng: 76.9558 },
  },
  {
    id: "4",
    name: "Residential Complex A",
    location: "Bangalore, Karnataka",
    capacity: 950,
    status: "active",
    devices: 4,
    lastReading: "1 minute ago",
    monthlyGeneration: 198.7,
    efficiency: 87.3,
    alerts: 0,
    commissioned: "2023-06-05",
    company: "Vikram Solar",
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: "5",
    name: "Airport Terminal Solar",
    location: "Delhi, NCR",
    capacity: 5000,
    status: "active",
    devices: 20,
    lastReading: "30 seconds ago",
    monthlyGeneration: 892.1,
    efficiency: 92.8,
    alerts: 0,
    commissioned: "2022-08-12",
    company: "Waaree Energies",
    coordinates: { lat: 28.7041, lng: 77.1025 },
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success";
    case "maintenance":
      return "bg-warning/10 text-warning";
    case "inactive":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Sites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");

  // Enhanced filter functionality
  const handleAdvancedFilter = () => {
    // This would open an advanced filter dialog in a real implementation
    alert("Advanced filtering options would be implemented here");
  };

  // View dashboard functionality
  const handleViewDashboard = (siteId: string) => {
    // Navigate to site-specific dashboard
    window.location.href = `/?site=${siteId}`;
  };

  // Manage devices functionality
  const handleManageDevices = (siteId: string) => {
    // Navigate to devices page filtered by site
    window.location.href = `/devices?site=${siteId}`;
  };

  // Add new site handler
  const handleAddSite = (formData: any) => {
    // In real implementation, this would call an API
    console.log("Adding new site:", formData);
    setIsAddSiteOpen(false);
    alert("Site added successfully!");
  };

  const filteredSites = mockSites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCapacity = mockSites.reduce((sum, site) => sum + site.capacity, 0);
  const activeSites = mockSites.filter((site) => site.status === "active");
  const totalAlerts = mockSites.reduce((sum, site) => sum + site.alerts, 0);
  const avgEfficiency =
    activeSites.reduce((sum, site) => sum + site.efficiency, 0) /
    activeSites.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sites</h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your solar installations
                </p>
              </div>
              <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Site
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Solar Site</DialogTitle>
                    <DialogDescription>
                      Create a new solar installation site for monitoring
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input
                          id="site-name"
                          placeholder="e.g., Industrial Park Solar"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-capacity">Capacity (kW)</Label>
                        <Input
                          id="site-capacity"
                          type="number"
                          placeholder="e.g., 2500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-location">Location</Label>
                      <Input
                        id="site-location"
                        placeholder="Full address of the installation"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-company">Company/Client</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="adani">Adani Solar</SelectItem>
                            <SelectItem value="tata">Tata Solar</SelectItem>
                            <SelectItem value="vikram">Vikram Solar</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commission-date">Commission Date</Label>
                        <Input id="commission-date" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Description</Label>
                      <Textarea
                        id="site-description"
                        placeholder="Additional details about the installation"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddSiteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleAddSite({})}>
                        Create Site
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sites</p>
                    <p className="text-2xl font-bold">{mockSites.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-primary" />
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
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Efficiency
                    </p>
                    <p className="text-2xl font-bold">
                      {avgEfficiency.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Alerts
                    </p>
                    <p className="text-2xl font-bold">{totalAlerts}</p>
                  </div>
                  <AlertTriangle
                    className={cn(
                      "h-8 w-8",
                      totalAlerts > 0
                        ? "text-warning"
                        : "text-muted-foreground",
                    )}
                  />
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
                    placeholder="Search sites by name, location, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedStatusFilter}
                  onValueChange={setSelectedStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleAdvancedFilter}>
                  <Settings className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sites Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Sites ({filteredSites.length})</CardTitle>
              <CardDescription>
                Comprehensive overview of all solar installations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Devices</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Alerts</TableHead>
                      <TableHead>Last Reading</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{site.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {site.company}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {site.location}
                          </div>
                        </TableCell>
                        <TableCell>{site.capacity} kW</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(site.status)}
                          >
                            {site.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{site.devices}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "font-medium",
                              site.efficiency > 90
                                ? "text-success"
                                : site.efficiency > 80
                                  ? "text-warning"
                                  : "text-destructive",
                            )}
                          >
                            {site.efficiency > 0
                              ? `${site.efficiency}%`
                              : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {site.alerts > 0 ? (
                            <Badge variant="destructive">{site.alerts}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {site.lastReading}
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
                              <DropdownMenuItem
                                onClick={() => setSelectedSite(site)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewDashboard(site.id)}
                              >
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Dashboard
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleManageDevices(site.id)}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Manage Devices
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Site
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

      {/* Site Details Dialog */}
      <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSite?.name}</DialogTitle>
            <DialogDescription>Site details and performance</DialogDescription>
          </DialogHeader>
          {selectedSite && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedSite.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedSite.company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{selectedSite.capacity} kW</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commissioned</p>
                  <p className="font-medium">
                    {new Date(selectedSite.commissioned).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">
                        {selectedSite.efficiency}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current Efficiency
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {selectedSite.monthlyGeneration} MWh
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">View Dashboard</Button>
                <Button variant="outline" className="flex-1">
                  Manage Devices
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
