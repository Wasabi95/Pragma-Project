//src/components/pages/RoomPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRoomState, addStory, castVote, revealVotes, startNewRound, addParticipant } from '../../store/roomSlice';

// Organisms & Template
import ParticipantList from '../organisms/ParticipantList';
import ModeratorControls from '../organisms/ModeratorControls';
import StoryDisplay from '../organisms/StoryDisplay';
import VotingPanel from '../organisms/VotingPanel';
import JoinRoomForm from '../organisms/JoinRoomForm';
import RoomTemplate from '../templates/RoomTemplate';

function RoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const roomState = useSelector(state => state.room);
  const [currentUser, setCurrentUser] = useState(location.state?.currentUser);
  
  // Local state for controlled form inputs
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDesc, setNewStoryDesc] = useState('');
  const [joinName, setJoinName] = useState('MARIA');
  const [joinRole, setJoinRole] = useState(null);
  const [joinRoleError, setJoinRoleError] = useState('');

  // --- Effects for initialization and joining ---
  useEffect(() => {
    // On first load, if Redux state is empty, try to load from localStorage
    if (!roomState.roomId) {
      const storedState = localStorage.getItem(roomId);
      if (storedState) {
        dispatch(setRoomState({ roomId, ...JSON.parse(storedState) }));
      }
    }
  }, [roomState.roomId, roomId, dispatch]);

  useEffect(() => {
    // When currentUser is set, add them to the participants list in Redux
    if (currentUser && roomState.roomId && !roomState.participants[currentUser.name]) {
      dispatch(addParticipant(currentUser));
    }
  }, [currentUser, roomState.roomId, roomState.participants, dispatch]);

  // --- Event Handlers ---
  const handleJoinRoom = (e) => {
    e.preventDefault();
    setJoinRoleError('');

    // FIX: Add the alert for the joiner
    if (!joinRole) {
      const message = 'Por favor, seleccione un modo de visualización.';
      setJoinRoleError(message);
      alert(message);
      return; // Stop the function
    }

    if (!joinName.trim() || (roomState.participants && roomState.participants[joinName])) {
      alert('Name is invalid or already taken.');
      return;
    }

    const newUser = { 
      name: joinName, 
      isModerator: false, 
      vote: null, 
      hasVoted: false, 
      role: joinRole 
    };
    setCurrentUser(newUser);
  };
  
  const handleAddStory = () => {
    if (!newStoryTitle.trim()) return;
    dispatch(addStory({ id: `story-${Date.now()}`, title: newStoryTitle, description: newStoryDesc }));
    setNewStoryTitle(''); setNewStoryDesc('');
  };

  const handleCastVote = (vote) => dispatch(castVote({ userName: currentUser.name, vote }));

  // --- Render Logic ---
  if (!roomState.roomId) {
    return <div className="text-center"><h2>Room not found or is loading...</h2></div>;
  }
  
  // If we don't know who the current user is yet, show the join screen.
  if (!currentUser) {
    return (
      <JoinRoomForm
        roomName={roomState.roomName}
        userName={joinName}
        onUserNameChange={(e) => setJoinName(e.target.value)}
        onSubmit={handleJoinRoom}
        userRole={joinRole}
        onUserRoleChange={(e) => setJoinRole(e.target.value)}
        roleError={joinRoleError}
      />
    );
  }

  // --- Derived State for Rendering ---
  const participants = Object.values(roomState.participants);
  const activeStory = roomState.stories.find(s => s.id === roomState.activeStoryId);
  // IMPROVEMENT: Only count players for revealing votes, not spectators.
  const allPlayersVoted = participants.filter(p => p.role === 'PLAYER').every(p => p.hasVoted);
  
  return (
    <RoomTemplate
      roomHeaderInfo={{
        roomName: roomState.roomName,
        userName: currentUser.name,
        isModerator: currentUser.isModerator,
        userRole: currentUser.role, // This correctly passes the role for the badge
        onCopyLink: () => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!')),
      }}
      participantsPanel={
        <ParticipantList participants={participants} votesRevealed={roomState.votesRevealed} />
      }
      moderatorControls={
        currentUser.isModerator && (
            <ModeratorControls
            storyTitle={newStoryTitle}
            onTitleChange={(e) => setNewStoryTitle(e.target.value)}
            storyDesc={newStoryDesc}
            onDescChange={(e) => setNewStoryDesc(e.target.value)}
            onAddStory={handleAddStory}
            onRevealVotes={() => dispatch(revealVotes())}
            onStartNewRound={() => dispatch(startNewRound())}
            canReveal={allPlayersVoted && !roomState.votesRevealed}
            />
        )
      }
      storyPanel={<StoryDisplay story={activeStory} />}
      votingPanel={
        activeStory && !roomState.votesRevealed && currentUser.role === 'PLAYER' ? (
          <VotingPanel
            onVote={handleCastVote}
            hasVoted={roomState.participants[currentUser.name]?.hasVoted}
          />
        ) : null
      }
    />
  );
}

export default RoomPage;




