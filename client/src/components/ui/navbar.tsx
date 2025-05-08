import { Link } from "wouter";
import { ReceiptIcon, BarChart3Icon, ShoppingBasketIcon, UtensilsCrossedIcon } from "lucide-react";

export function Navbar() {
  return (
    <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <ReceiptIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">
              WhatToEat+
            </span>
          </div>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/">
          <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
            Home
          </span>
        </Link>
        <Link href="/inventory">
          <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer flex items-center">
            <ShoppingBasketIcon className="h-4 w-4 mr-1" />
            Inventory
          </span>
        </Link>
        <Link href="/recipes">
          <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer flex items-center">
            <UtensilsCrossedIcon className="h-4 w-4 mr-1" />
            Recipes
          </span>
        </Link>
        <Link href="/dashboard">
          <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer flex items-center">
            <BarChart3Icon className="h-4 w-4 mr-1" />
            Dashboard
          </span>
        </Link>
      </nav>
    </div>
  );
}