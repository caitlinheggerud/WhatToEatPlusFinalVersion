import { Link, useLocation } from "wouter";
import { 
  ReceiptIcon, 
  BarChart3Icon, 
  ShoppingBasketIcon, 
  UtensilsCrossedIcon, 
  MenuIcon, 
  UserIcon, 
  HeartIcon, 
  SettingsIcon, 
  LogOutIcon, 
  ChevronDownIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Load favorites count from localStorage
  useEffect(() => {
    // Initialize favorites if missing
    if (!localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
    if (localStorage.getItem('favoriteRecipeData') === null) {
      localStorage.setItem('favoriteRecipeData', JSON.stringify([]));
    }
    
    const checkFavorites = () => {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          const favorites = JSON.parse(storedFavorites);
          // Only count non-empty arrays
          if (Array.isArray(favorites) && favorites.length > 0) {
            setFavoritesCount(favorites.length);
          } else {
            setFavoritesCount(0);
            // Ensure we store a proper empty array if it was invalid
            localStorage.setItem('favorites', JSON.stringify([]));
          }
        } catch (e) {
          console.error("Failed to parse favorites in navbar:", e);
          // Reset to empty array if parsing failed
          localStorage.setItem('favorites', JSON.stringify([]));
          setFavoritesCount(0);
        }
      } else {
        localStorage.setItem('favorites', JSON.stringify([]));
        setFavoritesCount(0);
      }
    };
    
    // Check on initial load
    checkFavorites();
    
    // Set up storage event listener to detect changes to localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        checkFavorites();
      }
    };
    
    // Set up custom event listener for favorites updates
    const handleFavoritesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.favorites) {
        const favorites = customEvent.detail.favorites;
        // Only count non-empty arrays
        if (Array.isArray(favorites) && favorites.length > 0) {
          setFavoritesCount(favorites.length);
        } else {
          setFavoritesCount(0);
        }
      } else {
        checkFavorites();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    
    // Check for both favorites and recipeData to ensure consistency
    const checkAllFavorites = () => {
      checkFavorites();
      
      // Additionally, clean up favoriteRecipeData if favorites is empty/invalid
      const storedFavorites = localStorage.getItem('favorites');
      if (!storedFavorites || storedFavorites === '[]') {
        // If there are no favorites, make sure favoriteRecipeData is also cleared
        localStorage.removeItem('favoriteRecipeData');
      }
    };
    
    // Also set up interval to check periodically (localStorage events don't trigger in same window)
    const interval = setInterval(checkAllFavorites, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
      clearInterval(interval);
    };
  }, []);
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3Icon },
    { name: "Recipes", href: "/recipes", icon: UtensilsCrossedIcon },
    { name: "Favorites", href: "/favorites", icon: HeartIcon },
    { name: "Receipts", href: "/receipts", icon: ReceiptIcon },
    { name: "Inventory", href: "/inventory", icon: ShoppingBasketIcon },
  ];

  return (
    <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="relative h-8 w-8 overflow-hidden rounded-md flex items-center justify-center bg-gradient text-white">
              <UtensilsCrossedIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:inline-block">
              WhatToEat+
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = location === href;
            const showBadge = name === "Favorites" && favoritesCount > 0;
            
            return (
              <Link href={href} key={name}>
                <div className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                  <div className="relative">
                    <Icon className="h-4 w-4 mr-2" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {favoritesCount > 9 ? '9+' : favoritesCount}
                      </span>
                    )}
                  </div>
                  {name}
                </div>
              </Link>
            );
          })}
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={cn(
                "flex items-center ml-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                profileOpen
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
              <ChevronDownIcon className={cn(
                "h-4 w-4 ml-1 transition-transform",
                profileOpen ? "rotate-180" : ""
              )} />
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                <div className="px-4 py-2 border-b border-border/40">
                  <p className="text-sm font-medium">User Profile</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
                <Link href="/favorites">
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <div className="relative">
                      <HeartIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {favoritesCount > 0 && (
                        <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {favoritesCount > 9 ? '9+' : favoritesCount}
                        </span>
                      )}
                    </div>
                    Favorites
                  </div>
                </Link>
                <Link href="/profile">
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Edit Profile
                  </div>
                </Link>
                <Link href="/settings">
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <SettingsIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Settings
                  </div>
                </Link>
                <div className="border-t border-border/40 mt-1"></div>
                <Link href="/">
                  <div className="px-4 py-2 text-sm text-rose-500 hover:bg-gray-100 flex items-center" onClick={() => setProfileOpen(false)}>
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden flex items-center p-2 rounded-md hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white shadow-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-md flex items-center justify-center bg-gradient text-white">
                    <UtensilsCrossedIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-gradient">
                    WhatToEat+
                  </span>
                </div>
                <button className="p-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              
              <nav className="flex flex-col space-y-1 mb-8">
                {navItems.map(({ name, href, icon: Icon }) => {
                  const isActive = location === href;
                  const showBadge = name === "Favorites" && favoritesCount > 0;
                  
                  return (
                    <Link href={href} key={name}>
                      <div 
                        className={cn(
                          "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors",
                          isActive 
                            ? "text-primary bg-primary/5" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="relative">
                          <Icon className="h-5 w-5 mr-3" />
                          {showBadge && (
                            <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {favoritesCount > 9 ? '9+' : favoritesCount}
                            </span>
                          )}
                        </div>
                        {name}
                      </div>
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-auto border-t border-border/40 pt-4">
                <div className="px-4 py-3 mb-1">
                  <p className="text-base font-medium">User Profile</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
                <Link href="/favorites">
                  <div className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative">
                      <HeartIcon className="h-5 w-5 mr-3" />
                      {favoritesCount > 0 && (
                        <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {favoritesCount > 9 ? '9+' : favoritesCount}
                        </span>
                      )}
                    </div>
                    Favorites
                  </div>
                </Link>
                <Link href="/profile">
                  <div className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon className="h-5 w-5 mr-3" />
                    Edit Profile
                  </div>
                </Link>
                <Link href="/settings">
                  <div className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    <SettingsIcon className="h-5 w-5 mr-3" />
                    Settings
                  </div>
                </Link>
                <Link href="/">
                  <div className="flex items-center px-4 py-3 mt-2 text-sm text-rose-500 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                    <LogOutIcon className="h-5 w-5 mr-3" />
                    Logout
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}