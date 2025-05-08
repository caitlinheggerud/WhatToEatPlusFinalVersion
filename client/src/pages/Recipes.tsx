import React, { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { Utensils, ExternalLink, X } from 'lucide-react';
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
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
  });

  const handleSearch = () => {
    refetchRecipes();
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

  const renderRecipeCard = (recipe: Recipe, isRandom: boolean = false) => (
    <Card key={recipe.id} className={`overflow-hidden ${isRandom ? 'border-primary' : ''}`}>
      {recipe.imageUrl ? (
        <div className="relative w-full h-48">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, replace with placeholder
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/%3E%3Cpath d='M7 2v20'/%3E%3Cpath d='M21 15V2'/%3E%3Cpath d='M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'/%3E%3Cpath d='M18 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'/%3E%3C/svg%3E";
              e.currentTarget.style.padding = "2rem";
              e.currentTarget.style.background = "#f1f1f1";
            }}
          />
          {isRandom && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
              Random Pick
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <Utensils className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {recipe.title}
          {recipe.sourceUrl && (
            <a 
              href={recipe.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </CardTitle>
        <CardDescription>
          {recipe.calories ? `${Math.round(recipe.calories)} calories per serving` : 'Calories information unavailable'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-4">
          <span>Prep: {recipe.prepTime || 'N/A'} mins</span>
          <span>Cook: {recipe.cookTime || 'N/A'} mins</span>
          <span>Serves: {recipe.servings}</span>
        </div>
        <Button variant="outline" className="w-full">
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <Card className="max-w-6xl mx-auto mb-6">
        <CardHeader>
          <CardTitle>Find Recipes</CardTitle>
          <CardDescription>
            Discover recipes based on your preferences and inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Select
                value={filters.mealTypeId}
                onValueChange={(value) => setFilters({...filters, mealTypeId: value})}
              >
                <SelectTrigger id="mealType">
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
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={filters.servings}
                onChange={(e) => setFilters({...filters, servings: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col justify-between space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="use-api" 
                  checked={filters.useApi} 
                  onCheckedChange={(checked) => setFilters({...filters, useApi: checked})}
                />
                <Label htmlFor="use-api">Use Spoonacular API</Label>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  Search Recipes
                </Button>
                <Button variant="outline" onClick={handleRandomRecipe} disabled={isLoadingRandom}>
                  {isLoadingRandom ? 'Loading...' : 'Random'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="allergies" className="mb-2 block">Allergies</Label>
            <div className="flex gap-2 items-center mb-2">
              <Input
                id="allergies"
                placeholder="Add allergy (e.g., peanuts, dairy, gluten)"
                className="flex-1"
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
                variant="secondary"
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
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {allergy}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
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
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or click Add to add an allergy. Recipes containing these ingredients will be excluded.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Random Recipe Section */}
      {randomRecipe && (
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Random Recipe Suggestion</h2>
          <div className="grid grid-cols-1 gap-6">
            {renderRecipeCard(randomRecipe, true)}
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recipes</h2>
        {isRecipesLoading ? (
          <LoadingState />
        ) : recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: Recipe) => renderRecipeCard(recipe))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No recipes found</p>
            <p>Try adjusting your filters or search for different ingredients</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Recipes;
