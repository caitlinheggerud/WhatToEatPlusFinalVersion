import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartIcon } from 'lucide-react';

function Favorites() {
  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Favorites</h1>
          <p className="text-muted-foreground mt-1">
            Your saved recipes and items
          </p>
        </div>
      </div>

      <Card className="hover-card bg-white/70 shadow-sm border-border/60">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <HeartIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>Favorites</CardTitle>
              <CardDescription>
                Save your favorite recipes for quick access
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HeartIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Your favorite recipes will appear here. Browse the recipes section and click the heart icon to save recipes you love.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Favorites;