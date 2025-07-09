import React from "react";
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
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  Filter,
  Bell,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Mock alerts data
const mockAlerts = [
  {
    id: "1",
    type: "Device Offline",
    severity: "critical",
    device: "Inverter 4",
    site: "Suntech Industrial Park",
    description: "Inverter has been offline for over 2 hours during daylight",
    triggeredAt: "2024-12-01T14:30:00Z",
    status: "open",
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    id: "2",
    type: "Low Performance",
    severity: "warning",
    device: "Inverter 3",
    site: "Green Valley Mall",
    description: "Power output 25% below expected for current conditions",
    triggeredAt: "2024-12-01T12:15:00Z",
    status: "acknowledged",
    acknowledgedBy: "John Doe",
    acknowledgedAt: "2024-12-01T12:45:00Z",
  },
  {
    id: "3",
    type: "Temperature High",
    severity: "warning",
    device: "Inverter 2",
    site: "Airport Terminal Solar",
    description: "Inverter temperature exceeded 75°C threshold",
    triggeredAt: "2024-12-01T11:20:00Z",
    status: "resolved",
    acknowledgedBy: "Jane Smith",
    acknowledgedAt: "2024-12-01T11:30:00Z",
  },
  {
    id: "4",
    type: "Communication Error",
    severity: "medium",
    device: "Data Logger",
    site: "Textile Factory Rooftop",
    description: "Intermittent communication failures detected",
    triggeredAt: "2024-12-01T09:45:00Z",
    status: "open",
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    id: "5",
    type: "Voltage Anomaly",
    severity: "critical",
    device: "Inverter 1",
    site: "Residential Complex A",
    description: "DC voltage reading outside normal range (850V detected)",
    triggeredAt: "2024-11-30T16:30:00Z",
    status: "acknowledged",
    acknowledgedBy: "Mike Johnson",
    acknowledgedAt: "2024-11-30T17:00:00Z",
  },
];

export default function Alerts() {
  // Helper functions
  const getSeverityColor = React.useCallback((severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-warning/10 text-warning";
      case "medium":
        return "bg-blue-500/10 text-blue-500";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  }, []);

  const getStatusColor = React.useCallback((status: string) => {
    switch (status) {
      case "open":
        return "bg-destructive/10 text-destructive";
      case "acknowledged":
        return "bg-warning/10 text-warning";
      case "resolved":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  }, []);

  const getStatusIcon = React.useCallback((status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "acknowledged":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  }, []);

  const formatTimeAgo = React.useCallback((timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }, []);

  // Memoized computed values
  const alertStats = React.useMemo(() => {
    const openAlerts = mockAlerts.filter((alert) => alert.status === "open");
    const acknowledgedAlerts = mockAlerts.filter(
      (alert) => alert.status === "acknowledged",
    );
    const criticalAlerts = mockAlerts.filter(
      (alert) => alert.severity === "critical",
    );

    return {
      openAlerts: openAlerts.length,
      acknowledgedAlerts: acknowledgedAlerts.length,
      criticalAlerts: criticalAlerts.length,
      totalAlerts: mockAlerts.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
                <p className="text-muted-foreground">
                  Monitor and manage system alerts and notifications
                </p>
              </div>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Alert Settings
              </Button>
            </div>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open Alerts</p>
                    <p className="text-2xl font-bold text-destructive">
                      {alertStats.openAlerts}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Acknowledged
                    </p>
                    <p className="text-2xl font-bold text-warning">
                      {alertStats.acknowledgedAlerts}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-destructive">
                      {alertStats.criticalAlerts}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">
                      {alertStats.totalAlerts}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    <SelectItem value="suntech">
                      Suntech Industrial Park
                    </SelectItem>
                    <SelectItem value="greenvalley">
                      Green Valley Mall
                    </SelectItem>
                    <SelectItem value="airport">
                      Airport Terminal Solar
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="ml-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Monitor and respond to system alerts and anomalies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Acknowledged By</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{alert.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getSeverityColor(alert.severity)}
                          >
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.device}</TableCell>
                        <TableCell>{alert.site}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(alert.status)}
                            <Badge
                              variant="secondary"
                              className={getStatusColor(alert.status)}
                            >
                              {alert.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatTimeAgo(alert.triggeredAt)}
                        </TableCell>
                        <TableCell>
                          {alert.acknowledgedBy || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {alert.status === "open" && (
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  );
}
