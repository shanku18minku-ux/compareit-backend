/**
 * Deep Link Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates the full Smart Checkout flow:
 *   1. Build the smartest possible URL for a given platform + product
 *   2. Wrap it in an Android intent:// URI where applicable
 *   3. Return a rich redirect payload for the redirect modal
 *   4. Log analytics events for tracking
 *
 * This is the single source of truth for ALL platform redirect logic.
 * All components should call this service instead of building URLs themselves.
 */

import {
  buildSmartCheckoutUrl,
  buildDeepLink,
  detectPlatformCapability,
  normalizePlatformName,
} from '../utils/deepLinkEngine';
import { trackEvent } from './analyticsService';

// ─── Capability Labels ────────────────────────────────────────────────────────
const CAPABILITY_LABELS = {
  checkout: '🛒 Direct Checkout',
  cart:     '🛒 Direct Cart',
  product:  '📦 Product Page',
  search:   '🔍 Search Page',
};

/**
 * Builds a fully enriched redirect payload for GlobalAffiliateRedirectModal.
 *
 * @param {String} platformName  - e.g. 'Amazon', 'Flipkart'
 * @param {Object} productData   - The active product object
 *   @param {String} productData.title   - Product title
 *   @param {String} productData.url     - Direct product URL (may be '#')
 *   @param {Number} productData.price   - Platform price
 * @returns {{ providerName, targetUrl, intentUrl, capability, capabilityLabel }}
 */
export const buildRedirectPayload = (platformName, productData = {}) => {
  const { title = '', url = '#', price = 0 } = productData;

  // 1. Build the best web URL available
  const smartWebUrl = buildSmartCheckoutUrl(platformName, title, url);

  // 2. Wrap in intent:// URI for native app opening (Android)
  const intentUrl = buildDeepLink(platformName, smartWebUrl);

  // 3. Detect what level of navigation this platform supports
  const { supportsApp, capability } = detectPlatformCapability(platformName);

  // 4. Build the payload
  const payload = {
    providerName:     platformName,
    targetUrl:        smartWebUrl,          // Final web URL (used as fallback)
    intentUrl:        intentUrl,            // Android intent:// URI (used first)
    capability:       capability,           // 'checkout' | 'cart' | 'product' | 'search'
    capabilityLabel:  CAPABILITY_LABELS[capability] || '🔗 Opening Platform',
    supportsApp:      supportsApp,
    productTitle:     title,
    productPrice:     price,
  };

  // 5. Log analytics
  logDeepLinkAttempt(payload);

  return payload;
};

/**
 * Convenience wrapper: builds a redirect payload from a full platform object
 * (as it appears in product.platforms[]).
 *
 * @param {Object} platform  - { name, price, url, deliveryDays, inStock, ... }
 * @param {Object} product   - Full product object for title context
 */
export const buildRedirectPayloadFromPlatform = (platform, product = {}) => {
  return buildRedirectPayload(platform.name, {
    title: product.title || '',
    url:   platform.url || '#',
    price: platform.price || 0,
  });
};

/**
 * Logs a deep link navigation attempt to analytics.
 * @param {Object} payload - The redirect payload
 */
export const logDeepLinkAttempt = (payload) => {
  trackEvent('deep_link_attempt', {
    platform:        normalizePlatformName(payload.providerName),
    providerName:    payload.providerName,
    capability:      payload.capability,
    supportsApp:     payload.supportsApp,
    url:             payload.targetUrl,
    productTitle:    payload.productTitle,
    timestamp:       new Date().toISOString(),
  });
};

/**
 * Logs the outcome of a deep link navigation.
 * Called from GlobalAffiliateRedirectModal after redirect attempt.
 *
 * @param {Object}  payload  - The redirect payload
 * @param {String}  method   - 'intent_uri' | 'capacitor_openurl' | 'browser' | 'window_href'
 * @param {Boolean} success  - Whether navigation succeeded
 * @param {String}  [error]  - Optional error message
 */
export const logDeepLinkOutcome = (payload, method, success, error = null) => {
  trackEvent('deep_link_outcome', {
    platform:     normalizePlatformName(payload?.providerName || ''),
    providerName: payload?.providerName,
    capability:   payload?.capability,
    method,
    success,
    error:        error ? String(error) : null,
    timestamp:    new Date().toISOString(),
  });
};

/**
 * Returns a human-readable label for the current platform's navigation level.
 * Used in UI badges.
 */
export const getCapabilityLabel = (platformName) => {
  const { capability } = detectPlatformCapability(platformName);
  return CAPABILITY_LABELS[capability] || '🔗 Opening Platform';
};
