//src/components/templates/RoomTemplate.js
import React from 'react';
import Button from '../atoms/Button';
// We don't need to import the Badge atom here as we are using the bootstrap class directly.

function RoomTemplate({ roomHeaderInfo, participantsPanel, moderatorControls, storyPanel, votingPanel }) {
  // 1. Destructure the new userRole prop
  const { roomName, userName, isModerator, userRole, onCopyLink } = roomHeaderInfo;
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Room: {roomName}</h2>
        <div>
          <span>Welcome, <strong>{userName}</strong></span>
          
          {/* 2. Add the rendering logic for the role badge */}
          {userRole && (
            <span className="badge bg-info text-dark ms-2">
              {userRole === 'PLAYER' ? 'Jugador' : 'Espectador'}
            </span>
          )}

          {/* The existing Moderator badge logic remains */}
          {isModerator && <span className="badge bg-primary ms-2">Moderator</span>}
        </div>
      </div>
      
      {/* ... (rest of the template remains the same) ... */}
      <Button onClick={onCopyLink} className="btn-outline-primary mb-4">
        📋 Copy Room Link
      </Button>

      <div className="row">
        <div className="col-md-4">
          {participantsPanel}
          {isModerator && moderatorControls}
        </div>
        <div className="col-md-8">
          {storyPanel}
          {votingPanel}
        </div>
      </div>
    </div>
  );
}

export default RoomTemplate;