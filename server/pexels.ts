import fetch from 'node-fetch';

const API_KEY = process.env.PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

if (!API_KEY) {
  console.error('PEXELS_API_KEY environment variable is not set');
}

/**
 * Search for images on Pexels API
 * @param query Search query
 * @param perPage Number of images to return
 * @returns Array of image URLs
 */
export async function searchImages(query: string, perPage: number = 1): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: {
        'Authorization': API_KEY as string
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    
    if (!data.photos || data.photos.length === 0) {
      // If no results for specific query, try a more generic food query
      if (!query.toLowerCase().includes('food') && !query.toLowerCase().includes('meal')) {
        return searchImages(`${query} food`, perPage);
      }
      return [];
    }

    // Return array of image URLs
    return data.photos.map((photo: any) => photo.src.large);
  } catch (error) {
    console.error('Error searching images on Pexels:', error);
    return [];
  }
}

/**
 * Get a curated food image
 * @returns URL of a curated food image
 */
export async function getCuratedFoodImage(): Promise<string | null> {
  try {
    // Try to get a curated food image
    const foodQueries = ['healthy food', 'delicious meal', 'home cooking', 'fresh ingredients'];
    const randomQuery = foodQueries[Math.floor(Math.random() * foodQueries.length)];
    
    const images = await searchImages(randomQuery, 1);
    return images.length > 0 ? images[0] : null;
  } catch (error) {
    console.error('Error getting curated food image:', error);
    return null;
  }
}

/**
 * Get image for recipe
 * @param recipeName Recipe name or keywords
 * @param ingredients List of main ingredients
 * @returns URL of the image
 */
export async function getImageForRecipe(recipeName: string, ingredients: string[] = []): Promise<string | null> {
  try {
    // Clean up recipe name by removing special characters
    const cleanedRecipeName = recipeName.replace(/[^\w\s]/gi, '');
    
    // Extract main keywords from recipe name
    const recipeWords = cleanedRecipeName.split(' ')
      .filter(word => word.length > 3) // Only keep words with more than 3 characters
      .map(word => word.toLowerCase());
    
    // Create a more specific query by combining recipe name with main ingredients
    let specificQuery = cleanedRecipeName;
    
    // Add the most relevant ingredients to the query (max 2)
    if (ingredients && ingredients.length > 0) {
      const mainIngredients = ingredients
        .filter(ing => ing && ing.trim().length > 0)
        .slice(0, 2) // Take max 2 ingredients
        .join(' ');
      
      if (mainIngredients) {
        specificQuery = `${cleanedRecipeName} with ${mainIngredients}`;
      }
    }
    
    console.log(`Searching Pexels for: ${specificQuery}`);
    const images = await searchImages(specificQuery, 1);
    
    if (images.length > 0) {
      return images[0];
    }
    
    // If no results, try just the recipe name
    console.log(`No results for specific query, trying just recipe name: ${cleanedRecipeName}`);
    const basicImages = await searchImages(cleanedRecipeName, 1);
    
    if (basicImages.length > 0) {
      return basicImages[0];
    }
    
    // If all else fails, use the first ingredient as search term
    if (ingredients && ingredients.length > 0) {
      const mainIngredient = ingredients[0];
      console.log(`Trying with main ingredient: ${mainIngredient}`);
      const ingredientImages = await searchImages(`${mainIngredient} food`, 1);
      
      if (ingredientImages.length > 0) {
        return ingredientImages[0];
      }
    }
    
    // Last resort: curated food image
    return getCuratedFoodImage();
  } catch (error) {
    console.error('Error getting image for recipe:', error);
    return getCuratedFoodImage();
  }
}

// Cache for storing recently queried images to avoid rate limiting
const imageCache: Map<string, string> = new Map();

/**
 * Get image for recipe with caching
 * @param recipeName Recipe name or keywords
 * @param ingredients List of main ingredients
 * @returns URL of the image
 */
export async function getCachedImageForRecipe(recipeName: string, ingredients: string[] = []): Promise<string | null> {
  // Create a cache key that includes ingredients to ensure better matches
  const cacheKey = ingredients && ingredients.length > 0 ? 
    `${recipeName}_${ingredients.slice(0, 3).join('_')}` : recipeName;
  
  // Check if we have this recipe in the cache
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }
  
  // Get image from Pexels
  const imageUrl = await getImageForRecipe(recipeName, ingredients);
  
  // Store in cache
  if (imageUrl) {
    imageCache.set(cacheKey, imageUrl);
  }
  
  return imageUrl;
}