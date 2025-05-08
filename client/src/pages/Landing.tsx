import React from 'react';
import { Link } from 'wouter';
import { ArrowRightIcon, ReceiptIcon, UtensilsCrossedIcon, ShoppingBasketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function Landing() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 flex flex-col items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {/* App Logo */}
            <div className="h-16 w-16 rounded-full bg-gradient flex items-center justify-center text-white mb-4">
              <UtensilsCrossedIcon className="h-8 w-8" />
            </div>
            
            {/* Hero Title */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gradient">
              Welcome to WhatToEat+
            </h1>
            
            {/* Hero Description */}
            <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
              Transform your grocery receipts into delicious meals and track your food expenses with AI-powered insights.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient text-white transition-all hover:shadow-lg">
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
                  Scan a Receipt
                  <ReceiptIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why use <span className="text-gradient">WhatToEat+</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <Card className="hover-card bg-white/70 shadow-sm border-border/60 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ReceiptIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scan Receipts</h3>
                <p className="text-muted-foreground">
                  Upload your grocery receipts and automatically extract items using AI.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature Card 2 */}
            <Card className="hover-card bg-white/70 shadow-sm border-border/60 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBasketIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Inventory</h3>
                <p className="text-muted-foreground">
                  Organize your pantry and reduce food waste with smart inventory management.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature Card 3 */}
            <Card className="hover-card bg-white/70 shadow-sm border-border/60 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UtensilsCrossedIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Recipes</h3>
                <p className="text-muted-foreground">
                  Get personalized recipe recommendations based on your available ingredients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="py-16 bg-gradient text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="max-w-[600px] mx-auto mb-8 text-white/90">
            Join thousands of users who have transformed the way they plan meals and manage food expenses.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Start Now
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 bg-background border-t border-border/40">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-gradient text-white">
              <UtensilsCrossedIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gradient">WhatToEat+</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WhatToEat+. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;