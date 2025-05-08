import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, Heart, ExternalLink, Clock, ChefHat, Users, Utensils, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRecipes } from '@/lib/api';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';

interface Recipe {
  id: number;
  title: string;
  instructions: string;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
  calories: number | null;
  imageUrl: string | null;
  mealTypeId: number | null;
  sourceUrl?: string;
}

function Favorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();
  
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
  
  // Fetch all recipes
  const { data: allRecipes = [], isLoading, error } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
    queryFn: async () => {
      return await getRecipes({
        useApi: false // Only fetch local recipes to be faster
      });
    },
  });
  
  // Filter to show only favorited recipes
  const favoriteRecipes = allRecipes.filter(recipe => favorites.includes(recipe.id));
  
  // Toggle favorite status
  const toggleFavorite = (recipeId: number) => {
    const newFavorites = favorites.filter(id => id !== recipeId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    toast({
      title: "Removed from favorites",
      description: "Recipe has been removed from your favorites",
      duration: 3000,
    });
  };
  
  if (isLoading) return <LoadingState />;
  
  if (error) {
    return (
      <ErrorState
        message="Failed to load recipes"
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  return (
    <div className="py-6 space-y-8 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Saved Recipes</h1>
          <p className="text-muted-foreground mt-1">
            Your collection of favorite recipes
          </p>
        </div>
      </div>
      
      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-medium mb-2">No saved recipes yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Mark recipes as favorites by clicking the heart icon, and they'll appear here for easy access.
          </p>
          <Button 
            onClick={() => window.location.href = '/recipes'}
            className="bg-gradient hover:shadow-md transition-all"
          >
            Browse Recipes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {favoriteRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="overflow-hidden hover-card flex flex-col h-full"
            >
              {recipe.imageUrl ? (
                <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with placeholder
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/%3E%3Cpath d='M7 2v20'/%3E%3Cpath d='M21 15V2'/%3E%3Cpath d='M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'/%3E%3Cpath d='M18 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'/%3E%3C/svg%3E";
                      e.currentTarget.style.padding = "2rem";
                      e.currentTarget.style.background = "#f1f1f1";
                      e.currentTarget.className = "w-full h-full object-contain";
                    }}
                  />
                  <button 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-primary text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-white" />
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-48 bg-muted flex items-center justify-center flex-shrink-0">
                  <Utensils className="h-16 w-16 text-muted-foreground opacity-40" />
                  <button 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-primary text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-white" />
                  </button>
                </div>
              )}
              
              <div className="flex flex-col flex-grow">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xl font-semibold line-clamp-2 h-14 flex items-start justify-between group">
                    <span>{recipe.title}</span>
                    {recipe.sourceUrl && (
                      <a 
                        href={recipe.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors ml-2 mt-1 flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </CardTitle>
                  
                  <CardDescription className="text-sm font-medium text-accent-foreground h-6">
                    {recipe.calories ? (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{Math.round(recipe.calories)}</span> calories per serving
                      </div>
                    ) : 'Calories information unavailable'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4 flex-grow">
                  <div className="flex justify-between text-sm mb-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Prep: {recipe.prepTime || 'N/A'}m</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="h-4 w-4" />
                      <span>Cook: {recipe.cookTime || 'N/A'}m</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>Serves: {recipe.servings}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 mt-auto">
                  <Button 
                    className="w-full bg-gradient hover:shadow-md transition-all"
                    onClick={() => {
                      // Open the recipe in a modal or redirect to a dedicated page
                      window.open(recipe.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(recipe.title)}+recipe`, '_blank');
                    }}
                  >
                    View Recipe
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;