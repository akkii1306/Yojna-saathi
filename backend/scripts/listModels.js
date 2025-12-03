require('dotenv').config();
const fetch = globalThis.fetch || require('node-fetch');

async function listWithApiKey(key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const res = await fetch(url);
  const body = await res.text();
  try {
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  } catch (e) {
    console.error('Raw response:', body);
  }
}

(async () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('GEMINI_API_KEY not set in environment. Set GEMINI_API_KEY in backend/.env or use ADC (GOOGLE_APPLICATION_CREDENTIALS).');
    process.exit(1);
  }

  try {
    await listWithApiKey(key);
  } catch (err) {
    console.error('Failed to list models:', err);
    process.exit(1);
  }
})();
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY not set in environment. Add it to backend/.env');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (!json.models) {
        console.error('Unexpected response:', json);
        process.exit(1);
      }
      console.log('Available models:');
      json.models.forEach((m) => {
        console.log('- ', m.name, '|', (m.supportedMethods || []).join(',') );
      });
    } catch (e) {
      console.error('Failed to parse ListModels response:', e, data);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});
