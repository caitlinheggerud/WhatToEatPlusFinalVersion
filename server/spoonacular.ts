import fetch from 'node-fetch';
import { getCachedImageForRecipe } from './pexels';

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

if (!API_KEY) {
  console.error('SPOONACULAR_API_KEY environment variable is not set');
}

// Search recipes
export async function searchRecipes(query: string, diet?: string, mealType?: string, maxReadyTime?: number): Promise<any> {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
      query,
      number: '6',
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    });

    if (diet) params.append('diet', diet);
    if (mealType) params.append('type', mealType);
    if (maxReadyTime) params.append('maxReadyTime', maxReadyTime.toString());
    
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

// Get random recipes
export async function getRandomRecipes(tags?: string[], number: number = 3): Promise<any> {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
      number: number.toString(),
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    });
    
    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }
    
    const response = await fetch(`${BASE_URL}/recipes/random?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting random recipes:', error);
    throw error;
  }
}

// Get recipe by ID
export async function getRecipeById(id: number): Promise<any> {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
      includeNutrition: 'true',
    });
    
    const response = await fetch(`${BASE_URL}/recipes/${id}/information?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting recipe with ID ${id}:`, error);
    throw error;
  }
}

// Map Spoonacular recipe to our app's recipe format with Pexels images
export async function mapSpoonacularRecipeToAppRecipe(spoonacularRecipe: any) {
  // Extract meal type and map to our IDs
  let mealTypeId = null;
  if (spoonacularRecipe.dishTypes && spoonacularRecipe.dishTypes.length > 0) {
    const dishType = spoonacularRecipe.dishTypes[0].toLowerCase();
    if (dishType.includes('breakfast')) {
      mealTypeId = 1; // Breakfast
    } else if (dishType.includes('lunch')) {
      mealTypeId = 2; // Lunch
    } else if (dishType.includes('dinner') || dishType.includes('main course')) {
      mealTypeId = 3; // Dinner
    } else if (dishType.includes('dessert')) {
      mealTypeId = 4; // Dessert
    } else if (dishType.includes('snack') || dishType.includes('appetizer')) {
      mealTypeId = 5; // Snack
    }
  }

  // Calculate total time (prep + cooking time)
  const prepTime = spoonacularRecipe.preparationMinutes || spoonacularRecipe.readyInMinutes ? Math.floor(spoonacularRecipe.readyInMinutes / 3) : null;
  const cookTime = spoonacularRecipe.cookingMinutes || spoonacularRecipe.readyInMinutes ? Math.floor(spoonacularRecipe.readyInMinutes * 2 / 3) : null;

  // Get a better image from Pexels
  const pexelsImage = await getCachedImageForRecipe(spoonacularRecipe.title);

  return {
    id: spoonacularRecipe.id,
    title: spoonacularRecipe.title,
    instructions: spoonacularRecipe.instructions || '',
    prepTime,
    cookTime,
    servings: spoonacularRecipe.servings || 2,
    calories: spoonacularRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || null,
    // Use Pexels image if available, otherwise fall back to Spoonacular image
    imageUrl: pexelsImage || spoonacularRecipe.image,
    mealTypeId,
    sourceUrl: spoonacularRecipe.sourceUrl,
    ingredients: spoonacularRecipe.extendedIngredients?.map((ingredient: any) => ({
      id: ingredient.id,
      name: ingredient.name,
      amount: ingredient.amount.toString(),
      unit: ingredient.unit,
      original: ingredient.original,
      optional: false
    })) || []
  };
}

// Synchronous version of the mapper for cases where we can't use async
export function mapSpoonacularRecipeToAppRecipeSync(spoonacularRecipe: any) {
  // Extract meal type and map to our IDs
  let mealTypeId = null;
  if (spoonacularRecipe.dishTypes && spoonacularRecipe.dishTypes.length > 0) {
    const dishType = spoonacularRecipe.dishTypes[0].toLowerCase();
    if (dishType.includes('breakfast')) {
      mealTypeId = 1; // Breakfast
    } else if (dishType.includes('lunch')) {
      mealTypeId = 2; // Lunch
    } else if (dishType.includes('dinner') || dishType.includes('main course')) {
      mealTypeId = 3; // Dinner
    } else if (dishType.includes('dessert')) {
      mealTypeId = 4; // Dessert
    } else if (dishType.includes('snack') || dishType.includes('appetizer')) {
      mealTypeId = 5; // Snack
    }
  }

  // Calculate total time (prep + cooking time)
  const prepTime = spoonacularRecipe.preparationMinutes || spoonacularRecipe.readyInMinutes ? Math.floor(spoonacularRecipe.readyInMinutes / 3) : null;
  const cookTime = spoonacularRecipe.cookingMinutes || spoonacularRecipe.readyInMinutes ? Math.floor(spoonacularRecipe.readyInMinutes * 2 / 3) : null;

  return {
    id: spoonacularRecipe.id,
    title: spoonacularRecipe.title,
    instructions: spoonacularRecipe.instructions || '',
    prepTime,
    cookTime,
    servings: spoonacularRecipe.servings || 2,
    calories: spoonacularRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || null,
    imageUrl: spoonacularRecipe.image, // Use Spoonacular image only
    mealTypeId,
    sourceUrl: spoonacularRecipe.sourceUrl,
    ingredients: spoonacularRecipe.extendedIngredients?.map((ingredient: any) => ({
      id: ingredient.id,
      name: ingredient.name,
      amount: ingredient.amount.toString(),
      unit: ingredient.unit,
      original: ingredient.original,
      optional: false
    })) || []
  };
}