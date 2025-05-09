# WhatToEat+ 🍲

![WhatToEat+ Logo](./generated-icon.png)

WhatToEat+ is a comprehensive culinary and financial intelligence platform that transforms receipt scanning into an intelligent, engaging recipe and expense tracking experience. By capturing grocery receipts, the system automatically tracks your food inventory, provides personalized recipe recommendations, and delivers detailed insights into your spending habits.

## 📝 Table of Contents

- [Overview](#overview)
- [Key Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Database Schema](#-database-schema)
- [Workflow Example](#-workflow-example)
- [Advanced Features](#-advanced-features)
- [Performance Considerations](#-performance-considerations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)
- [Acknowledgements](#-acknowledgements)

## Overview

WhatToEat+ streamlines your grocery shopping, cooking, and meal planning experience by:

1. **Digitizing receipts** using state-of-the-art AI to extract and categorize food items
2. **Managing your food inventory** with expiration date tracking and automatic updates
3. **Recommending personalized recipes** based on what you have on hand
4. **Tracking your grocery spending** with detailed analytics and category breakdowns
5. **Saving your favorite recipes** for future reference

The platform uses multiple AI APIs to deliver a seamless experience, from receipt scanning with Google's Gemini API to recipe suggestions with Spoonacular and image enhancements with DeepAI.

## 🌟 Features

### Receipt Management
- **AI-Powered Receipt Scanning**: Upload receipts in various formats (JPG, PNG, PDF, HEIC) for automatic item extraction using Google's Gemini AI
- **Smart Item Recognition**: Automatically identifies food items, quantities, prices, and categories
- **Expense Categorization**: Intelligently sorts items into categories like "Food," "Household," "Beverages," etc.
- **Receipt History**: Maintains a searchable history of all uploaded receipts with detailed views
- **Receipt Analytics**: Tracks spending patterns over time with detailed breakdowns

### Inventory Management
- **Automated Inventory Updates**: Seamlessly add receipt items to your inventory with a single click
- **Expiration Date Tracking**: Set and monitor expiration dates for perishable items with notifications
- **Search & Filter**: Quickly find items by name, category, or expiration date
- **Stock Level Management**: Track quantities and get alerted when running low on essentials
- **Waste Reduction**: Prioritize recipes using ingredients that will expire soon

### Recipe Discovery
- **Inventory-Based Recommendations**: Get recipe suggestions based on what's currently in your inventory
- **Comprehensive Filtering System**: Find recipes by:
  - Meal type (breakfast, lunch, dinner, dessert, snacks)
  - Dietary preferences (vegetarian, vegan, gluten-free, etc.)
  - Allergen exclusions (peanuts, dairy, shellfish, etc.)
  - Preparation time
  - Complexity level
  - Calorie content
- **Favorites System**: Save and organize favorite recipes for quick access
- **Nutrition Information**: View detailed nutritional breakdown per serving
- **Portion Size Adjustments**: Easily scale recipes based on desired number of servings
- **Alternative Ingredient Suggestions**: Get suggestions for ingredient substitutions when you're missing something

### Spending Analytics
- **Category Breakdown**: Visualize spending by food categories with interactive charts
- **Trend Analysis**: Track spending patterns over time with monthly comparisons
- **Budget Management**: Set category-specific budgets and receive notifications
- **Export Functionality**: Download spending data in CSV format for external analysis
- **Cost Per Meal Insights**: Calculate the average cost per serving for recipes

## 📸 Screenshots

### Dashboard Overview
The main dashboard shows your spending overview, recent receipts, and inventory status at a glance.

### Receipt Scanning Process
The receipt scanning interface guides you through the process of uploading and analyzing your grocery receipts.

### Inventory Management
The inventory management system provides a comprehensive view of all your food items with expiration dates.

### Recipe Recommendations
The recipe recommendation engine suggests meals based on your available ingredients and preferences.

### Spending Analytics
Detailed charts and visualizations help you understand your grocery spending patterns over time.

## 🛠️ Tech Stack

### Frontend
- **React 18**: Component-based UI with functional components and React hooks for state management
- **TypeScript**: Type-safe code with interface definitions for improved development experience
- **Tailwind CSS**: Utility-first CSS framework for responsive and maintainable styling
- **Radix UI**: Headless UI components providing accessible building blocks
- **Recharts**: Responsive and customizable chart library for spending visualizations
- **React Hook Form**: Form validation and state management with zod integration
- **react-query**: Data fetching, caching, and state management for API interactions
- **wouter**: Lightweight routing library for page navigation
- **date-fns**: Date manipulation library for handling dates and times

### Backend
- **Node.js with Express**: Fast, unopinionated web framework for server-side API handling
- **TypeScript**: Type-safe backend implementation with shared types between frontend and backend
- **PostgreSQL**: Robust relational database for persistent storage
- **Drizzle ORM**: Type-safe database schema definition and query building
- **Express-session**: Session management for maintaining user state
- **Zod**: Schema validation for API request and response data
- **Multer**: Middleware for handling file uploads (receipt images)

### AI/ML Integration
- **Google Gemini API**: Advanced multimodal AI for receipt scanning and item extraction
- **Spoonacular API**: Comprehensive food and recipe data API with advanced filtering
- **DeepAI**: Image enhancement API for improving receipt image quality
- **OpenAI API**: (Optional) For potential future features like recipe customization

## 🤖 External API Integration

WhatToEat+ leverages several powerful external APIs to deliver its core functionality. Here's a detailed breakdown of how each API is integrated and utilized:

### Google Gemini API

**Purpose**: Powers the core receipt scanning and item extraction functionality.

**Integration Details**:
- **API Version**: Gemini 2.5 Flash Preview (04-17)
- **Implementation**: Located in `server/routes.ts` in the `/api/receipts/analyze` endpoint
- **Input**: Receipt images (JPG, PNG) uploaded by users
- **Output**: Structured JSON data containing extracted items, prices, and categories
- **Features Utilized**:
  - Multimodal capabilities (both text and image processing)
  - Zero-shot learning for item recognition without explicit training
  - Context-aware understanding of receipt formats and structures

**Processing Flow**:
1. Image is uploaded and converted to base64 format
2. A specialized prompt instructs Gemini on how to process the receipt
3. The multimodal API analyzes text and layout to identify items, prices, and categories
4. Robust error handling and cleaning processes ensure valid JSON output
5. Additional fallback logic calculates missing values (e.g., derives GST if not explicitly found)

**API Optimization**:
- Custom prompting techniques to maximize accuracy
- Resilient parsing that handles various receipt formats
- Sophisticated error handling for edge cases
- JSON sanitation to ensure valid output despite API response variations

**Example Prompt Structure**:
```
Analyze this receipt and extract the items, GST (tax), and total in a simple JSON format.

Format each regular item as:
{"name": "Item Name", "description": "Details if any", "price": "$XX.XX", "category": "Food/Beverage/etc"}

Be sure to include GST/tax:
{"name": "GST", "description": "Goods and Services Tax", "price": "$X.XX", "category": "Tax"}

And the total:
{"name": "TOTAL", "description": "Total Payment", "price": "$XX.XX", "category": "Total"}

Return ONLY a properly formatted JSON array with no explanations.
```

### Spoonacular API

**Purpose**: Provides recipe recommendations, nutritional information, and advanced filtering capabilities.

**Integration Details**:
- **Implementation**: Located in `server/spoonacular.ts` with endpoints exposed in `server/routes.ts`
- **Primary Endpoints Used**:
  - `/recipes/complexSearch`: For filtered recipe search
  - `/recipes/random`: For discovering new recipes
  - `/recipes/{id}/information`: For detailed recipe information
  - `/recipes/{id}/nutritionWidget`: For nutritional breakdown

**Key Features Implemented**:
1. **Recipe Search with Advanced Filtering**:
   - Meal type filtering (breakfast, lunch, dinner, etc.)
   - Dietary preference filtering (vegetarian, vegan, gluten-free, etc.)
   - Allergen exclusion
   - Cooking time filtering
   - Ingredient-based search
   
2. **Recipe Data Transformation**:
   - Custom mapping function (`mapSpoonacularRecipeToAppRecipe`) transforms the API response to match our application's data model
   - Image URL processing for optimal display
   - Ingredient list normalization

3. **Inventory-Based Recipe Matching**:
   - Intelligently matches user's inventory items with recipe ingredients
   - Implements fuzzy matching for ingredients (e.g., "tomatoes" will match "cherry tomatoes")
   - Calculates a "can make" score based on what percentage of ingredients the user has

4. **Nutritional Analysis**:
   - Calculates per-serving nutritional information
   - Provides macro and micronutrient breakdowns
   - Supports serving size adjustments

**Fallback Mechanisms**:
- Local database cache of recipes for when API limits are reached
- Graceful error handling for API outages
- Automatic retry logic for transient errors

**Example API Call Structure**:
```typescript
// Example of a complex recipe search with multiple parameters
export async function searchRecipes(
  query: string,
  diet?: string,
  mealType?: string,
  maxReadyTime?: number,
  intolerances?: string
): Promise<any> {
  const params = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_API_KEY,
    query,
    number: '10',
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    instructionsRequired: 'true'
  });

  if (diet) params.append('diet', diet);
  if (mealType) params.append('type', mealType);
  if (maxReadyTime) params.append('maxReadyTime', maxReadyTime.toString());
  if (intolerances) params.append('intolerances', intolerances);

  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Spoonacular API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}
```

### DeepAI API

**Purpose**: Enhances receipt image quality for improved OCR and item extraction.

**Integration Details**:
- **Implementation**: Located in `server/deepai.ts`
- **Endpoints Used**:
  - `/api/colorizer`: For enhancing black and white or faded receipts
  - `/api/torch-srgan`: For super-resolution to clarify blurry images

**Usage Flow**:
1. **Pre-processing Assessment**:
   - Before sending to Gemini API, receipt images are analyzed for quality issues
   - Low contrast, blurry, or faded receipts are identified for enhancement
   
2. **Image Enhancement Pipeline**:
   - **Color Enhancement**: Improves color balance and contrast
   - **Resolution Enhancement**: Increases clarity of text for better OCR results
   
3. **Integration with Receipt Processing**:
   - Enhanced images are then passed to Gemini API for item extraction
   - Fall back to original image if enhancement fails or times out

**Example Implementation**:
```typescript
export async function enhanceImage(imageUrl: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', imageUrl);

    const response = await fetch('https://api.deepai.org/api/colorizer', {
      method: 'POST',
      headers: {
        'api-key': process.env.DEEPAI_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.output_url;
  } catch (error) {
    console.error('Error enhancing image:', error);
    // Return original image URL as fallback
    return imageUrl;
  }
}
```

### OpenAI API (Optional)

**Purpose**: Adds potential advanced features like natural language recipe customization and personalized recommendations.

**Potential Implementations**:
1. **Recipe Customization**:
   - Natural language processing to understand recipe modification requests
   - Intelligent substitution suggestions for dietary restrictions
   - Cooking technique adaptations based on available equipment

2. **Personalized Nutritional Insights**:
   - Analysis of eating patterns and nutritional balance
   - Personalized recommendations for dietary improvements
   - Natural language explanations of nutritional concepts

3. **Smart Meal Planning**:
   - Generate weekly meal plans based on inventory and preferences
   - Balance nutritional needs across multiple days
   - Accommodate household preferences and dietary restrictions

## API Integration Strategy

### API Key Management
- All API keys are stored as environment variables
- Never exposed to client-side code
- Accessed only through secure server-side endpoints

### Error Handling & Fallbacks
- Comprehensive error handling for all API calls
- Graceful degradation when APIs are unavailable
- Local database fallbacks for essential functionality

### Rate Limiting & Optimization
- Intelligent caching to minimize API calls
- Background processing for non-critical API operations
- Request batching where supported by APIs

### Data Transformation
- Custom mapping functions to transform API responses to application data models
- Consistent error handling and retry mechanisms
- Type-safe interfaces for all API interactions

### DevOps & Infrastructure
- **Vite**: Fast development server and optimized production builds
- **ESLint & Prettier**: Code quality and formatting
- **TypeScript**: Static type checking throughout the codebase
- **npm**: Package management
- **Git**: Version control
- **Railway/Vercel**: Hosting options (recommendations)

## 🏗 Architecture

WhatToEat+ follows a modern web application architecture with clear separation of concerns:

### Client-Server Architecture
- **React Frontend**: Single-page application (SPA) handling UI rendering and state management
- **Express Backend**: RESTful API server handling business logic and database operations
- **PostgreSQL Database**: Persistent storage for all application data

### Key Architectural Patterns
- **Context-based State Management**: Global state for spending data and user preferences
- **Repository Pattern**: Abstraction layer for database operations
- **RESTful API Design**: Clear resource-oriented endpoints for all operations
- **Component-based UI**: Reusable, composable UI components
- **Responsive Design**: Mobile-first approach scaling to desktop

### Data Flow
1. **Receipt Upload**: User uploads a receipt image → Backend processes with Gemini API → Extracted items returned to frontend
2. **Inventory Management**: Receipt items added to inventory → Database updated → UI reflects changes
3. **Recipe Recommendations**: Inventory status → Recipe filtering logic → Personalized recipe suggestions
4. **Spending Analytics**: Receipt data → Aggregation and categorization → Interactive dashboard visualizations

## 📋 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **API keys** for:
  - Google Gemini API (for receipt scanning)
  - Spoonacular API (for recipe data)
  - DeepAI API (for image enhancement)
  - OpenAI API (optional, for advanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whattoeat-plus.git
   cd whattoeat-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root with:
   ```
   # Database connection
   DATABASE_URL=postgresql://username:password@localhost:5432/whattoeat
   
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   DEEPAI_API_KEY=your_deepai_api_key
   OPENAI_API_KEY=your_openai_api_key (optional)
   
   # Application settings
   NODE_ENV=development
   PORT=5000
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```
   This command will create all necessary database tables based on your schema definition.

5. **Seed initial data (optional)**
   ```bash
   npm run seed
   ```
   This will populate the database with sample meal types, dietary preferences, and basic recipes.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

For more detailed setup instructions, including troubleshooting guidance, see [SETUP.md](SETUP.md).

## 🔐 API Documentation

WhatToEat+ provides a comprehensive REST API for interacting with all features of the platform. All endpoints follow RESTful conventions and return JSON responses.

### Authentication and Security
- All API routes use environment variables for secret keys
- API keys for external services are never exposed to the client

### Rate Limiting and Caching
- Spoonacular API responses are cached to minimize usage and improve performance
- Receipt analysis is optimized to reduce Gemini API calls

### Receipt Management Endpoints

#### `POST /api/receipts/analyze`
Analyzes a receipt image using AI to extract items, prices, and categories.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: File upload field named `receipt`

**Response:**
```json
[
  {
    "name": "Milk",
    "description": "Organic Whole Milk",
    "price": "$4.99",
    "category": "Food"
  },
  {
    "name": "Bread",
    "description": "Whole Wheat",
    "price": "$3.49",
    "category": "Food"
  }
]
```

#### `POST /api/receipts/items`
Saves analyzed receipt items to the database.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: Array of receipt items from the analyze endpoint

**Response:**
```json
{
  "id": 123,
  "store": "Unknown Store",
  "totalAmount": "$8.48",
  "date": "2025-05-08T14:32:11.000Z",
  "items": [
    {
      "id": 456,
      "name": "Milk",
      "description": "Organic Whole Milk",
      "price": "$4.99",
      "category": "Food"
    },
    {
      "id": 457,
      "name": "Bread",
      "description": "Whole Wheat",
      "price": "$3.49",
      "category": "Food"
    }
  ]
}
```

#### `GET /api/receipts`
Returns a list of all receipts.

**Response:** Array of receipt objects.

#### `GET /api/receipts/:id`
Returns a specific receipt with its items.

**Response:** Receipt object with items array.

#### `GET /api/receipts/items`
Returns all receipt items, optionally filtered by receipt ID.

**Query Parameters:**
- `receiptId`: (Optional) Filter items by receipt ID

**Response:** Array of receipt item objects.

### Inventory Management Endpoints

#### `GET /api/inventory`
Returns all inventory items.

**Response:** Array of inventory item objects.

#### `POST /api/inventory`
Adds a new item to inventory.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body: Inventory item object

**Response:** Created inventory item object.

#### `PATCH /api/inventory/:id`
Updates an existing inventory item.

**Request:**
- Method: `PATCH`
- Content-Type: `application/json`
- Body: Partial inventory item object with fields to update

**Response:** Updated inventory item object.

#### `DELETE /api/inventory/:id`
Removes an item from inventory.

**Response:** Status 204 No Content on success.

#### `POST /api/receipts/:id/to-inventory`
Adds all items from a receipt to inventory.

**Response:** Array of added inventory item objects.

### Recipe API Endpoints

#### `GET /api/recipes`
Searches for recipes with optional filtering.

**Query Parameters:**
- `searchTerm`: (Optional) Text search
- `mealTypeId`: (Optional) Filter by meal type
- `dietaryRestrictions`: (Optional) Comma-separated list of dietary restriction IDs
- `inventoryBased`: (Optional) Boolean to filter by inventory items
- `servings`: (Optional) Number of servings
- `allergies`: (Optional) Comma-separated list of allergens to exclude
- `useApi`: (Optional) Boolean to control whether to use Spoonacular API (true) or local database (false)

**Response:** Array of recipe objects.

#### `GET /api/recipes/random`
Returns a random recipe with optional filtering.

**Query Parameters:** Same as `/api/recipes`

**Response:** Recipe object.

#### `GET /api/recipes/:id`
Returns a specific recipe with full details.

**Response:** Detailed recipe object including ingredients and instructions.

#### `GET /api/meal-types`
Returns all available meal types.

**Response:** Array of meal type objects.

#### `GET /api/dietary-preferences`
Returns all available dietary preferences.

**Response:** Array of dietary preference objects.

For a complete API reference, including request/response examples, see our API documentation.

## 📱 Project Structure

```
WhatToEat+
├── client/                            # Frontend React application
│   ├── public/                        # Static public assets
│   │   ├── images/                    # Image assets including recipe images
│   │   └── favicon.ico                # Website favicon
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ui/                    # Basic UI components (buttons, cards, etc.)
│   │   │   └── [feature]/             # Feature-specific components
│   │   ├── contexts/                  # React contexts for state management
│   │   │   ├── SpendingContext.tsx    # Global spending data context
│   │   │   └── [other contexts]       # Other application contexts
│   │   ├── hooks/                     # Custom React hooks
│   │   │   └── use-[hook-name].ts     # Custom hook implementations
│   │   ├── lib/                       # Frontend utilities and API clients
│   │   │   ├── api.ts                 # API client functions
│   │   │   └── queryClient.ts         # React Query configuration
│   │   ├── pages/                     # Page components for each route
│   │   │   ├── Dashboard.tsx          # Main dashboard page
│   │   │   ├── Receipts.tsx           # Receipts management page
│   │   │   ├── Inventory.tsx          # Inventory management page
│   │   │   └── Recipes.tsx            # Recipe discovery page
│   │   ├── utils/                     # Helper functions
│   │   │   └── calculateSpendingByCategory.ts  # Spending calculation utilities
│   │   ├── App.tsx                    # Main application component
│   │   └── main.tsx                   # Application entry point
├── server/                            # Backend Express server
│   ├── routes.ts                      # API route definitions
│   ├── storage.ts                     # Database access layer
│   ├── db.ts                          # Database connection
│   ├── seed.ts                        # Database seeding script
│   ├── spoonacular.ts                 # Spoonacular API integration
│   ├── deepai.ts                      # DeepAI integration
│   ├── index.ts                       # Server entry point
│   └── vite.ts                        # Vite server integration
├── shared/                            # Shared TypeScript types and schemas
│   └── schema.ts                      # Database schema and type definitions
├── scripts/                           # Utility scripts
├── .env                               # Environment variables (not in repo)
├── .gitignore                         # Git ignore file
├── package.json                       # NPM package definition
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # Project documentation
```

## 🧩 Key Components

### Dashboard Component
The Dashboard provides an overview of your spending habits with:
- **Spending Summary Cards**: Total spent and breakdowns by category (Food, Household, Other)
- **Interactive Charts**: Visual representations of spending patterns
- **Recent Activity**: List of recently scanned receipts
- **Quick Actions**: Upload receipt, view inventory, explore recipes

Implementation Details:
- Uses `SpendingContext` to access global spending data
- Fetches receipt data and calculates spending metrics
- Renders interactive charts using Recharts library
- Updates automatically when new receipts are added or viewed

### Receipt Scanner Component
The Receipt Scanner handles:
- **Image Upload**: Support for JPG, PNG, PDF, and HEIC formats
- **AI Analysis**: Integration with Google Gemini API
- **Manual Corrections**: UI for adjusting extracted items if needed
- **Data Storage**: Saving analyzed receipts to database

Implementation Details:
- Uses `multer` for handling file uploads
- Sends image data to Gemini API for analysis
- Processes response to extract structured items
- Supports manual editing of extracted items
- Handles edge cases like missing prices or categories

### Inventory Manager Component
The Inventory Manager provides:
- **Item Listing**: Sortable, filterable list of all inventory items
- **Expiration Tracking**: Visual indicators for items nearing expiration
- **Quick Add**: Interface for manually adding items
- **Edit & Delete**: Controls for updating or removing items
- **Receipt Integration**: Automatic adding of items from receipts

Implementation Details:
- Real-time updates when items are added or modified
- Color-coded expiration status indicators
- Modal forms for adding/editing items
- Seamless integration with receipt processing

### Recipe Recommender Component
The Recipe Recommender delivers:
- **Personalized Suggestions**: Based on inventory contents
- **Advanced Filtering**: Multiple filter options
- **Recipe Cards**: Visual presentation of recipes
- **Recipe Details**: Comprehensive view with ingredients, instructions, and nutrition
- **Favorites System**: Save recipes for future reference

Implementation Details:
- Integrates with Spoonacular API for recipe data
- Uses local database for saving favorite recipes
- Implements sophisticated filtering system
- Matches inventory items with recipe ingredients
- Supports portion size adjustments

### Spending Analytics Component
The Spending Analytics module provides:
- **Category Charts**: Breakdown of spending by category
- **Time-Series Analysis**: Spending patterns over time
- **Item-Level Details**: Granular view of individual purchases
- **Export Tools**: Data exporting for external analysis

Implementation Details:
- Uses `SpendingContext` for centralized spending data
- Implements various chart types with Recharts
- Calculates statistics and trends from receipt data
- Updates in real-time when new data is available

## 🗃 Database Schema

WhatToEat+ uses a PostgreSQL database managed through Drizzle ORM for type-safe database operations. The schema is defined in `shared/schema.ts` and provides a comprehensive data model for the application.

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│   Users     │       │   Receipts   │       │  Receipt Items  │
├─────────────┤       ├──────────────┤       ├─────────────────┤
│ id          │       │ id           │       │ id              │
│ username    │       │ store        │       │ receiptId       │─────┐
│ password    │       │ totalAmount  │       │ name            │     │
│ email       │       │ date         │  ┌────│ description     │     │
│ createdAt   │       │ createdAt    │  │    │ price           │     │
└─────────────┘       │ userId       │──┘    │ category        │     │
                      └──────────────┘       │ createdAt       │     │
                            │                └─────────────────┘     │
                            │                                        │
                            ▼                                        │
┌──────────────────┐     ┌────────────────┐                         │
│ Inventory Items  │     │    Recipes     │                         │
├──────────────────┤     ├────────────────┤                         │
│ id               │     │ id             │                         │
│ name             │     │ title          │                         │
│ description      │     │ description    │                         │
│ category         │     │ imageUrl       │                         │
│ quantity         │     │ instructions   │                         │
│ unit             │     │ prepTime       │                         │
│ expiryDate       │     │ cookTime       │                         │
│ isInInventory    │     │ servings       │                         │
│ receiptItemId    │─────┘ sourceUrl      │                         │
│ createdAt        │      │ mealTypeId    │───┐                     │
│ updatedAt        │      │ createdAt     │   │                     │
└──────────────────┘      │ updatedAt     │   │                     │
         ▲                └────────────────┘   │                     │
         │                       │             │                     │
         │                       ▼             │                     │
         │           ┌───────────────────┐     │                     │
         │           │ Recipe Ingredients│     │                     │
         │           ├───────────────────┤     │                     │
         └───────────│ id                │     │                     │
                     │ recipeId          │     │                     │
                     │ name              │     │                     │
                     │ amount            │     │                     │
                     │ unit              │     │                     │
                     │ isOptional        │     │                     │
                     └───────────────────┘     │                     │
                                               │                     │
                      ┌────────────────────┐   │                     │
                      │   Meal Types       │   │                     │
                      ├────────────────────┤   │                     │
                      │ id                 │◄──┘                     │
                      │ name               │                         │
                      │ description        │                         │
                      └────────────────────┘                         │
                                                                     │
┌────────────────────────┐     ┌────────────────────────┐           │
│  Dietary Preferences   │     │Recipe Dietary          │           │
├────────────────────────┤     │Restrictions            │           │
│ id                     │     ├────────────────────────┤           │
│ name                   │◄────│ recipeId               │           │
│ description            │     │ dietaryPreferenceId    │           │
└────────────────────────┘     │                        │           │
                               └────────────────────────┘           │
                                                                    │
┌────────────────────────┐                                          │
│  Favorites             │                                          │
├────────────────────────┤                                          │
│ id                     │                                          │
│ userId                 │                                          │
│ recipeId               │                                          │
│ externalId             │                                          │
│ recipeData             │                                          │
│ createdAt              │                                          │
└────────────────────────┘                                          │
```

### Detailed Schema Definition

The database schema is defined with Drizzle ORM and includes the following tables with their relationships:

### Users Table
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Receipts Table
Stores metadata about scanned receipts with relations to users and receipt items:
```typescript
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  store: text("store").default("Unknown Store"),
  totalAmount: text("total_amount"),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const receiptRelations = relations(receipts, ({ many }) => ({
  items: many(receiptItems),
}));
```

### Receipt Items Table
Stores individual items from receipts with relations back to the parent receipt:
```typescript
export const receiptItems = pgTable("receipt_items", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id")
    .references(() => receipts.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const receiptItemsRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  }),
}));
```

### Inventory Items Table
Tracks current inventory with advanced features like expiration dates:
```typescript
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  quantity: real("quantity").default(1),
  unit: text("unit"),
  expiryDate: timestamp("expiry_date"),
  isInInventory: boolean("is_in_inventory").default(true),
  receiptItemId: integer("receipt_item_id")
    .references(() => receiptItems.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  receiptItem: one(receiptItems, {
    fields: [inventoryItems.receiptItemId],
    references: [receiptItems.id],
  }),
}));
```

### Recipes Table
Stores comprehensive recipe information with complex relationships:
```typescript
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  instructions: text("instructions"),
  prepTime: integer("prep_time"),
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  sourceUrl: text("source_url"),
  mealTypeId: integer("meal_type_id")
    .references(() => mealTypes.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recipeRelations = relations(recipes, ({ many, one }) => ({
  ingredients: many(recipeIngredients),
  dietaryRestrictions: many(recipeDietaryRestrictions),
  mealType: one(mealTypes, {
    fields: [recipes.mealTypeId],
    references: [mealTypes.id],
  }),
}));
```

### Recipe Ingredients Table
Maps ingredients to recipes with detailed quantity information:
```typescript
export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id")
    .references(() => recipes.id)
    .notNull(),
  name: text("name").notNull(),
  amount: real("amount"),
  unit: text("unit"),
  isOptional: boolean("is_optional").default(false),
});

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
}));
```

### Meal Types Table
Defines available meal types (breakfast, lunch, dinner, etc.):
```typescript
export const mealTypes = pgTable("meal_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});
```

### Dietary Preferences Table
Defines dietary preference options (vegetarian, gluten-free, etc.):
```typescript
export const dietaryPreferences = pgTable("dietary_preferences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});
```

### Recipe Dietary Restrictions Table
Many-to-many mapping between recipes and dietary restrictions:
```typescript
export const recipeDietaryRestrictions = pgTable("recipe_dietary_restrictions", {
  recipeId: integer("recipe_id")
    .references(() => recipes.id)
    .notNull(),
  dietaryPreferenceId: integer("dietary_preference_id")
    .references(() => dietaryPreferences.id)
    .notNull(),
});

export const recipeDietaryRestrictionsRelations = relations(recipeDietaryRestrictions, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeDietaryRestrictions.recipeId],
    references: [recipes.id],
  }),
  dietaryPreference: one(dietaryPreferences, {
    fields: [recipeDietaryRestrictions.dietaryPreferenceId],
    references: [dietaryPreferences.id],
  }),
}));
```

### Schema Design Considerations

1. **Type Safety**: The schema leverages TypeScript for full type safety across the stack
2. **Referential Integrity**: Foreign key constraints ensure data consistency
3. **Normalization**: Tables are properly normalized to minimize redundancy
4. **Timestamps**: All tables include creation timestamps for audit trails
5. **Soft Deletion**: Inventory uses boolean flags instead of hard deletion
6. **Flexible Storage**: JSON fields used where appropriate for semi-structured data

## 🔄 Workflow Example

Here's a typical user workflow in WhatToEat+:

1. **Receipt Scanning**
   - User uploads a grocery receipt via the upload interface
   - Gemini AI analyzes the receipt and extracts items, prices, and categories
   - User reviews and confirms the extracted items
   - System saves the receipt and its items to the database
   - Spending data is automatically updated

2. **Inventory Management**
   - User clicks "Add to Inventory" on the receipt details page
   - System adds all receipt items to the inventory
   - User sets expiration dates for perishable items
   - Inventory is updated with the new items

3. **Recipe Discovery**
   - User navigates to the Recipes page
   - System suggests recipes based on the current inventory
   - User applies filters for dietary preferences and meal type
   - System displays matching recipes
   - User selects a recipe to view details

4. **Spending Analysis**
   - User visits the Dashboard
   - System displays spending summary and category breakdowns
   - User explores spending patterns through interactive charts
   - User exports spending data for personal budgeting

5. **Favorite Recipes**
   - User marks recipes as favorites
   - System saves these preferences
   - User easily accesses favorite recipes for meal planning

## 🚀 Advanced Features

### AI-Enhanced Receipt Processing
WhatToEat+ uses Google's Gemini AI model to intelligently extract and categorize items from receipts:
- **Text Recognition**: Accurately identifies item names, prices, and quantities
- **Category Classification**: Automatically assigns items to appropriate categories
- **Receipt Quality Enhancement**: Uses DeepAI to improve image quality when needed
- **Edge Case Handling**: Robust processing for various receipt formats and layouts

### Intelligent Recipe Matching
The recipe recommendation engine goes beyond simple ingredient matching:
- **Semantic Matching**: Understands ingredient similarities and substitutions
- **Preference Learning**: Adapts to user preferences over time
- **Waste Reduction Prioritization**: Suggests recipes using ingredients nearing expiration
- **Nutrition Optimization**: Balances meal suggestions based on nutritional content

### Comprehensive Spending Analytics
The spending dashboard provides deep insights into grocery habits:
- **Trend Identification**: Highlights spending patterns and anomalies
- **Seasonal Analysis**: Compares spending across different seasons
- **Price Tracking**: Monitors price changes for frequently purchased items
- **Budget Integration**: Helps users stay within defined grocery budgets

## ⚡ Performance Considerations

WhatToEat+ is designed for optimal performance:

### Frontend Optimizations
- **Code Splitting**: Loads only necessary code for each page
- **Image Optimization**: Efficient loading of recipe and UI images
- **Memoization**: Uses React.memo and useMemo to prevent unnecessary renders
- **Virtual List**: Efficiently renders large lists of receipts or inventory items

### Backend Optimizations
- **API Caching**: Caches Spoonacular API responses to reduce external calls
- **Database Indexing**: Optimized indexes for frequent queries
- **Query Optimization**: Efficient database queries with Drizzle ORM
- **Rate Limiting**: Protects external API usage limits

### Mobile Responsiveness
- **Responsive Design**: Optimized for all device sizes
- **Touch-Friendly UI**: Designed for both desktop and mobile interaction
- **Offline Support**: Basic functionality works without constant connection

## 🛣 Roadmap

Future enhancements planned for WhatToEat+:

### Short-term (Next 3 Months)
- User account system with authentication
- Meal planning calendar integration
- Barcode scanning for manual inventory additions
- Enhanced recipe search with more filtering options
- Improved mobile experience

### Medium-term (3-6 Months)
- Shopping list generation based on recipe selection
- Social sharing of favorite recipes
- Recipe customization and personal notes
- Advanced budget planning tools
- Nutrition tracking and analysis

### Long-term (6+ Months)
- Meal kit delivery service integration
- Voice assistant compatibility
- Restaurant dish comparison (make vs. buy analysis)
- Personalized nutrition recommendations
- Community features for recipe sharing

## 📊 Client-Side State Management

WhatToEat+ employs a sophisticated state management approach to ensure a responsive, consistent user experience across the application.

### React Context API

The primary state management solution leverages React's Context API for global application state:

```typescript
// SpendingContext.tsx example
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SpendingContextType = {
  categoryTotals: Record<string, number>;
  totalSpent: number;
  updateSpendingData: (items: any[]) => void;
};

