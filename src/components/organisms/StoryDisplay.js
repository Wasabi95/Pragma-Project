//src/components/organisms/StoryDisplay.js
import React from 'react';

function StoryDisplay({ story }) {
  return (
    <div className="card">
      <div className="card-header">Active Story</div>
      <div className="card-body" style={{ minHeight: '150px' }}>
        {story ? (
          <>
            <h4 className="card-title">{story.title}</h4>
            <p className="card-text">{story.description}</p>
          </>
        ) : (
          <p className="text-muted">Moderator will add a story to begin voting.</p>
        )}
      </div>
    </div>
  );
}

export default StoryDisplay;