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
  FileText,
  Download,
  Calendar,
  Plus,
  Eye,
  Mail,
  Filter,
  FileSpreadsheet,
} from "lucide-react";

// Mock reports data
const mockReports = [
  {
    id: "1",
    name: "Monthly Performance Report - November 2024",
    type: "monthly",
    site: "Suntech Industrial Park",
    period: "Nov 2024",
    generatedDate: "2024-12-01",
    status: "completed",
    size: "2.3 MB",
  },
  {
    id: "2",
    name: "Daily Generation Report - December 2024",
    type: "daily",
    site: "Green Valley Mall",
    period: "Dec 1, 2024",
    generatedDate: "2024-12-01",
    status: "completed",
    size: "856 KB",
  },
  {
    id: "3",
    name: "Annual Summary Report - 2024",
    type: "annual",
    site: "All Sites",
    period: "2024",
    generatedDate: "2024-11-30",
    status: "generating",
    size: "-",
  },
  {
    id: "4",
    name: "Weekly Performance Analysis",
    type: "weekly",
    site: "Airport Terminal Solar",
    period: "Nov 25-Dec 1, 2024",
    generatedDate: "2024-12-01",
    status: "sent",
    size: "1.8 MB",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success";
    case "generating":
      return "bg-warning/10 text-warning";
    case "sent":
      return "bg-primary/10 text-primary";
    case "failed":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: string) => {
  return <FileText className="h-4 w-4" />;
};

export default function Reports() {
  // Download functions
  const downloadReportsExcel = () => {
    const csvContent = [
      [
        "Report Name",
        "Type",
        "Site",
        "Period",
        "Generated Date",
        "Status",
        "Size",
      ].join(","),
      ...mockReports.map((report) =>
        [
          report.name,
          report.type,
          report.site,
          report.period,
          new Date(report.generatedDate).toLocaleDateString(),
          report.status,
          report.size,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadReportsPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(20);
      doc.text("Reports Summary", 20, 20);

      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text(`Total Reports: ${mockReports.length}`, 20, 37);

      // Prepare table data
      const tableData = mockReports.map((report) => [
        report.name,
        report.type,
        report.site,
        report.period,
        new Date(report.generatedDate).toLocaleDateString(),
        report.status,
        report.size,
      ]);

      // Add table
      autoTable(doc, {
        head: [
          [
            "Report Name",
            "Type",
            "Site",
            "Period",
            "Generated",
            "Status",
            "Size",
          ],
        ],
        body: tableData,
        startY: 45,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 40 }, // Report name column wider
        },
      });

      doc.save(`reports_summary_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF report. Please try again.");
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
                <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground">
                  Generate and manage performance reports for your solar sites
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadReportsExcel()}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button variant="outline" onClick={() => downloadReportsPDF()}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Reports
                    </p>
                    <p className="text-2xl font-bold">{mockReports.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Calendar className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Auto-Generated
                    </p>
                    <p className="text-2xl font-bold">6</p>
                  </div>
                  <Mail className="h-8 w-8 text-warning" />
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
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="generating">Generating</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
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

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                View and download generated reports for your solar installations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(report.type)}
                            <span className="font-medium">{report.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.site}</TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(report.status)}
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={
                                report.status !== "completed" &&
                                report.status !== "sent"
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={
                                report.status !== "completed" &&
                                report.status !== "sent"
                              }
                            >
                              <Download className="h-4 w-4" />
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
