import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Expose routes for external tooling
if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
  try {
    window.handleRoutes(['/']);
  } catch (_) {
    // no-op
  }
}

reportWebVitals();