const SpendingContext = createContext<SpendingContextType | undefined>(undefined);

export function SpendingProvider({ children }: { children: ReactNode }) {
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState(0);

  function updateSpendingData(items: any[]) {
    // Calculate spending totals by category
    const newCategoryTotals = calculateSpendingByCategory(items);
    setCategoryTotals(newCategoryTotals);
    
    // Calculate total spending
    const newTotalSpent = Object.values(newCategoryTotals).reduce((sum, amount) => sum + amount, 0);
    setTotalSpent(newTotalSpent);
  }

  return (
    <SpendingContext.Provider value={{ categoryTotals, totalSpent, updateSpendingData }}>
      {children}
    </SpendingContext.Provider>
  );
}

export function useSpending() {
  const context = useContext(SpendingContext);
  if (context === undefined) {
    throw new Error('useSpending must be used within a SpendingProvider');
  }
  return context;
}
```

### Key State Management Patterns

1. **Context-Based Global State**
   - `SpendingContext`: Manages global spending data and category breakdowns
   - `InventoryContext`: Tracks current inventory state
   - `UserPreferencesContext`: Stores user preferences for recipes and UI

2. **React Query for Server State**
   - Server data is managed through React Query for automatic caching and revalidation
   - Optimistic updates for improved UX during mutations
   - Background refetching for real-time data sync

```typescript
// Example React Query usage
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventoryItems, updateInventoryItem } from '@lib/api';

