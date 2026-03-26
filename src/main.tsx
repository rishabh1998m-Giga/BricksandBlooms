import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import brandLogo from '../LOGO.png'

const existingIcon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
const favicon = existingIcon ?? document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = brandLogo;
if (!existingIcon) {
  document.head.appendChild(favicon);
}

let appleIcon = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
if (!appleIcon) {
  appleIcon = document.createElement('link');
  appleIcon.rel = 'apple-touch-icon';
  document.head.appendChild(appleIcon);
}
appleIcon.href = brandLogo;

document.title = 'Brick & Blooms';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
