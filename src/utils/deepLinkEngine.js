/**
 * Deep Link Engine v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps platforms to Android package IDs and builds Smart Checkout URLs.
 *
 * Supports:
 *  - Android intent:// URIs (opens native app if installed, falls back to web)
 *  - Smart URL construction: Checkout > Cart > Product > Search (best available)
 *  - Platform capability detection (what level of navigation is supported)
 */

// ─── Android Package IDs ─────────────────────────────────────────────────────
const PLATFORM_SCHEMES = {
  'amazon':    { package: 'in.amazon.mShop.android.shopping',  capability: 'product' },
  'flipkart':  { package: 'com.flipkart.android',              capability: 'product' },
  'myntra':    { package: 'com.myntra.android',                capability: 'product' },
  'ajio':      { package: 'com.ril.ajio',                      capability: 'product' },
  'meesho':    { package: 'com.meesho.supply',                 capability: 'product' },
  'snapdeal':  { package: 'com.snapdeal.main',                 capability: 'search'  },
  'jiomart':   { package: 'com.jiomart',                       capability: 'search'  },
  'croma':     { package: 'com.Croma.CromaApp',                capability: 'search'  },
  'samsung':   { package: 'com.samsung.android.samsungpay',    capability: 'search'  },
  'reliance':  { package: 'com.ril.mydigitalstore',            capability: 'search'  },
  'cashify':   { package: 'com.cashify.app',                   capability: 'search'  },
  'olx':       { package: 'com.olx.olx',                      capability: 'search'  },
  'zomato':    { package: 'com.application.zomato',            capability: 'product' },
  'swiggy':    { package: 'in.swiggy.android',                 capability: 'product' },
  'uber':      { package: 'com.ubercab',                       capability: 'search'  },
  'ola':       { package: 'com.olacabs.customer',              capability: 'search'  },
  'practo':    { package: 'com.practo.fabric',                 capability: 'search'  },
  'eatsure':   { package: 'com.eatsure.fooddelivery',          capability: 'search'  },
  '1mg':       { package: 'com.aranoah.healthkart.plus',       capability: 'product' },
  'pharmeasy': { package: 'com.phonegap.rxpal',                capability: 'search'  },
  'apollo':    { package: 'com.apollo.patientapp',             capability: 'search'  },
};

// ─── URL Templates per Platform ──────────────────────────────────────────────
// Levels: 'checkout' > 'cart' > 'product' > 'search'
const PLATFORM_URL_TEMPLATES = {
  amazon: {
    search:  (q) => `https://www.amazon.in/s?k=${q}`,
    product: (url) => url,
  },
  flipkart: {
    search:  (q) => `https://www.flipkart.com/search?q=${q}`,
    product: (url) => url,
  },
  myntra: {
    search:  (q) => `https://www.myntra.com/${q}`,
    product: (url) => url,
  },
  ajio: {
    search:  (q) => `https://www.ajio.com/search/?text=${q}`,
    product: (url) => url,
  },
  croma: {
    search:  (q) => `https://www.croma.com/search/?q=${q}`,
    product: (url) => url,
  },
  reliance: {
    search:  (q) => `https://www.reliancedigital.in/search?q=${q}:relevance`,
    product: (url) => url,
  },
  samsung: {
    search:  (q) => `https://www.samsung.com/in/search/?searchvalue=${q}`,
    product: (url) => url,
  },
  cashify: {
    search:  (q) => `https://www.cashify.in/buy-refurbished-mobile-phones/search?q=${q}`,
    product: (url) => url,
  },
  olx: {
    search:  (q) => `https://www.olx.in/items/q-${q}`,
    product: (url) => url,
  },
  meesho: {
    search:  (q) => `https://www.meesho.com/search?q=${q}`,
    product: (url) => url,
  },
  snapdeal: {
    search:  (q) => `https://www.snapdeal.com/search?keyword=${q}`,
    product: (url) => url,
  },
  jiomart: {
    search:  (q) => `https://www.jiomart.com/search/${q}`,
    product: (url) => url,
  },
  zomato: {
    search:  (q) => `https://www.zomato.com/search?q=${q}`,
    product: (url) => url,
  },
  swiggy: {
    search:  (q) => `https://www.swiggy.com/search?query=${q}`,
    product: (url) => url,
  },
};

