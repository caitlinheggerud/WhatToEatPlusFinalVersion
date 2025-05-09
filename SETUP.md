# WhatToEat+ Setup Guide

This document provides detailed instructions for setting up and running the WhatToEat+ application, both for development and deployment environments.

## Development Environment Setup

### System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Git**: For version control

### Step 1: Database Setup

1. **Install PostgreSQL** if not already installed:
   - [PostgreSQL Downloads](https://www.postgresql.org/download/)

2. **Create a new PostgreSQL database**:
   ```sql
   CREATE DATABASE whattoeat;
   CREATE USER whattoeat_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE whattoeat TO whattoeat_user;
   ```

3. **Note your database connection details** for the next steps.

### Step 2: API Keys Setup

You'll need to register for the following API services:

1. **Google Gemini API**:
   - Go to [Google AI Studio](https://ai.google.dev/)
   - Sign up and create a project
   - Generate an API key
   - Note the API key for later use

2. **Spoonacular API**:
   - Visit [Spoonacular API Console](https://spoonacular.com/food-api/console)
   - Sign up for an account
   - Subscribe to a plan (they offer a free tier)
   - Generate an API key
   - Note the API key for later use

3. **DeepAI API** (for image enhancement):
   - Go to [DeepAI](https://deepai.org/)
   - Create an account
   - Get your API key from the dashboard
   - Note the API key for later use

4. **OpenAI API** (Optional):
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account
   - Generate an API key
   - Note the API key for later use

### Step 3: Application Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/whattoeat-plus.git
   cd whattoeat-plus
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env` file in the project root:
   ```
   # Database connection
   DATABASE_URL=postgresql://whattoeat_user:your_password@localhost:5432/whattoeat
   
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   DEEPAI_API_KEY=your_deepai_api_key
   OPENAI_API_KEY=your_openai_api_key (optional)
   
   # Application settings
   NODE_ENV=development
   PORT=5000
   ```

4. **Initialize the database**:
   ```bash
   npm run db:push
   ```
   This command will create all the necessary tables based on the schema defined in `shared/schema.ts`.

5. **Seed initial data** (optional):
   ```bash
   npm run seed
   ```
   This will populate the database with sample data for meal types, dietary preferences, and a few basic recipes.

### Step 4: Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Open your browser and navigate to `http://localhost:5000`
   - The application should be up and running!

## Common Issues and Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Check that PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Verify your `.env` file has the correct `DATABASE_URL`

3. Ensure your PostgreSQL user has the correct permissions:
   ```sql
   GRANT ALL PRIVILEGES ON SCHEMA public TO whattoeat_user;
   ```

### API Integration Issues

If API calls are failing:

1. Verify your API keys are correctly set in the `.env` file
2. Check API service status pages for any outages
3. Ensure you haven't exceeded API rate limits (especially on free tiers)
4. Check the server logs for detailed error messages:
   ```bash
   npm run dev
   ```

### Frontend Build Issues

If you encounter problems with the frontend build:

1. Clear the build cache:
   ```bash
   npm run clean
   ```

2. Rebuild node modules:
   ```bash
   rm -rf node_modules
   npm install
   ```

## Production Deployment

For deploying to production, consider:

1. **Environment Variables**:
   - Set `NODE_ENV=production` in your environment
   - Secure your API keys using environment variable management in your hosting platform

2. **Build for Production**:
   ```bash
   npm run build
   ```

3. **Start the Production Server**:
   ```bash
   npm start
   ```

4. **Database Considerations**:
   - Use a managed PostgreSQL service for production (AWS RDS, Digital Ocean, etc.)
   - Set up regular database backups
   - Consider implementing database migration strategies for version updates

5. **Hosting Options**:
   - Vercel: Great for Next.js applications
   - Railway: Simple PostgreSQL + Node.js setup
   - Heroku: Straightforward deployment with PostgreSQL add-ons
   - AWS, Google Cloud, or Azure: For more complex infrastructure needs

## Security Considerations

1. **API Keys**: Never commit API keys to your repository. Use environment variables.

2. **Database Security**:
   - Use strong passwords
   - Limit database user permissions
   - Enable SSL for database connections in production

3. **User Authentication**:
   - Implement proper authentication if adding user accounts
   - Use HTTPS in production
   - Consider implementing rate limiting on API endpoints

## Updating The Application

1. **Pull the latest changes**:
   ```bash
   git pull origin main
   ```

2. **Install any new dependencies**:
   ```bash
   npm install
   ```

3. **Update the database schema** (if needed):
   ```bash
   npm run db:push
   ```

4. **Restart the application**:
   ```bash
   npm run dev
   ```

## Contributing

For development contributions, please:

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Write tests for new features
5. Create a pull request with detailed description

See [CONTRIBUTING.md](CONTRIBUTING.md) for more detailed information.

## Need Help?

If you encounter any issues not covered in this guide, please:

1. Check the GitHub issues page for similar problems
2. Create a new issue with detailed information about your problem
3. Join our community Discord server for real-time help