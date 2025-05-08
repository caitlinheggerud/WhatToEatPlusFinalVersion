import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { HeartIcon, TrashIcon, ChefHatIcon, ClockIcon, UtensilsIcon, BadgeCheckIcon, ExternalLinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '@/lib/api';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

function Favorites() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);
  
  // Get all recipes
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['/api/recipes'],
    queryFn: () => getRecipes({}),
  });

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites:", e);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  // Get favorite recipes by matching saved recipe IDs with actual recipe data
  const favoriteRecipes = React.useMemo(() => {
    if (!recipes || !favorites.length) return [];
    return recipes.filter((recipe: any) => favorites.includes(recipe.id));
  }, [recipes, favorites]);

  const removeFromFavorites = (recipeId: number) => {
    const newFavorites = favorites.filter(id => id !== recipeId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    toast({
      title: "Removed from favorites",
      description: "Recipe has been removed from your favorites.",
      duration: 3000,
    });
  };

  const renderRecipeCard = (recipe: any) => {
    return (
      <Card key={recipe.id} className="hover-card overflow-hidden shadow-sm border-border/60 transition-all">
        <div className="relative">
          {/* Recipe image */}
          <div className="h-48 bg-muted/20 overflow-hidden">
            {recipe.imageUrl ? (
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <ChefHatIcon className="h-12 w-12 text-primary/40" />
              </div>
            )}
          </div>
          
          {/* Meal type badge */}
          {recipe.mealType && (
            <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary">
              {recipe.mealType.name}
            </Badge>
          )}
          
          {/* Remove from favorites button */}
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => removeFromFavorites(recipe.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
          <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.dietaryRestrictions?.map((restriction: any) => (
              <Badge key={restriction.id} variant="outline" className="bg-white text-xs">
                {restriction.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-between text-sm text-muted-foreground gap-y-1">
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1 text-primary/70" />
              <span>{recipe.readyInMinutes || "30"} min</span>
            </div>
            <div className="flex items-center">
              <UtensilsIcon className="h-3.5 w-3.5 mr-1 text-primary/70" />
              <span>{recipe.servings || "2"} servings</span>
            </div>
            {recipe.calories && (
              <div className="flex items-center">
                <BadgeCheckIcon className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>{recipe.calories} cal</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Link href={`/recipes/${recipe.id}`} className="w-full">
            <Button className="w-full" variant="outline">
              View Recipe <ExternalLinkIcon className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="py-6 space-y-8 container mx-auto">
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
              <CardTitle>Your Favorite Recipes</CardTitle>
              <CardDescription>
                Quick access to recipes you love
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden shadow-sm border-border/60">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe: any) => renderRecipeCard(recipe))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <HeartIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Your favorite recipes will appear here. Browse the recipes section and click the heart icon to save recipes you love.
              </p>
              <Link href="/recipes">
                <Button className="bg-gradient">
                  Browse Recipes
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Favorites;