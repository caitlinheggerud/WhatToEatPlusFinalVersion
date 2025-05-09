/**
 * Utility to clear all favorites data from localStorage
 * This is used to reset the favorites state when there's an inconsistency
 */
export function clearAllFavoritesData() {
  localStorage.removeItem('favorites');
  localStorage.removeItem('favoriteRecipeData');
  // Initialize with empty arrays
  localStorage.setItem('favorites', JSON.stringify([]));
  localStorage.setItem('favoriteRecipeData', JSON.stringify([]));
  
  // Dispatch an event to notify components
  window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
    detail: { favorites: [] } 
  }));
  
  console.log('All favorites data cleared and reset to empty arrays');
}

// Call this function on app load to ensure consistency
if (typeof window !== 'undefined') {
  // Only run in browser environment
  clearAllFavoritesData();
}