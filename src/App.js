import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import RoomPage from './components/RoomPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <h1 className="text-center mb-4">🧠 Planning Poker</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;