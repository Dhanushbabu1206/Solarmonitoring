import React, { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileSpreadsheet,
  Zap,
  Sun,
  Gauge,
  Target,
  Activity,
  Battery,
} from "lucide-react";

// Data generation functions
const generatePowerData = (days: number) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate daily power generation with realistic patterns
    const baseGeneration = 450 + Math.random() * 200;
    const weatherFactor = Math.random() > 0.8 ? 0.4 : 1; // 20% chance of bad weather
    const seasonalFactor =
      0.8 + 0.4 * Math.sin((date.getMonth() / 12) * Math.PI * 2);

    data.push({
      date: date.toISOString().split("T")[0],
      dateLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      generation: Math.round(baseGeneration * weatherFactor * seasonalFactor),
      target: 500,
      efficiency: 85 + Math.random() * 10,
      irradiance: 300 + Math.random() * 500,
      temperature: 20 + Math.random() * 15,
    });
  }

  return data;
};

const generateHourlyData = () => {
  const data = [];
  const today = new Date();

  for (let hour = 0; hour < 24; hour++) {
    let power = 0;
    let voltage = 0;
    let current = 0;

    // Generate realistic solar power curve
    if (hour >= 6 && hour <= 18) {
      const peakHour = 12;
      const maxPower = 2800;
      const efficiency = 0.8 + Math.random() * 0.3;

      power = maxPower * Math.sin(((hour - 6) / 12) * Math.PI) * efficiency;
      voltage = 380 + Math.random() * 40;
      current = power > 0 ? power / voltage : 0;
    }

    data.push({
      hour: hour.toString().padStart(2, "0") + ":00",
      power: Math.max(0, Math.round(power)),
      voltage: Math.round(voltage * 100) / 100,
      current: Math.round(current * 100) / 100,
      efficiency: power > 0 ? 85 + Math.random() * 10 : 0,
    });
  }

  return data;
};

const sitePerformanceData = [
  {
    name: "Suntech Industrial",
    current: 2.8,
    target: 3.0,
    efficiency: 93.3,
    alerts: 0,
  },
  {
    name: "Green Valley Mall",
    current: 1.9,
    target: 2.0,
    efficiency: 95.0,
    alerts: 1,
  },
  {
    name: "Airport Terminal",
    current: 5.2,
    target: 5.0,
    efficiency: 104.0,
    alerts: 0,
  },
  {
    name: "Textile Factory",
    current: 2.1,
    target: 3.2,
    efficiency: 65.6,
    alerts: 3,
  },
  {
    name: "Residential Complex",
    current: 0.98,
    target: 1.0,
    efficiency: 98.0,
    alerts: 0,
  },
];

const performanceDistribution = [
  { name: "Excellent (>95%)", value: 40, color: "#22c55e" },
  { name: "Good (85-95%)", value: 35, color: "#3b82f6" },
  { name: "Fair (70-85%)", value: 20, color: "#f59e0b" },
  { name: "Poor (<70%)", value: 5, color: "#ef4444" },
];

