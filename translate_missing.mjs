import fs from 'fs';
import path from 'path';

const localesDir = './src/i18n/locales';

// Mapping from our codes to Google Translate codes
// If a language is not well supported, we just use 'en' as fallback to prevent crash
const googleCodes = {
  'as': 'as',
  'bn': 'bn',
  'brx': 'hi', // fallback to hindi for bodo
  'doi': 'doi',
  'gu': 'gu',
  'hi': 'hi',
  'kn': 'kn',
  'ks': 'hi', // fallback to hindi for kashmiri
  'kok': 'gom',
  'mai': 'mai',
  'ml': 'ml',
  'mni': 'mni-Mtei',
  'mr': 'mr',
  'ne': 'ne',
  'or': 'or',
  'pa': 'pa',
  'sa': 'sa',
  'sat': 'hi', // fallback for santali
  'sd': 'sd',
  'ta': 'ta',
  'te': 'te',
  'ur': 'ur'
};

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) return text;
    const json = await response.json();
    return json[0].map(item => item[0]).join('');
  } catch (e) {
    console.error(`Error translating to ${targetLang}:`, e.message);
    return text;
  }
}

async function main() {
  const enPath = path.join(localesDir, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = Object.keys(enData);

  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json' && f !== 'hi.json');

  for (const file of files) {
    const langCode = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let modified = false;
    const targetLang = googleCodes[langCode] || langCode;

    console.log(`Processing ${langCode}...`);

    for (const key of enKeys) {
      if (!data[key]) {
        console.log(`Missing key '${key}' in ${langCode}`);
        const translation = await translateText(enData[key], targetLang);
        data[key] = translation;
        modified = true;
        // sleep a bit to avoid rate limiting
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Saved ${file}`);
    }
  }
  console.log("Done.");
}

main();
