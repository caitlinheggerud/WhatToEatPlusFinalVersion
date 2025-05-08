import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ReceiptIcon, BarChart3Icon, HomeIcon, UploadCloudIcon } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <a className="flex items-center gap-2">
            <ReceiptIcon className="h-6 w-6 text-primary" />
            <span className="hidden text-xl font-semibold sm:inline-block">
              Receipt Scanner
            </span>
          </a>
        </Link>
      </div>
      
      <nav className="flex items-center gap-1 sm:gap-2">
        <Link href="/">
          <a className={`flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent ${
            location === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          }`}>
            <HomeIcon className="h-4 w-4" />
            <span className="hidden sm:inline-block">Home</span>
          </a>
        </Link>
        
        <Link href="/dashboard">
          <a className={`flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent ${
            location === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          }`}>
            <BarChart3Icon className="h-4 w-4" />
            <span className="hidden sm:inline-block">Reports</span>
          </a>
        </Link>
        
        <Link href="/">
          <Button className="ml-2 flex items-center gap-1" size="sm">
            <UploadCloudIcon className="h-4 w-4" />
            <span>Scan</span>
          </Button>
        </Link>
      </nav>
    </div>
  );
}