//components/layout/MainLayout.js
import React from 'react';

// This component is only responsible for the persistent visual shell of the app.
function MainLayout({ children }) {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🧠 Planning Poker</h1>
      <main>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;