import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';
import './index.css';
import { LanguageProvider } from './src/lib/LanguageContext';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </React.StrictMode>
  );
}
