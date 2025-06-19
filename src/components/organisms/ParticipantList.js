//src/components/organisms/ParticipantList.js
import React from 'react';
import ParticipantListItem from '../molecules/ParticipantListItem';

function ParticipantList({ participants, votesRevealed }) {
  return (
    <div className="card">
      <div className="card-header">Participants ({participants.length})</div>
      <ul className="list-group list-group-flush">
        {participants.map(p => (
          <ParticipantListItem key={p.name} participant={p} votesRevealed={votesRevealed} />
        ))}
      </ul>
    </div>
  );
}

export default ParticipantList;