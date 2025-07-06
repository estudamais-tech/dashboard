import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '@/App';
import LuizaPage from '@/pages/LuizaPage';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/luiza" element={<LuizaPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
