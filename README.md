# WhatToEat+ 🍲

![WhatToEat+ Logo](./generated-icon.png)

WhatToEat+ is a comprehensive culinary and financial intelligence platform that transforms receipt scanning into an intelligent, engaging recipe and expense tracking experience. It helps you manage your food inventory, discover personalized recipes based on what you have, and track your grocery spending habits.

## 🌟 Features

### Receipt Management
- **AI-Powered Receipt Scanning**: Upload and automatically extract items from your grocery receipts using Google's Gemini AI
- **Expense Tracking**: Automatically categorize and track spending on food, household items, and more
- **Spending Analytics**: View dynamic spending breakdowns by category with visual charts

### Inventory Management
- **Smart Inventory Tracking**: Automatically add receipt items to your inventory with a single click
- **Expiration Date Tracking**: Track when your food items will expire
- **Inventory-Based Recipe Suggestions**: Get recipe ideas based on what's in your inventory

### Recipe Discovery
- **Personalized Recommendations**: Find recipes that match your available ingredients
- **Filtering Options**: Filter by meal type, dietary preferences, and allergens
- **Favorites System**: Save your favorite recipes for quick access
- **Nutrition Information**: View calorie counts and portion sizes

## 🛠️ Tech Stack

### Frontend
- **React**: Component-based UI with functional components and hooks
- **TypeScript**: Type-safe code for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible UI components
- **Recharts**: Responsive charts for spending visualization
- **React Hook Form**: Form validation and management

### Backend
- **Node.js with Express**: Server-side API handling
- **PostgreSQL**: Relational database storage
- **Drizzle ORM**: Database schema and query management
- **TypeScript**: Shared types between frontend and backend

### AI/ML Integration
- **Google Gemini API**: For receipt scanning and item extraction
- **Spoonacular API**: For recipe recommendations and nutritional information
- **DeepAI**: For image enhancement

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- API keys for:
  - Google Gemini
  - Spoonacular (for recipe API)
  - OpenAI (optional, for advanced features)
  - DeepAI (for image enhancement)

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
   DATABASE_URL=postgresql://username:password@localhost:5432/whattoeat
   GEMINI_API_KEY=your_gemini_api_key
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   OPENAI_API_KEY=your_openai_api_key (optional)
   DEEPAI_API_KEY=your_deepai_api_key
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:5000` in your web browser

## 📱 App Structure

```
WhatToEat+
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React context providers (SpendingContext, etc.)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Frontend utilities and API clients
│   │   ├── pages/      # Page components for each route
│   │   └── utils/      # Helper functions
├── server/             # Backend Express server
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Database access layer
│   ├── db.ts           # Database connection
│   ├── spoonacular.ts  # Spoonacular API integration
│   └── deepai.ts       # DeepAI integration
└── shared/             # Shared TypeScript types and schemas
    └── schema.ts       # Database schema and types
```

## 🔐 API Authentication

The application integrates with several external APIs:

1. **Google Gemini API**: Used for intelligent receipt scanning and item extraction
2. **Spoonacular API**: Used for recipe search and nutritional information
3. **DeepAI**: Used for image enhancement
4. **OpenAI API**: (Optional) For future AI-powered features

API keys should be obtained from the respective services and added to your environment variables.

## 🌐 Web API Endpoints

### Receipt Management
- `POST /api/receipts/analyze` - Upload and analyze a receipt image
- `POST /api/receipts/items` - Save receipt items from analysis
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get a specific receipt with its items
- `GET /api/receipts/items` - Get all receipt items

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add a new item to inventory
- `PATCH /api/inventory/:id` - Update an inventory item
- `DELETE /api/inventory/:id` - Remove an item from inventory
- `POST /api/receipts/:id/to-inventory` - Add receipt items to inventory

### Recipe API
- `GET /api/recipes` - Search recipes with filtering
- `GET /api/recipes/random` - Get a random recipe with filters
- `GET /api/recipes/:id` - Get a specific recipe with details
- `GET /api/meal-types` - Get available meal types
- `GET /api/dietary-preferences` - Get available dietary preferences

## 🧩 Key Components

### Dashboard
The Dashboard provides an overview of your spending habits with categorized charts and spending breakdowns.

### Receipts
The Receipts page allows you to view all uploaded receipts, see detailed breakdowns of items, and add those items to your inventory.

### Inventory
The Inventory page shows all your food items, their expiration dates, and allows for easy management.

### Recipes
The Recipes section provides personalized recipe recommendations based on your inventory, dietary preferences, and meal types.

## 📊 Spending Dashboard

The Spending Dashboard visualizes your grocery expenses:

- **Total Spent**: Overall amount spent on groceries
- **Category Breakdown**: Spending per category (Food, Household, etc.)
- **Item List**: Detailed list of all purchased items
- **Charts**: Visual representations of spending patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI image recognition
- [Spoonacular](https://spoonacular.com/food-api) for recipe data
- [DeepAI](https://deepai.org/) for image enhancement
- [Recharts](https://recharts.org/) for data visualization
- [React.js](https://reactjs.org/) and the wider React ecosystem
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://orm.drizzle.team/) for database management