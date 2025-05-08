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
 * @returns URL of the image
 */
export async function getImageForRecipe(recipeName: string): Promise<string | null> {
  try {
    const images = await searchImages(recipeName, 1);
    
    if (images.length === 0) {
      return getCuratedFoodImage();
    }
    
    return images[0];
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
 * @returns URL of the image
 */
export async function getCachedImageForRecipe(recipeName: string): Promise<string | null> {
  // Check if we have this recipe in the cache
  if (imageCache.has(recipeName)) {
    return imageCache.get(recipeName) || null;
  }
  
  // Get image from Pexels
  const imageUrl = await getImageForRecipe(recipeName);
  
  // Store in cache
  if (imageUrl) {
    imageCache.set(recipeName, imageUrl);
  }
  
  return imageUrl;
}