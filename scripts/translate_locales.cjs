const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const EN_JSON_PATH = path.join(LOCALES_DIR, 'en.json');

const enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));
const enKeys = Object.keys(enData);

// All 22 supported languages in the app (excluding 'en')
const targetLangs = [
  'hi', 'ml', 'te', 'bn', 'ta', 'mr', 'gu', 'kn', 'or', 'pa', 
  'as', 'ur', 'sa', 'ks', 'ne', 'sd', 'mai', 'sat', 'doi', 'bho', 'kok', 'mni'
];

async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(item => item[0]).join('');
  } catch (e) {
    console.error(`Failed to translate "${text}" to ${targetLang}:`, e.message);
    return text; // fallback to English
  }
}

// Translate in batches to avoid rate limits
async function processLang(lang) {
  const langPath = path.join(LOCALES_DIR, `${lang}.json`);
  let langData = {};
  if (fs.existsSync(langPath)) {
    langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
  }

  const missingKeys = enKeys.filter(key => !langData[key]);
  if (missingKeys.length === 0) {
    console.log(`[${lang}] All keys up to date.`);
    return;
  }

  console.log(`[${lang}] Translating ${missingKeys.length} new keys...`);
  
  for (let i = 0; i < missingKeys.length; i++) {
    const key = missingKeys[i];
    const text = enData[key];
    const translated = await translateText(text, lang);
    langData[key] = translated;
    
    // Add small delay to avoid rate limiting
    if (i % 10 === 0) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf-8');
  console.log(`[${lang}] Finished translating.`);
}

async function main() {
  for (const lang of targetLangs) {
    await processLang(lang);
  }
  console.log("All translations complete!");
}

main();
