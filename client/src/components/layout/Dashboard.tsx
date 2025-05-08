import { Link } from "wouter";
import { Home, ShoppingBag, UtensilsCrossed, Book, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Receipts", href: "/receipts", icon: ShoppingBag },
    { name: "Recipes", href: "/recipes", icon: UtensilsCrossed },
    { name: "Inventory", href: "/inventory", icon: Book },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="app-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="app-title flex items-center">
              WhatToEat<span className="text-accent-foreground">+</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href === "/" && location === "/dashboard");
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="hidden md:flex items-center">
              <Button size="sm" className="bg-gradient">
                Upload Receipt
              </Button>
            </div>
            
            {/* Mobile nav button */}
            <div className="md:hidden flex items-center">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation (fixed at bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/60 px-2 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
              (item.href === "/" && location === "/dashboard");
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex flex-col items-center justify-center px-2 pt-2 pb-1"
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs mt-1 ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 pt-6 pb-20 md:py-8 bg-background">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}