const energyTrendData = [
  { month: "Jan", solar: 1240, grid: 340, saved: 900 },
  { month: "Feb", solar: 1380, grid: 280, saved: 1100 },
  { month: "Mar", solar: 1850, grid: 220, saved: 1630 },
  { month: "Apr", solar: 2100, grid: 180, saved: 1920 },
  { month: "May", solar: 2380, grid: 150, saved: 2230 },
  { month: "Jun", solar: 2450, grid: 140, saved: 2310 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("power");

  // Generate data based on time range
  const powerData = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return generatePowerData(days);
  }, [timeRange]);

  const hourlyData = useMemo(() => generateHourlyData(), []);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalGeneration = powerData.reduce(
      (sum, day) => sum + day.generation,
      0,
    );
    const avgEfficiency =
      powerData.reduce((sum, day) => sum + day.efficiency, 0) /
      powerData.length;
    const currentPower = hourlyData[new Date().getHours()]?.power || 0;
    const peakPower = Math.max(...hourlyData.map((h) => h.power));

    // Calculate trends
    const recentData = powerData.slice(-7);
    const previousData = powerData.slice(-14, -7);
    const recentAvg =
      recentData.reduce((sum, d) => sum + d.generation, 0) / recentData.length;
    const previousAvg =
      previousData.reduce((sum, d) => sum + d.generation, 0) /
      previousData.length;
    const trend =
      previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    return {
      totalGeneration: Math.round(totalGeneration),
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
      currentPower: Math.round(currentPower),
      peakPower: Math.round(peakPower),
      trend: Math.round(trend * 10) / 10,
    };
  }, [powerData, hourlyData]);

  // Export functions
  const exportData = async (format: "csv" | "pdf") => {
    if (format === "csv") {
      const headers = [
        "Date",
        "Generation (kWh)",
        "Target (kWh)",
        "Efficiency (%)",
        "Irradiance (W/m²)",
      ];
      const csvData = [
        headers.join(","),
        ...powerData.map((d) =>
          [
            d.date,
            d.generation,
            d.target,
            d.efficiency.toFixed(1),
            d.irradiance.toFixed(0),
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      try {
        const jsPDF = (await import("jspdf")).default;
        const autoTable = (await import("jspdf-autotable")).default;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text("Solar Analytics Report", 20, 20);

        // Add generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

        // Add summary metrics
        doc.setFontSize(14);
        doc.text("Key Performance Indicators", 20, 45);

        doc.setFontSize(10);
        doc.text(
          `Total Generation: ${(metrics.totalGeneration / 1000).toFixed(1)} MWh`,
          20,
          55,
        );
        doc.text(`Average Efficiency: ${metrics.avgEfficiency}%`, 20, 62);
        doc.text(
          `Current Power: ${(metrics.currentPower / 1000).toFixed(1)} MW`,
          20,
          69,
        );
        doc.text(
          `Peak Power: ${(metrics.peakPower / 1000).toFixed(1)} MW`,
          20,
          76,
        );

        // Add data table
        const tableData = powerData.map((d) => [
          d.date,
          d.generation.toString(),
          d.target.toString(),
          d.efficiency.toFixed(1) + "%",
          d.irradiance.toFixed(0) + " W/m²",
        ]);

        autoTable(doc, {
          head: [
            [
              "Date",
              "Generation (kWh)",
              "Target (kWh)",
              "Efficiency",
              "Irradiance",
            ],
          ],
          body: tableData,
          startY: 85,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [59, 130, 246] },
        });

        // Save the PDF
        doc.save(
          `analytics_report_${new Date().toISOString().split("T")[0]}.pdf`,
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF report. Please try again.");
      }
    }
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
                <h1 className="text-3xl font-bold text-foreground">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Advanced performance analysis and insights for your solar
                  installations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => exportData("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => exportData("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Generation
                    </p>
                    <p className="text-2xl font-bold">
                      {(metrics.totalGeneration / 1000).toFixed(1)} MWh
                    </p>
                    <div className="flex items-center mt-1">
                      {metrics.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-xs ${metrics.trend > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {Math.abs(metrics.trend)}% vs last week
                      </span>
                    </div>
                  </div>
                  <Zap className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Average Efficiency
                    </p>
                    <p className="text-2xl font-bold">
                      {metrics.avgEfficiency}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      System-wide average
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Power
                    </p>
                    <p className="text-2xl font-bold">
                      {(metrics.currentPower / 1000).toFixed(1)} MW
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Live generation
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Peak Power
                    </p>
                    <p className="text-2xl font-bold">
                      {(metrics.peakPower / 1000).toFixed(1)} MW
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Today's maximum
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Energy Generation Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Energy Generation Trend ({timeRange})</CardTitle>
                <CardDescription>
                  Daily generation with target comparison and efficiency
                  tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={powerData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="dateLabel"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        axisLine={true}
                        tickLine={true}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        axisLine={true}
                        tickLine={true}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{label}</p>
                                {payload.map((entry, index) => (
                                  <p
                                    key={index}
                                    className="text-sm"
                                    style={{ color: entry.color }}
                                  >
                                    {entry.name}: {entry.value} kWh
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="generation"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>
                  Site efficiency categorization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm">
                                  {data.value}% of sites
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Today's Power Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Power Profile</CardTitle>
                <CardDescription>
                  Hourly power generation throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="hour"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        axisLine={true}
                        tickLine={true}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        axisLine={true}
                        tickLine={true}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">Time: {label}</p>
                                <p className="text-sm text-orange-500">
                                  Power: {payload[0].value} kW
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="power"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Site Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Site Performance Comparison</CardTitle>
                <CardDescription>
                  Current vs target output by site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sitePerformanceData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="name"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        axisLine={true}
                        tickLine={true}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        axisLine={true}
                        tickLine={true}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-blue-500">
                                  Current: {data.current} MW
                                </p>
                                <p className="text-sm text-gray-500">
                                  Target: {data.target} MW
                                </p>
                                <p className="text-sm text-green-500">
                                  Efficiency: {data.efficiency}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="current" fill="#3b82f6" />
                      <Bar dataKey="target" fill="#9ca3af" opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Energy Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Energy Trends & Savings</CardTitle>
              <CardDescription>
                Monthly solar generation vs grid consumption and cost savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={true}
                      tickLine={true}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      axisLine={true}
                      tickLine={true}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label} 2024</p>
                              {payload.map((entry, index) => (
                                <p
                                  key={index}
                                  className="text-sm"
                                  style={{ color: entry.color }}
                                >
                                  {entry.name}: {entry.value} kWh
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="solar"
                      fill="#22c55e"
                      name="Solar Generation"
                    />
                    <Bar
                      dataKey="grid"
                      fill="#ef4444"
                      name="Grid Consumption"
                    />
                    <Bar dataKey="saved" fill="#3b82f6" name="Energy Saved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
