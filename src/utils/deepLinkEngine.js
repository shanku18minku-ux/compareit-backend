/**
 * Deep Link Engine
 * Maps common platforms to their Android Deep Link Intent URIs.
 * If the user has the app installed, Android will open the specific item in the app.
 * If not, it falls back to the original browser URL.
 */

const PLATFORM_SCHEMES = {
  'amazon': {
    package: 'in.amazon.mShop.android.shopping'
  },
  'flipkart': {
    package: 'com.flipkart.android'
  },
  'zomato': {
    package: 'com.application.zomato'
  },
  'swiggy': {
    package: 'in.swiggy.android'
  },
  'uber': {
    package: 'com.ubercab'
  },
  'ola': {
    package: 'com.olacabs.customer'
  },
  'practo': {
    package: 'com.practo.fabric'
  },
  'myntra': {
    package: 'com.myntra.android'
  },
  'ajio': {
    package: 'com.ril.ajio'
  },
  'eatsure': {
    package: 'com.eatsure.fooddelivery'
  },
  '1mg': {
    package: 'com.aranoah.healthkart.plus'
  },
  'pharmeasy': {
    package: 'com.phonegap.rxpal'
  },
  'apollo': {
    package: 'com.apollo.patientapp'
  }
};

/**
 * Normalizes a provider name to standard keys.
 */
const normalizeProvider = (provider) => {
  if (!provider) return '';
  const p = provider.toLowerCase();
  if (p.includes('amazon')) return 'amazon';
  if (p.includes('flipkart')) return 'flipkart';
  if (p.includes('zomato')) return 'zomato';
  if (p.includes('swiggy')) return 'swiggy';
  if (p.includes('uber')) return 'uber';
  if (p.includes('ola')) return 'ola';
  if (p.includes('practo')) return 'practo';
  if (p.includes('myntra')) return 'myntra';
  if (p.includes('ajio')) return 'ajio';
  if (p.includes('eatsure')) return 'eatsure';
  if (p.includes('1mg')) return '1mg';
  if (p.includes('pharmeasy')) return 'pharmeasy';
  if (p.includes('apollo')) return 'apollo';
  return '';
};

/**
 * Builds an Android intent:// URI.
 * @param {String} providerName - E.g. 'Amazon', 'Zomato'
 * @param {String} webUrl - The original HTTPS web URL
 * @returns {String} - Intent URI or original URL if not mapped
 */
export const buildDeepLink = (providerName, webUrl) => {
  if (!webUrl) return '';
  
  const key = normalizeProvider(providerName);
  const platform = PLATFORM_SCHEMES[key];
  
  if (!platform) {
    // Return original web URL if we don't have a specific mapping
    return webUrl;
  }

  // Remove http:// or https:// from the url for intent schema conversion
  let path = webUrl.replace(/^https?:\/\//, '');

  // Build the Android intent URL
  // format: intent://path#Intent;scheme=https;package=com.my.app;S.browser_fallback_url=encodedUrl;end
  const fallback = encodeURIComponent(webUrl);
  return `intent://${path}#Intent;scheme=https;package=${platform.package};S.browser_fallback_url=${fallback};end`;
};
