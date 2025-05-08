import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { fileURLToPath } from 'url';

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure neon connection with websockets
neonConfig.webSocketConstructor = ws;

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define the recipes we want to generate images for
const recipes = [
  {
    id: 1,
    title: 'Avocado Toast with Poached Eggs',
    prompt: 'A professional food photograph of avocado toast with poached eggs on top, garnished with red pepper flakes, high quality, appetizing, on a white plate, soft natural lighting, breakfast food photography style',
    filename: 'avocado-toast.jpg'
  },
  {
    id: 2,
    title: 'Quinoa Salad with Roasted Vegetables',
    prompt: 'A professional food photograph of a quinoa salad with colorful roasted vegetables like bell peppers, zucchini, and red onions, drizzled with olive oil, in a white bowl, bright natural lighting, lunch food photography style',
    filename: 'quinoa-salad.jpg'
  },
  {
    id: 3,
    title: 'Grilled Salmon with Asparagus',
    prompt: 'A professional food photograph of perfectly grilled salmon fillet with asparagus spears on the side, lemon wedge, on a white plate, elegant plating, dinner food photography style, soft lighting',
    filename: 'grilled-salmon.jpg'
  }
];

// Ensure output directory exists
const outputDir = path.join(process.cwd(), 'client', 'public', 'images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to download an image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
};

// Update the database with image URLs
const updateDatabase = async (id, imageUrl) => {
  try {
    await pool.query('UPDATE recipes SET image_url = $1 WHERE id = $2', [imageUrl, id]);
    console.log(`Updated database for recipe ID ${id}`);
  } catch (error) {
    console.error(`Error updating database for recipe ID ${id}:`, error);
  }
};

// Generate and save images
const generateImages = async () => {
  for (const recipe of recipes) {
    try {
      console.log(`Generating image for ${recipe.title}...`);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: recipe.prompt,
        n: 1,
        size: "1024x1024",
      });
      
      const imageUrl = response.data[0].url;
      await downloadImage(imageUrl, recipe.filename);
      
      // Update the database with the path to the local image
      const localImagePath = `/images/${recipe.filename}`;
      await updateDatabase(recipe.id, localImagePath);
      
      console.log(`Completed ${recipe.title}`);
    } catch (error) {
      console.error(`Error generating image for ${recipe.title}:`, error);
    }
  }
  
  // Close the database connection
  await pool.end();
  console.log('All images generated and database updated!');
};

// Run the script
generateImages().catch(console.error);