//src/components/organisms/VotingPanel.js
import React from 'react';
import Button from '../atoms/Button';

const VOTING_OPTIONS = [1, 2, 3, 5, 8, 13, '☕', '?'];

function VotingPanel({ onVote, hasVoted }) {
  return (
    <div className="card mt-4">
      <div className="card-header">Cast Your Vote</div>
      <div className="card-body d-flex flex-wrap justify-content-center gap-2">
        {VOTING_OPTIONS.map(vote => (
          <Button
            key={vote}
            className="btn-lg btn-outline-primary"
            onClick={() => onVote(vote)}
            disabled={hasVoted}
          >
            {vote}
          </Button>
        ))}
      </div>
      {hasVoted && (
        <div className="card-footer text-center text-success">
          Your vote is in! Waiting for others.
        </div>
      )}
    </div>
  );
}

export default VotingPanel;