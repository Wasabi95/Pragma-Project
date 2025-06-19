//src/components/organisms/ModeratorControls.js
import React from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

function ModeratorControls({
  storyTitle,
  onTitleChange,
  storyDesc,
  onDescChange,
  onAddStory,
  onRevealVotes,
  onStartNewRound,
  canReveal,
}) {
  return (
    <div className="card mt-4">
      <div className="card-header">Moderator Controls</div>
      <div className="card-body">
        <FormField
          label="Story Title"
          id="storyTitle"
          value={storyTitle}
          onChange={onTitleChange}
          placeholder="Enter story title"
        />
        <FormField
          label="Story Description (optional)"
          id="storyDesc"
          type="textarea"
          value={storyDesc}
          onChange={onDescChange}
          placeholder="Enter description"
        />
        <Button onClick={onAddStory} className="btn-secondary w-100 mb-2">Add & Start Story</Button>
        <Button onClick={onRevealVotes} disabled={!canReveal} className="btn-success w-100 mb-2">Reveal Votes</Button>
        <Button onClick={onStartNewRound} className="btn-warning w-100">Start New Round</Button>
      </div>
    </div>
  );
}

export default ModeratorControls;