// Query hook for fetching inventory items
export function useInventoryItems() {
  return useQuery({
    queryKey: ['/api/inventory'],
    queryFn: getInventoryItems,
  });
}

// Mutation hook for updating inventory items
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      // Invalidate and refetch inventory data
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    },
  });
}
```

3. **Local Component State**
   - Component-specific state using React's useState and useReducer hooks
   - Form state management with React Hook Form
   - UI state for modals, tabs, and accordions

4. **LocalStorage for Persistence**
   - User preferences stored in localStorage
   - Recipe favorites persisted across sessions
   - Recent searches and filters

### State Management Architecture

The application implements a layered state management approach:

1. **UI Layer**: React components with local state for UI interactions
2. **Form Layer**: React Hook Form for complex form state and validation
3. **Domain Layer**: Context API for domain-specific global state
4. **Server Layer**: React Query for server data fetching and synchronization
5. **Persistence Layer**: LocalStorage for cross-session data retention

### State Synchronization

- Receipt data automatically updates spending context
- Inventory updates trigger recipe recommendation recalculations
- User preferences immediately affect the UI and persist across sessions

## 🧪 Testing Strategy

WhatToEat+ implements a comprehensive testing strategy to ensure reliability and quality:

### Unit Testing

- **Framework**: Jest with React Testing Library
- **Coverage Target**: >80% code coverage
- **Focus Areas**:
  - Utility functions 
  - React hooks
  - State management logic
  - Data transformation

**Example Unit Test**:
```typescript
import { calculateSpendingByCategory } from '../utils/calculateSpendingByCategory';

