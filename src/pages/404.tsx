import { useEffect } from "react";
// import { useTheme } from "next-themes"; // Removed as unused
import { useRouter } from 'next/router';
import Link from 'next/link';

const NotFound = () => {
  const router = useRouter();
  // const { resolvedTheme } = useTheme(); // Removed as it was unused

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      router.asPath
    );
  }, [router.asPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center animate-fade-in p-8 rounded-lg border border-border">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Link
          href="/"
          className="text-primary hover:text-primary/80 underline transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
