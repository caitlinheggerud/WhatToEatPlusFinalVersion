import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title and meta description
document.title = "Receipt Scanner App";
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Upload receipt photos and automatically identify purchased items. Uses Gemini API to extract receipt content for expense analysis.';
document.head.appendChild(metaDescription);

// Open Graph tags for better social media sharing
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = 'Receipt Scanner App';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Upload receipt photos and automatically identify purchased items. Uses Gemini API to extract receipt content for expense analysis.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
