const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SRC_DIR = path.join(__dirname, '../src/components');
const PAGES_DIR = path.join(__dirname, '../src/pages');
const EN_JSON_PATH = path.join(__dirname, '../src/i18n/locales/en.json');

// Helper to generate a short key
const generateKey = (text) => {
    let key = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (key.length > 20) {
        key = key.substring(0, 20);
    }
    const hash = crypto.createHash('md5').update(text).digest('hex').substring(0, 4);
    return `auto_${key}_${hash}`;
};

const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));
let newKeysAdded = 0;

function processFile(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Check if useTranslation is imported
    const hasImport = content.includes('useTranslation');
    const hasHook = content.includes('useTranslation()');
    
    let modified = false;

    // We will do some safe regex replacements for JSX text nodes and placeholders
    // Pattern 1: >Text< (excluding curly braces, script tags, etc.)
    const textNodeRegex = />([A-Z][A-Za-z0-9\s&!?'.,-]{2,50})</g;
    
    content = content.replace(textNodeRegex, (match, p1) => {
        // Exclude some common non-translatable or code-like strings
        if (p1.includes('{') || p1.includes('}') || p1.includes('=>') || p1.trim() === '') return match;
        
        const key = generateKey(p1.trim());
        if (!enJson[key]) {
            enJson[key] = p1.trim();
            newKeysAdded++;
        }
        modified = true;
        return `>{t('${key}', '${p1.trim()}')}<`;
    });

    // Pattern 2: placeholder="Text"
    const placeholderRegex = /placeholder="([^"{]+)"/g;
    content = content.replace(placeholderRegex, (match, p1) => {
        if (p1.includes('{') || p1.includes('}')) return match;
        const key = generateKey(p1.trim());
        if (!enJson[key]) {
            enJson[key] = p1.trim();
            newKeysAdded++;
        }
        modified = true;
        return `placeholder={t('${key}', '${p1.trim()}')}`;
    });
    
    if (modified) {
        if (!hasImport) {
            content = "import { useTranslation } from 'react-i18next';\n" + content;
        }
        if (!hasHook) {
            // Very naive hook injection: find the first component definition
            const compRegex = /const\s+[A-Z][a-zA-Z0-9]*\s*=\s*\([^)]*\)\s*=>\s*{/;
            content = content.replace(compRegex, (match) => {
                return match + "\n  const { t } = useTranslation();";
            });
        }
        
        // Save file
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

console.log("Starting localization script...");
walkDir(SRC_DIR);
walkDir(PAGES_DIR);

fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJson, null, 2), 'utf-8');
console.log(`Done! Added ${newKeysAdded} new keys to en.json.`);
