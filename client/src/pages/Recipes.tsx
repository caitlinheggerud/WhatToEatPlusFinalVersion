import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { Utensils, ExternalLink, X, Clock, Users, ChefHat, Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { getRecipes, getRandomRecipe } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface MealType {
  id: number;
  name: string;
  description: string | null;
}

interface DietaryPreference {
  id: number;
  name: string;
  description: string | null;
}

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

function Recipes() {
  const [filters, setFilters] = useState({
    mealTypeId: 'all',
    inventoryBased: true,
    servings: '2',
    useApi: true,
    allergies: [] as string[]
  });
  
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const queryClient = useQueryClient();
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

  // Fetch meal types
  const { data: mealTypes = [], isLoading: isMealTypesLoading, error: mealTypesError } = useQuery<MealType[]>({
    queryKey: ['/api/meal-types'],
    retry: 1,
  });

  // Fetch recipes based on filters
  const { data: recipes = [], isLoading: isRecipesLoading, error: recipesError, refetch: refetchRecipes } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes', filters],
    queryFn: async () => {
      return await getRecipes({
        mealTypeId: filters.mealTypeId,
        inventoryBased: filters.inventoryBased,
        servings: parseInt(filters.servings),
        useApi: filters.useApi,
        allergies: filters.allergies
      });
    },
    enabled: true, // Auto-load recipes on component mount
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      
      // Show toast notification that search is in progress
      toast({
        title: "Searching recipes...",
        description: "Looking for recipes that match your criteria",
        duration: 2000,
      });
      
      // Refresh the recipes data
      await refetchRecipes();
      
      // Show success toast if search was successful
      toast({
        title: "Search complete",
        description: `Found ${recipes.length} recipes matching your criteria`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error searching for recipes:", error);
      
      // Show error toast
      toast({
        title: "Search failed",
        description: "There was an error finding recipes. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRandomRecipe = async () => {
    try {
      setIsLoadingRandom(true);
      const randomRecipeData = await getRandomRecipe({
        mealTypeId: filters.mealTypeId,
        dietaryRestrictions: [], // Pass empty array to avoid undefined
        useApi: filters.useApi,
        allergies: filters.allergies,
        inventoryBased: filters.inventoryBased
      });
      setRandomRecipe(randomRecipeData);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
      toast({
        title: "Error",
        description: "Failed to get a random recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingRandom(false);
    }
  };

  if (isMealTypesLoading) return <LoadingState />;
  
  if (mealTypesError) {
    return (
      <ErrorState
        message="Failed to load meal types"
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  // Toggle favorite status
  const toggleFavorite = (recipeId: number) => {
    const isFavorited = favorites.includes(recipeId);
    let newFavorites: number[];
    
    if (isFavorited) {
      // Remove from favorites
      newFavorites = favorites.filter(id => id !== recipeId);
      toast({
        title: "Removed from favorites",
        description: "Recipe has been removed from your favorites",
        duration: 3000,
      });
    } else {
      // Add to favorites
      newFavorites = [...favorites, recipeId];
      toast({
        title: "Added to favorites",
        description: "Recipe has been added to your favorites",
        duration: 3000,
      });
    }
    
    // Update state and localStorage
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const renderRecipeCard = (recipe: Recipe, isRandom: boolean = false) => (
    <Card 
      key={recipe.id} 
      className={`overflow-hidden hover-card flex flex-col h-full ${isRandom ? 'border-primary border-2' : ''}`}
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
          {/* Favorite button */}
          <button 
            className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              favorites.includes(recipe.id) 
                ? 'bg-primary text-white' 
                : 'bg-white/80 text-muted-foreground hover:text-primary'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${favorites.includes(recipe.id) ? 'fill-white' : ''}`} 
            />
          </button>
          {isRandom && (
            <div className="absolute top-2 right-12 bg-gradient text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm">
              Random Pick
            </div>
          )}
          {recipe.mealTypeId && mealTypes.find(t => t.id === recipe.mealTypeId) && (
            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              {mealTypes.find(t => t.id === recipe.mealTypeId)?.name}
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-48 bg-muted flex items-center justify-center flex-shrink-0">
          <Utensils className="h-16 w-16 text-muted-foreground opacity-40" />
          {/* Favorite button for recipes without image */}
          <button 
            className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              favorites.includes(recipe.id) 
                ? 'bg-primary text-white' 
                : 'bg-white/80 text-muted-foreground hover:text-primary'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${favorites.includes(recipe.id) ? 'fill-white' : ''}`} 
            />
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
  );

  return (
    <div className="py-6 space-y-8 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Recipes</h1>
          <p className="text-muted-foreground mt-1">
            Find delicious recipes based on your ingredients and preferences
          </p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mb-8">
        <Card className="mb-6 hover-card shadow-sm border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Find Your Perfect Recipe</CardTitle>
            <CardDescription>
              Discover dishes that match your dietary preferences and pantry items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="mealType" className="font-medium">Meal Type</Label>
                <Select
                  value={filters.mealTypeId}
                  onValueChange={(value) => setFilters({...filters, mealTypeId: value})}
                >
                  <SelectTrigger id="mealType" className="bg-white/50">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All meal types</SelectItem>
                    {mealTypes?.map((type: MealType) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="servings" className="font-medium">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={filters.servings}
                  onChange={(e) => setFilters({...filters, servings: e.target.value})}
                  className="bg-white/50"
                />
              </div>
              
              <div className="flex flex-col justify-between space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-api" 
                    checked={filters.inventoryBased} 
                    onCheckedChange={(checked) => setFilters({...filters, inventoryBased: checked})}
                  />
                  <Label htmlFor="use-api" className="font-medium">Use my inventory items</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="use-api" 
                    checked={filters.useApi} 
                    onCheckedChange={(checked) => setFilters({...filters, useApi: checked})}
                  />
                  <Label htmlFor="use-api" className="font-medium">Search online recipes</Label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="allergies" className="font-medium mb-2 block">Allergies & Restrictions</Label>
              <div className="flex gap-2 items-center mb-2">
                <Input
                  id="allergies"
                  placeholder="Add allergy (e.g., peanuts, dairy, gluten)"
                  className="flex-1 bg-white/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      const newAllergy = e.currentTarget.value.trim().toLowerCase();
                      if (!filters.allergies.includes(newAllergy)) {
                        setFilters({
                          ...filters, 
                          allergies: [...filters.allergies, newAllergy]
                        });
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline"
                  className="bg-white hover:bg-white/80"
                  onClick={() => {
                    const input = document.getElementById('allergies') as HTMLInputElement;
                    if (input.value.trim()) {
                      const newAllergy = input.value.trim().toLowerCase();
                      if (!filters.allergies.includes(newAllergy)) {
                        setFilters({
                          ...filters, 
                          allergies: [...filters.allergies, newAllergy]
                        });
                      }
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {filters.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.allergies.map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-accent py-1.5 px-3">
                      {allergy}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                        onClick={() => {
                          setFilters({
                            ...filters,
                            allergies: filters.allergies.filter((_, i) => i !== index)
                          });
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter or click Add to add an allergy. Recipes containing these ingredients will be excluded.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || isRecipesLoading}
                className="flex-1 bg-gradient py-6 text-base hover:shadow-lg transition-all"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Searching...
                  </span>
                ) : "Search Recipes"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRandomRecipe} 
                disabled={isLoadingRandom}
                className="sm:w-1/3 bg-white hover:bg-white/80 border-primary/20 py-6 text-base"
              >
                {isLoadingRandom ? 'Loading...' : 'I Feel Lucky'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Random Recipe Section */}
      {randomRecipe && (
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-1 w-6 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-semibold text-primary">Your Random Suggestion</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-3">Looking for inspiration?</h3>
              <p className="text-muted-foreground mb-4">
                We've selected this recipe especially for you based on your preferences and dietary restrictions.
              </p>
              <p className="mb-6">
                This randomly selected dish respects your allergy restrictions and is tailored to your selected serving size.
              </p>
              <Button 
                onClick={handleRandomRecipe} 
                variant="outline" 
                className="w-full md:w-auto bg-white hover:bg-white/80"
              >
                Try Another Random Recipe
              </Button>
            </div>
            <div>
              {renderRecipeCard(randomRecipe, true)}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-1 w-6 bg-primary rounded-full"></div>
          <h2 className="text-2xl font-semibold text-primary">Recipe Collection</h2>
        </div>
        
        {isRecipesLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-muted-foreground">Finding the perfect recipes for you...</p>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: Recipe) => renderRecipeCard(recipe))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-border/40">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-40" />
            <h3 className="text-xl font-medium mb-2">No recipes found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any recipes matching your current filters and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => setFilters({
                mealTypeId: 'all',
                inventoryBased: true,
                servings: '2',
                useApi: true,
                allergies: []
              })}>
                Reset Filters
              </Button>
              <Button 
                onClick={handleRandomRecipe} 
                className="bg-gradient"
              >
                Try a Random Recipe
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recipes;
