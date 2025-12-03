const { GoogleGenerativeAI } = require("@google/generative-ai");

// Prefer Application Default Credentials (service account via GOOGLE_APPLICATION_CREDENTIALS)
// Fallback to GEMINI_API_KEY if ADC is not configured. Model can be overridden via GEMINI_MODEL.
const useADC = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-pro";

let genAI = null;
try {
  if (useADC) {
    genAI = new GoogleGenerativeAI(); // will use ADC
  } else if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  } else {
    console.warn(
      "No Google credentials found. Set GOOGLE_APPLICATION_CREDENTIALS (preferred) or GEMINI_API_KEY in .env"
    );
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenerativeAI client:", e.message || e);
}

let model = null;
if (genAI) {
  try {
    model = genAI.getGenerativeModel({ model: modelName });
  } catch (e) {
    console.error("Failed to get generative model (check GEMINI_MODEL):", e.message || e);
  }
}

module.exports = { genAI, model };
