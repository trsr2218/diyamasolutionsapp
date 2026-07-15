import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, MessageSquare } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="section-padding text-center">
      <div className="container-narrow mx-auto">
        <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/ai" className="btn-outline-primary inline-flex items-center gap-2">
            <MessageSquare size={16} /> Ask Diyama AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