describe('calculateSpendingByCategory', () => {
  it('should correctly aggregate spending by category', () => {
    const items = [
      { name: 'Milk', price: '$4.99', category: 'Food' },
      { name: 'Bread', price: '$3.49', category: 'Food' },
      { name: 'Dish Soap', price: '$2.99', category: 'Household' }
    ];
    
    const result = calculateSpendingByCategory(items);
    
    expect(result).toEqual({
      Food: 8.48,
      Household: 2.99
    });
  });
  
  it('should handle missing or invalid price formats', () => {
    const items = [
      { name: 'Milk', price: 'N/A', category: 'Food' },
      { name: 'Bread', price: '$3.49', category: 'Food' }
    ];
    
    const result = calculateSpendingByCategory(items);
    
    expect(result).toEqual({
      Food: 3.49
    });
  });
});
```

### Integration Testing

- **Focus**: Component interaction and feature workflows
- **Key Workflows Tested**:
  - Receipt scanning and processing
  - Inventory management
  - Recipe recommendation
  - Spending analytics

**Example Integration Test**:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReceiptScannerPage } from '../pages/ReceiptScanner';
import { SpendingProvider } from '../contexts/SpendingContext';
import * as api from '../lib/api';

// Mock API calls
jest.mock('../lib/api');

describe('Receipt Scanner Integration', () => {
  it('should process receipt and update spending data', async () => {
    // Mock successful API response
    api.analyzeReceipt.mockResolvedValue([
      { name: 'Milk', price: '$4.99', category: 'Food' }
    ]);
    
    // Render with necessary providers
    render(
      <SpendingProvider>
        <ReceiptScannerPage />
      </SpendingProvider>
    );
    
    // Upload a test image
    const fileInput = screen.getByLabelText(/upload receipt/i);
    const file = new File(['dummy content'], 'receipt.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(analyzeButton);
    
    // Verify results are displayed
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('$4.99')).toBeInTheDocument();
    });
    
    // Verify spending context is updated
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/total: \$4.99/i)).toBeInTheDocument();
    });
  });
});
```

