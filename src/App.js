// //App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import RoomPage from './components/pages/RoomPage';
import MainLayout from './components/layout/MainLayout'; // <-- Import the layout

// Import Redux tools
import { useDispatch } from 'react-redux';
import { setRoomState } from './store/roomSlice';

function App() {
  const dispatch = useDispatch();

  // This global logic correctly remains here.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key && event.key.startsWith('room-') && event.newValue) {
        try {
          const roomData = JSON.parse(event.newValue);
          const fullState = { roomId: event.key, ...roomData };
          dispatch(setRoomState(fullState));
        } catch (e) {
          console.error("Failed to parse stored state on change", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return (
    <Router>
      {/* The MainLayout component now provides the visual container */}
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;