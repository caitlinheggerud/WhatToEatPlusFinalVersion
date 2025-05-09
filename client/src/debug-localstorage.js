// Add this to your console in browser to examine localStorage:
console.log('Favorites:', localStorage.getItem('favorites'));
console.log('Favorite recipe data:', localStorage.getItem('favoriteRecipeData'));

// Clear favorites data
localStorage.removeItem('favorites');
localStorage.removeItem('favoriteRecipeData');
console.log('Cleared favorites data');
