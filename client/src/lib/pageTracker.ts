/**
 * Page tracking utilities for enhanced analytics
 */

// Keep track of when the user entered the page
let pageEnterTime = Date.now();
let isTracking = false;

/**
 * Initialize page tracking on the client side
 * This should be called as early as possible in the app
 */
export function initPageTracking() {
  if (isTracking) return; // Prevent multiple initializations
  
  // Set the page enter time
  pageEnterTime = Date.now();
  isTracking = true;
  
  // Add page title to the URL for better tracking
  // This is sent to the server via query parameters
  addPageTitleToUrl();
  
  // Track when the user leaves the page
  window.addEventListener('beforeunload', recordPageExit);
  
  // Track page visibility changes (tab switching)
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  console.log('Page tracking initialized');
}

/**
 * Add the current page title to the URL as a query parameter
 * This helps the server track page titles
 */
function addPageTitleToUrl() {
  try {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const title = document.title || 'Untitled Page';
      url.searchParams.set('title', title);
      
      // Use history.replaceState to update the URL without reloading
      window.history.replaceState({}, '', url.toString());
    }
  } catch (error) {
    console.error('Error adding page title to URL:', error);
  }
}

/**
 * Record the time spent on the page when the user leaves
 */
function recordPageExit() {
  if (!isTracking) return;
  
  const timeSpent = Math.floor((Date.now() - pageEnterTime) / 1000); // Convert to seconds
  
  // Send the data to the server
  // We use a synchronous request because beforeunload doesn't wait for async
  sendTimeSpentData(timeSpent);
}

/**
 * Handle visibility change events (tab switching)
 */
function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    // User switched away from the tab
    const timeSpent = Math.floor((Date.now() - pageEnterTime) / 1000);
    sendTimeSpentData(timeSpent);
  } else if (document.visibilityState === 'visible') {
    // User came back to the tab
    pageEnterTime = Date.now();
  }
}

/**
 * Send the time spent data to the server
 */
function sendTimeSpentData(timeSpent: number) {
  try {
    const visitorId = localStorage.getItem('visitorId');
    const path = window.location.pathname;
    
    // Use beacon API to send data even if the page is unloading
    if (navigator.sendBeacon) {
      const data = new FormData();
      data.append('timeSpent', timeSpent.toString());
      data.append('path', path);
      if (visitorId) data.append('visitorId', visitorId);
      
      navigator.sendBeacon('/api/pagevisits/update-time', data);
    } else {
      // Fallback to synchronous XHR
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/pagevisits/update-time', false); // false makes it synchronous
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        timeSpent,
        path,
        visitorId: visitorId || undefined
      }));
    }
  } catch (error) {
    console.error('Error sending page time data:', error);
  }
}

/**
 * Stop tracking the current page
 */
export function stopPageTracking() {
  if (!isTracking) return;
  
  // Record the current time spent before stopping
  recordPageExit();
  
  // Remove event listeners
  window.removeEventListener('beforeunload', recordPageExit);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  
  isTracking = false;
}