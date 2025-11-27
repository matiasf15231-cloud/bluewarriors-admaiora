import { GoogleGenerativeAI } from "@google/generative-ai";

// WARNING: Storing API keys in client-side code is insecure and exposes them to anyone visiting the site.
// This should be moved to a secure backend environment for a production application.
const API_KEY = "AIzaSyDJsRleaLsWSGMxVe__8n-_JPf0PSQJNGw";

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-pro" });