import { useState, useEffect, useCallback } from 'react';

// This hook now acts as a real-time sync for a specific localStorage key.
export function useRoomState(roomId) {
  // 1. Get initial state directly from localStorage
  const getInitialState = () => {
    try {
      const storedState = localStorage.getItem(roomId);
      return storedState ? JSON.parse(storedState) : null;
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
      return null;
    }
  };

  const [roomState, setRoomState] = useState(getInitialState);

  // 2. A function to update both React state and localStorage
  const updateState = useCallback((newState) => {
    setRoomState(newState);
    try {
      localStorage.setItem(roomId, JSON.stringify(newState));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [roomId]);
  
  // 3. Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      // If the change happened on our key and was from another tab
      if (event.key === roomId) {
        setRoomState(getInitialState());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [roomId]);

  return [roomState, updateState];
}




// That useRoomState hook is the entire engine that allows for real-time 
// updates and communication between your browser tabs.
// It's a very clever and efficient way to achieve this "no-backend" 
// real-time effect by leveraging browser-native features. Let's break 
// down exactly how it works.
// The "Single Source of Truth": localStorage
// The core concept is that localStorage acts as a small, shared database 
// that is accessible by all of your application's tabs (as long as they 
// are on the same domain, e.g., http://localhost:3000).
// Your hook uses two distinct mechanisms to interact with this shared database.