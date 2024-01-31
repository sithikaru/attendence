import React from 'react';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Import createRoot from "react-dom/client"
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

// Use createRoot to render your app
const rootInstance = createRoot(root);
rootInstance.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
