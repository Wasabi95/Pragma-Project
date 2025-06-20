//src/store/store.js
// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';

// Export the middleware so we can test it in isolation
export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const roomState = store.getState().room;
  if (roomState.roomId) {
    try {
      localStorage.setItem(roomState.roomId, JSON.stringify(roomState));
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  }
  return result;
};

// Export the reducer map so we can reuse it
export const rootReducer = {
  room: roomReducer,
};

// The main function to create a store. It can be pre-filled with state for testing.
export const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
    preloadedState,
  });
};

// Create the default store for the application to use
export const store = setupStore({});