### End-to-End Testing

- **Framework**: Cypress
- **Critical Paths**:
  - User onboarding flow
  - Receipt upload and processing
  - Recipe search and filtering
  - Adding items to inventory

**Example E2E Test**:
```javascript
describe('Receipt Processing E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('POST', '/api/receipts/analyze', { fixture: 'analyzed_receipt.json' }).as('analyzeReceipt');
    cy.intercept('POST', '/api/receipts/items', { fixture: 'saved_receipt.json' }).as('saveReceipt');
  });
  
  it('should allow uploading and processing a receipt', () => {
    // Click upload button
    cy.findByRole('button', { name: /upload receipt/i }).click();
    
    // Upload test image
    cy.get('input[type="file"]').attachFile('test_receipt.jpg');
    
    // Click analyze button
    cy.findByRole('button', { name: /analyze/i }).click();
    
    // Wait for analysis to complete
    cy.wait('@analyzeReceipt');
    
    // Verify items are displayed
    cy.findByText('Milk').should('be.visible');
    cy.findByText('$4.99').should('be.visible');
    
    // Save receipt
    cy.findByRole('button', { name: /save items/i }).click();
    cy.wait('@saveReceipt');
    
    // Verify success message
    cy.findByText(/receipt saved successfully/i).should('be.visible');
    
    // Navigate to dashboard
    cy.findByRole('link', { name: /dashboard/i }).click();
    
    // Verify spending is updated
    cy.findByText(/total spent/i).siblings().should('contain', '$4.99');
  });
});
```

