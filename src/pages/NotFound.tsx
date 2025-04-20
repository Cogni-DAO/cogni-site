
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const NotFound = () => {
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center animate-fade-in p-8 rounded-lg border border-border">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a 
          href="/" 
          className="text-primary hover:text-primary/80 underline transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
