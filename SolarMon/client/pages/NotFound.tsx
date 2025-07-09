import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  // Check if this is a placeholder page (known route but not implemented)
  const isPlaceholderPage = [
    "/devices",
    "/analytics",
    "/reports",
    "/alerts",
    "/users",
    "/settings",
  ].includes(location.pathname);

  if (isPlaceholderPage) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Construction className="h-12 w-12 text-warning" />
                  </div>
                  <CardTitle className="text-2xl">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    This page is under development. We're working hard to bring
                    you this feature soon!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current page:{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">
                      {location.pathname}
                    </code>
                  </p>
                  <Button asChild>
                    <Link to="/">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-6xl font-bold text-primary mb-2">
                  404
                </CardTitle>
                <CardTitle className="text-2xl">Page Not Found</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <p className="text-sm text-muted-foreground">
                  Requested path:{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    {location.pathname}
                  </code>
                </p>
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
