import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Keep the first paint styled while the React bundle and its CSS are loading.
requestAnimationFrame(() => {
  document.getElementById('initial-loader')?.remove();
});
