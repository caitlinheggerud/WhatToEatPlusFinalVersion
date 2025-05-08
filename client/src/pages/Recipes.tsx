import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { Utensils } from 'lucide-react';

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
}

function Recipes() {
  const [filters, setFilters] = useState({
    mealTypeId: '',
    inventoryBased: true,
    servings: '2'
  });

  // Fetch meal types
  const { data: mealTypes, isLoading: isMealTypesLoading, error: mealTypesError } = useQuery({
    queryKey: ['/api/meal-types'],
    retry: 1,
  });

  // Fetch recipes based on filters
  const { data: recipes, isLoading: isRecipesLoading, error: recipesError, refetch: refetchRecipes } = useQuery({
    queryKey: ['/api/recipes', filters],
    enabled: false, // We'll manually trigger this query
  });

  const handleSearch = () => {
    refetchRecipes();
  };

  const handleRandomRecipe = () => {
    // In a real app, this would call the random recipe endpoint
    alert('Random recipe feature coming soon!');
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
                  <SelectItem value="">All meal types</SelectItem>
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
            
            <div className="flex items-end space-x-2">
              <Button onClick={handleSearch} className="flex-1">
                Search Recipes
              </Button>
              <Button variant="outline" onClick={handleRandomRecipe}>
                Random
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="max-w-6xl mx-auto">
        {isRecipesLoading ? (
          <LoadingState />
        ) : recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: Recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                {recipe.imageUrl ? (
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Utensils className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription>
                    {recipe.calories && `${recipe.calories} calories per serving`}
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
            ))}
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
