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

WhatToEat+ uses a PostgreSQL database with the following key tables:

### Users Table
Stores user account information (for future multi-user support).

### Receipts Table
Stores metadata about scanned receipts:
- Receipt ID (primary key)
- Store name
- Total amount
- Date
- Creation timestamp

### Receipt Items Table
Stores individual items from receipts:
- Item ID (primary key)
- Receipt ID (foreign key)
- Item name
- Description
- Price
- Category
- Creation timestamp

### Inventory Items Table
Tracks current inventory:
- Item ID (primary key)
- Name
- Description
- Category
- Quantity
- Unit
- Expiry date
- Is in inventory flag
- Creation timestamp
- Update timestamp

### Recipes Table
Stores recipe information:
- Recipe ID (primary key)
- Title
- Description
- Image URL
- Instructions
- Preparation time
- Cooking time
- Servings
- Source URL
- Meal type ID (foreign key)
- Creation timestamp
- Update timestamp

### Recipe Ingredients Table
Maps ingredients to recipes:
- ID (primary key)
- Recipe ID (foreign key)
- Name
- Amount
- Unit
- Optional flag

### Meal Types Table
Defines available meal types:
- ID (primary key)
- Name
- Description

### Dietary Preferences Table
Defines dietary preference options:
- ID (primary key)
- Name
- Description

### Recipe Dietary Restrictions Table
Maps recipes to dietary restrictions:
- Recipe ID (foreign key)
- Dietary preference ID (foreign key)

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

## 🤝 Contributing

We welcome contributions to WhatToEat+! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests to ensure functionality
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Standards
- Follow the established code style
- Write tests for new features
- Update documentation for any changes
- Ensure all tests pass before submitting

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