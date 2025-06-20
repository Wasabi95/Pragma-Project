// //src/components/molecules/ParticipantListItem.js
import React from 'react';
import Badge from '../atoms/Badge';

function ParticipantListItem({ participant, votesRevealed }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>
        {participant.name}
        {participant.isModerator && ' 👑'}
        {/* --- NEW: Add an icon for spectators --- */}
        {participant.role === 'SPECTATOR' && ' 👁️'}
        {participant.hasVoted && !votesRevealed && ' ✅'}
      </span>
      {votesRevealed && <Badge type="success">{participant.vote}</Badge>}
    </li>
  );
}

export default ParticipantListItem;