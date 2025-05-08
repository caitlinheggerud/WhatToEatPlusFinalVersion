import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";

// Set page title and meta description
document.title = "WhatToEat+ | Smart Food Inventory & Recipes";
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Track your food inventory from receipts and discover personalized recipes based on what you have. AI-powered meal suggestions and nutritional insights.';
document.head.appendChild(metaDescription);

// Open Graph tags for better social media sharing
const ogTitle = document.createElement('meta');
ogTitle.setAttribute('property', 'og:title');
ogTitle.content = 'WhatToEat+ | Smart Food Inventory & Recipes';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.setAttribute('property', 'og:description');
ogDescription.content = 'Track your food inventory from receipts and discover personalized recipes based on what you have. AI-powered meal suggestions and nutritional insights.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.setAttribute('property', 'og:type');
ogType.content = 'website';
document.head.appendChild(ogType);

// Before rendering, remove any dark mode classes that might be added
if (document.documentElement.classList.contains('dark')) {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
    <App />
  </ThemeProvider>
);
