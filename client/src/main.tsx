import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title and meta description
document.title = "小票识别应用 | Receipt Scanner";
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = '上传小票照片，自动识别消费项目。使用Gemini API提取小票内容，便于花销分析。';
document.head.appendChild(metaDescription);

// Open Graph tags for better social media sharing
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = '小票识别应用 | Receipt Scanner';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = '上传小票照片，自动识别消费项目。使用Gemini API提取小票内容，便于花销分析。';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