### Performance Testing

- **Metrics Monitored**:
  - Page load time
  - Time to interactive
  - API response time
  - Animation frame rate

- **Tools**:
  - Lighthouse for performance audits
  - React Profiler for component optimization
  - Chrome DevTools for memory and CPU profiling

### Accessibility Testing

- **Standards**: WCAG 2.1 AA compliance
- **Tools**: 
  - axe-core for automated accessibility checks
  - Manual keyboard navigation testing
  - Screen reader compatibility

## 🚀 Deployment Guidelines

WhatToEat+ is designed for easy deployment across various hosting environments.

### Deployment Options

1. **Docker Deployment**
   - Complete containerization with Docker Compose
   - Separate containers for frontend, backend, and database
   - Environment-specific configuration via Docker environment variables

```yaml
# docker-compose.yml example
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/whattoeat
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - SPOONACULAR_API_KEY=${SPOONACULAR_API_KEY}
      - DEEPAI_API_KEY=${DEEPAI_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=whattoeat
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. **Cloud Platform Deployment**
   - **Vercel**: For frontend hosting
   - **Railway/Render/Heroku**: For backend services
   - **Neon/Supabase**: For PostgreSQL database

3. **Traditional VPS Deployment**
   - Manual setup on Linux VPS
   - Nginx as reverse proxy
   - PM2 for Node.js process management

### Environment Configuration

Create separate environment configurations for different deployment stages:

- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live user-facing environment

Example `.env.production`:
```
# Database
DATABASE_URL=postgresql://production_user:secure_password@production-db.example.com:5432/whattoeat_prod

