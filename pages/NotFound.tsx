
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container mx-auto py-20 px-4 min-h-[70vh] flex flex-col justify-center items-center text-center">
        <h1 className="text-7xl md:text-9xl font-bold text-usha-burgundy mb-4">404</h1>
        <div className="indian-border w-24 mb-6"></div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          We're sorry, the page you requested could not be found. Please check the URL or navigate back to our homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-usha-burgundy hover:bg-usha-burgundy/90">
            <Link to="/">Return to Homepage</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/products">Browse Collections</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
