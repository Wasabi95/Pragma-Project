//index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Assuming you have this

// 1. Import Provider and the store
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap the App in the Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);