/**
 * Analytics Tracking Service
 * Logs analytics events. In production, this would connect to Mixpanel, Google Analytics, Firebase, etc.
 */

const getDeviceInfo = () => {
  return {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language
  };
};

export const trackEvent = (eventName, eventData = {}) => {
  const payload = {
    event: eventName,
    data: eventData,
    context: getDeviceInfo()
  };

  // Mock analytics dispatch
  console.log(`[ANALYTICS] ${eventName}`, payload);
  
  // You could store this in localStorage or IndexedDB for offline syncing later
  try {
    const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
    queue.push(payload);
    // Keep queue manageable
    if (queue.length > 50) queue.shift();
    localStorage.setItem('analytics_queue', JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to queue analytics', e);
  }
};
