//src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';

// This is our custom middleware
const localStorageMiddleware = store => next => action => {
  // Let the action pass through to the reducer first
  const result = next(action);

  // After the state has been updated, save it to localStorage
  const roomState = store.getState().room;
  if (roomState.roomId) {
    try {
      // We save the entire state object under the key of its ID
      localStorage.setItem(roomState.roomId, JSON.stringify(roomState));
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
  // Add our custom middleware to the chain
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});