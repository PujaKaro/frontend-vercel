import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Cache busting mechanism with better UX
const APP_VERSION = __BUILD_TIME__ || new Date().toISOString();
const storedVersion = localStorage.getItem('app_version');

// Only reload if version actually changed and we haven't already reloaded
if (storedVersion && storedVersion !== APP_VERSION) {
  // Clear cache without reloading immediately
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  // Set a flag to prevent multiple reloads
  localStorage.setItem('reload_pending', 'true');
}

// Store current version
localStorage.setItem('app_version', APP_VERSION);

// Check for updates less frequently and more intelligently
const checkForUpdates = () => {
  const currentVersion = localStorage.getItem('app_version');
  const reloadPending = localStorage.getItem('reload_pending');
  
  // Only reload if version changed and we haven't already triggered a reload
  if (currentVersion !== APP_VERSION && !reloadPending) {
    localStorage.setItem('reload_pending', 'true');
    // Small delay to ensure smooth transition
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

// Check for updates every 15 minutes instead of 10
setInterval(checkForUpdates, 15 * 60 * 1000);

// Only check on page focus if we haven't already reloaded
window.addEventListener('focus', () => {
  const reloadPending = localStorage.getItem('reload_pending');
  if (!reloadPending) {
    checkForUpdates();
  }
});

// Clear reload flag when page loads
window.addEventListener('load', () => {
  localStorage.removeItem('reload_pending');
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
