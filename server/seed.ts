import { db } from './db';
import { 
  mealTypes, 
  dietaryPreferences,
  recipes,
  recipeIngredients,
  recipeDietaryRestrictions
} from '@shared/schema';

// Export as a named export 'seed'
export const seed = async () => {
  try {
    console.log('Starting database seeding...');
    await seedMealTypes();
    await seedDietaryPreferences();
    await seedSampleRecipes();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

async function seedMealTypes() {
  // Check if meal types already exist
  const existingMealTypes = await db.select().from(mealTypes);
  if (existingMealTypes.length > 0) {
    console.log('Meal types already seeded, skipping...');
    return;
  }

  // Seed meal types
  const mealTypeData = [
    { name: 'Breakfast', description: 'Morning meals' },
    { name: 'Lunch', description: 'Midday meals' },
    { name: 'Dinner', description: 'Evening meals' },
    { name: 'Dessert', description: 'Sweet treats' },
    { name: 'Snack', description: 'Between-meal bites' }
  ];

  console.log('Seeding meal types...');
  await db.insert(mealTypes).values(mealTypeData);
}

async function seedDietaryPreferences() {
  // Check if dietary preferences already exist
  const existingPreferences = await db.select().from(dietaryPreferences);
  if (existingPreferences.length > 0) {
    console.log('Dietary preferences already seeded, skipping...');
    return;
  }

  // Seed dietary preferences
  const dietaryPreferenceData = [
    { name: 'Vegetarian', description: 'No meat, may include eggs and dairy' },
    { name: 'Vegan', description: 'No animal products' },
    { name: 'Gluten-Free', description: 'No wheat, barley, or rye' },
    { name: 'Dairy-Free', description: 'No milk products' },
    { name: 'Nut-Free', description: 'No nuts' },
    { name: 'Keto', description: 'Low carb, high fat' },
    { name: 'Paleo', description: 'Based on foods similar to what might have been eaten during the Paleolithic era' }
  ];

  console.log('Seeding dietary preferences...');
  await db.insert(dietaryPreferences).values(dietaryPreferenceData);
}

async function seedSampleRecipes() {
  // Check if recipes already exist
  const existingRecipes = await db.select().from(recipes);
  if (existingRecipes.length > 0) {
    console.log('Recipes already seeded, skipping...');
    return;
  }

  // First get meal type IDs for reference
  const mealTypesList = await db.select().from(mealTypes);
  const mealTypeMap = new Map(mealTypesList.map(mt => [mt.name, mt.id]));

  // Get dietary preference IDs
  const dietaryPreferencesList = await db.select().from(dietaryPreferences);
  const dietaryPreferenceMap = new Map(dietaryPreferencesList.map(dp => [dp.name, dp.id]));

  console.log('Seeding sample recipes...');

  // Breakfast recipe
  const [breakfastRecipe] = await db.insert(recipes).values({
    title: 'Avocado Toast with Poached Eggs',
    instructions: '1. Toast bread\n2. Mash avocado and spread on toast\n3. Poach eggs\n4. Place eggs on top\n5. Season with salt, pepper, and red pepper flakes',
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    calories: 320,
    mealTypeId: mealTypeMap.get('Breakfast')
  }).returning();

  await db.insert(recipeIngredients).values([
    { recipeId: breakfastRecipe.id, name: 'Whole grain bread', amount: '1', unit: 'slice', optional: false },
    { recipeId: breakfastRecipe.id, name: 'Avocado', amount: '1/2', unit: 'whole', optional: false },
    { recipeId: breakfastRecipe.id, name: 'Eggs', amount: '2', unit: 'whole', optional: false },
    { recipeId: breakfastRecipe.id, name: 'Salt', amount: '1/4', unit: 'tsp', optional: false },
    { recipeId: breakfastRecipe.id, name: 'Black pepper', amount: '1/8', unit: 'tsp', optional: false },
    { recipeId: breakfastRecipe.id, name: 'Red pepper flakes', amount: '1/8', unit: 'tsp', optional: true }
  ]);

  await db.insert(recipeDietaryRestrictions).values([
    { recipeId: breakfastRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Vegetarian') || 1 },
    { recipeId: breakfastRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Gluten-Free') || 3 }
  ]);

  // Lunch recipe
  const [lunchRecipe] = await db.insert(recipes).values({
    title: 'Quinoa Salad with Roasted Vegetables',
    instructions: '1. Cook quinoa according to package instructions\n2. Roast bell peppers, zucchini, and onions\n3. Mix quinoa and vegetables\n4. Dress with olive oil and lemon juice\n5. Season with salt and pepper',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    calories: 380,
    mealTypeId: mealTypeMap.get('Lunch')
  }).returning();

  await db.insert(recipeIngredients).values([
    { recipeId: lunchRecipe.id, name: 'Quinoa', amount: '1', unit: 'cup', optional: false },
    { recipeId: lunchRecipe.id, name: 'Bell peppers', amount: '2', unit: 'whole', optional: false },
    { recipeId: lunchRecipe.id, name: 'Zucchini', amount: '1', unit: 'whole', optional: false },
    { recipeId: lunchRecipe.id, name: 'Red onion', amount: '1/2', unit: 'whole', optional: false },
    { recipeId: lunchRecipe.id, name: 'Olive oil', amount: '2', unit: 'tbsp', optional: false },
    { recipeId: lunchRecipe.id, name: 'Lemon juice', amount: '1', unit: 'tbsp', optional: false },
    { recipeId: lunchRecipe.id, name: 'Salt', amount: '1/2', unit: 'tsp', optional: false },
    { recipeId: lunchRecipe.id, name: 'Black pepper', amount: '1/4', unit: 'tsp', optional: false }
  ]);

  await db.insert(recipeDietaryRestrictions).values([
    { recipeId: lunchRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Vegetarian') || 1 },
    { recipeId: lunchRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Vegan') || 2 },
    { recipeId: lunchRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Gluten-Free') || 3 }
  ]);

  // Dinner recipe
  const [dinnerRecipe] = await db.insert(recipes).values({
    title: 'Grilled Salmon with Asparagus',
    instructions: '1. Season salmon with salt, pepper, and lemon zest\n2. Grill salmon for 4-5 minutes per side\n3. Trim asparagus and toss with olive oil, salt, and pepper\n4. Grill asparagus for 3-4 minutes\n5. Serve salmon with asparagus and lemon wedges',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 420,
    mealTypeId: mealTypeMap.get('Dinner')
  }).returning();

  await db.insert(recipeIngredients).values([
    { recipeId: dinnerRecipe.id, name: 'Salmon fillets', amount: '2', unit: 'fillets', optional: false },
    { recipeId: dinnerRecipe.id, name: 'Asparagus', amount: '1', unit: 'bunch', optional: false },
    { recipeId: dinnerRecipe.id, name: 'Olive oil', amount: '2', unit: 'tbsp', optional: false },
    { recipeId: dinnerRecipe.id, name: 'Lemon', amount: '1', unit: 'whole', optional: false },
    { recipeId: dinnerRecipe.id, name: 'Salt', amount: '1', unit: 'tsp', optional: false },
    { recipeId: dinnerRecipe.id, name: 'Black pepper', amount: '1/2', unit: 'tsp', optional: false }
  ]);

  await db.insert(recipeDietaryRestrictions).values([
    { recipeId: dinnerRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Gluten-Free') || 3 },
    { recipeId: dinnerRecipe.id, dietaryPreferenceId: dietaryPreferenceMap.get('Dairy-Free') || 4 }
  ]);
}