// ─── Normalizer ───────────────────────────────────────────────────────────────
export const normalizePlatformName = (provider) => {
  if (!provider) return '';
  const p = provider.toLowerCase();
  if (p.includes('amazon'))         return 'amazon';
  if (p.includes('flipkart'))       return 'flipkart';
  if (p.includes('myntra'))         return 'myntra';
  if (p.includes('ajio'))           return 'ajio';
  if (p.includes('croma'))          return 'croma';
  if (p.includes('reliance'))       return 'reliance';
  if (p.includes('samsung'))        return 'samsung';
  if (p.includes('cashify'))        return 'cashify';
  if (p.includes('olx'))            return 'olx';
  if (p.includes('meesho'))         return 'meesho';
  if (p.includes('snapdeal'))       return 'snapdeal';
  if (p.includes('jiomart'))        return 'jiomart';
  if (p.includes('zomato'))         return 'zomato';
  if (p.includes('swiggy'))         return 'swiggy';
  if (p.includes('uber'))           return 'uber';
  if (p.includes('ola'))            return 'ola';
  if (p.includes('practo'))         return 'practo';
  if (p.includes('eatsure'))        return 'eatsure';
  if (p.includes('1mg'))            return '1mg';
  if (p.includes('pharmeasy'))      return 'pharmeasy';
  if (p.includes('apollo'))         return 'apollo';
  return '';
};

/**
 * Detects what level of navigation is supported for a platform.
 * @returns {Object} { supportsApp, capability }
 */
export const detectPlatformCapability = (providerName) => {
  const key = normalizePlatformName(providerName);
  const platform = PLATFORM_SCHEMES[key];
  return {
    supportsApp: !!platform,
    capability: platform?.capability || 'search',
  };
};

/**
 * Builds the smartest possible web URL for a platform + product combination.
 * If a real product URL exists, use it. Otherwise build a search URL.
 *
 * @param {String} providerName - e.g. 'Amazon', 'Flipkart'
 * @param {String} productTitle - Product title for search fallback
 * @param {String} productUrl   - Existing product URL (may be '#' or null)
 * @returns {String} Best available HTTPS URL
 */
export const buildSmartCheckoutUrl = (providerName, productTitle, productUrl) => {
  const key = normalizePlatformName(providerName);
  const templates = PLATFORM_URL_TEMPLATES[key];
  const q = encodeURIComponent(productTitle || providerName);

  // If we have a real product URL (not '#' or empty), use it directly
  if (productUrl && productUrl !== '#' && productUrl.startsWith('http')) {
    return productUrl;
  }

  // Build a search URL using platform templates
  if (templates?.search) {
    return templates.search(q);
  }

  // Generic fallback: search on the platform domain
  const domain = key || 'google';
  return `https://www.${domain}.com/search?q=${q}`;
};

/**
 * Builds an Android intent:// URI.
 * If the user has the native app installed, Android opens it directly.
 * If not, Android falls back to the web URL in the browser.
 *
 * @param {String} providerName - e.g. 'Amazon', 'Zomato'
 * @param {String} webUrl       - The HTTPS web URL to wrap
 * @returns {String} intent:// URI or original webUrl if platform not mapped
 */
export const buildDeepLink = (providerName, webUrl) => {
  if (!webUrl) return '';

  const key = normalizePlatformName(providerName);
  const platform = PLATFORM_SCHEMES[key];

  if (!platform) {
    return webUrl;
  }

  // Strip protocol for intent path
  const path = webUrl.replace(/^https?:\/\//, '');
  const fallback = encodeURIComponent(webUrl);
  return `intent://${path}#Intent;scheme=https;package=${platform.package};S.browser_fallback_url=${fallback};end`;
};
