import fetch from 'node-fetch';

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

if (!API_KEY) {
  console.error('SPOONACULAR_API_KEY environment variable is not set');
}

// Search recipes
export async function searchRecipes(query: string, diet?: string, mealType?: string, maxReadyTime?: number, intolerances?: string): Promise<any> {
  try {
    // Default query if none provided
    const searchQuery = query || 'main dish';
    
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
      query: searchQuery,
      number: '8',  // Increased from 6 to get more recipes
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      sort: 'popularity',  // Sort by popularity for better results
      instructionsRequired: 'true',  // Ensure recipes have instructions
    });

    if (diet) params.append('diet', diet);
    if (mealType) params.append('type', mealType);
    if (maxReadyTime) params.append('maxReadyTime', maxReadyTime.toString());
    if (intolerances) params.append('intolerances', intolerances);
    
    console.log(`Requesting Spoonacular API: ${searchQuery} ${mealType || ''} ${diet || ''}`);
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params.toString()}`);
    
    if (!response.ok) {
      console.error(`Spoonacular API responded with ${response.status}: ${response.statusText}`);
      if (response.status === 402) {
        throw new Error(`Spoonacular API daily quota exceeded. Try again tomorrow or upgrade the API plan.`);
      }
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as { results: any[], offset: number, number: number, totalResults: number };
    console.log(`Spoonacular API returned ${data.results?.length || 0} recipes`);
    return data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

// Get random recipes
export async function getRandomRecipes(tags?: string[], number: number = 3, intolerances?: string): Promise<any> {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY as string,
      number: number.toString(),
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      instructionsRequired: 'true',  // Ensure recipes have instructions
    });
    
    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }
    
    if (intolerances) {
      params.append('intolerances', intolerances);
    }
    
    console.log(`Requesting random recipes with tags: ${tags?.join(', ') || 'none'}`);
    const response = await fetch(`${BASE_URL}/recipes/random?${params.toString()}`);
    
    if (!response.ok) {
      console.error(`Spoonacular API responded with ${response.status}: ${response.statusText}`);
      if (response.status === 402) {
        throw new Error(`Spoonacular API daily quota exceeded. Try again tomorrow or upgrade the API plan.`);
      }
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as { recipes: any[] };
    console.log(`Spoonacular API returned ${data.recipes?.length || 0} random recipes`);
    return data;
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

// Map Spoonacular recipe to our app's recipe format
export function mapSpoonacularRecipeToAppRecipe(spoonacularRecipe: any) {
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
    imageUrl: spoonacularRecipe.image,
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