# API Keys (use environment-specific keys)
GEMINI_API_KEY=prod_gemini_key
SPOONACULAR_API_KEY=prod_spoonacular_key
DEEPAI_API_KEY=prod_deepai_key

# Application settings
NODE_ENV=production
PORT=5000
```

### Deployment Checklist

1. **Pre-Deployment**
   - Run comprehensive test suite
   - Build production assets
   - Verify environment variables
   - Check API key validity

2. **Database Migration**
   - Back up existing database
   - Apply schema migrations
   - Verify data integrity
   - Seed production data if needed

3. **Deployment Process**
   - Deploy backend services
   - Deploy frontend application
   - Verify connectivity between services
   - Run smoke tests on deployed environment

4. **Post-Deployment**
   - Monitor application health
   - Check error logging
   - Verify analytics tracking
   - Monitor external API usage

### Continuous Integration/Deployment

- **GitHub Actions**: Automated build and test pipeline
- **Vercel Integration**: Automatic preview deployments
- **Docker Hub**: Containerized release management

Example GitHub Actions workflow:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🤝 Contributing

We welcome contributions to WhatToEat+! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute.

### Development Environment Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/whattoeat-plus.git
   cd whattoeat-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up local environment**
   Create a `.env.local` file with the necessary configuration:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/whattoeat_dev
   GEMINI_API_KEY=your_development_key
   SPOONACULAR_API_KEY=your_development_key
   DEEPAI_API_KEY=your_development_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Contribution Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow the established code style
   - Add appropriate tests

3. **Run tests**
   ```bash
   npm test
   ```

4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of the changes
   - Link any related issues
   - Include screenshots for UI changes

### Code Standards

- **Linting**: ESLint configuration with Prettier integration
- **TypeScript**: Strict type checking enabled
- **Testing**: Jest for unit tests, React Testing Library for components
- **Documentation**: JSDoc comments for functions and components

### Review Process

1. All PRs require at least one review from a maintainer
2. CI checks must pass before merging
3. Changes should include appropriate tests
4. Documentation should be updated for API changes

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

If you encounter any issues or have questions about WhatToEat+:
- Check the [documentation](docs/)
- Look for similar issues in the issue tracker
- Open a new issue with a detailed description

## 🙏 Acknowledgements

WhatToEat+ builds on amazing tools and services:

- [Google Gemini](https://deepmind.google/technologies/gemini/) for state-of-the-art AI image recognition
- [Spoonacular](https://spoonacular.com/food-api) for comprehensive recipe data
- [DeepAI](https://deepai.org/) for image enhancement capabilities
- [Recharts](https://recharts.org/) for beautiful data visualizations
- [React.js](https://reactjs.org/) and the wider React ecosystem
- [Tailwind CSS](https://tailwindcss.com/) for efficient styling
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Express](https://expressjs.com/) for backend API handling
- [PostgreSQL](https://www.postgresql.org/) for reliable data storage

We're grateful to all the open-source projects that make WhatToEat+ possible!