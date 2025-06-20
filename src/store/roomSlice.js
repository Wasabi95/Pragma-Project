//src/store/roomSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const initialState =  {
  roomId: null,
  roomName: null,
  participants: {},
  stories: [],
  activeStoryId: null,
  votesRevealed: false,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    // Action to set the entire state, used for initialization and syncing.
    setRoomState: (state, action) => {
      const { roomId, ...roomData } = action.payload;
      state.roomId = roomId; // Keep roomId separate
      Object.assign(state, roomData);
    },
    // Action to add a new story and reset votes
    addStory: (state, action) => {
      state.stories.push(action.payload);
      state.activeStoryId = action.payload.id;
      state.votesRevealed = false;
      // Reset votes for all participants
      Object.values(state.participants).forEach(p => {
        p.hasVoted = false;
        p.vote = null;
      });
    },
    // Action for a user to cast their vote
    castVote: (state, action) => {
      const { userName, vote } = action.payload;
      if (state.participants[userName]) {
        state.participants[userName].vote = vote;
        state.participants[userName].hasVoted = true;
      }
    },
    // Action to reveal all votes
    revealVotes: (state) => {
      state.votesRevealed = true;
    },
    // Action to start a new voting round
    startNewRound: (state) => {
      state.votesRevealed = false;
      state.activeStoryId = null;
      Object.values(state.participants).forEach(p => {
        p.hasVoted = false;
        p.vote = null;
      });
    },
    // Action to add a participant
    addParticipant: (state, action) => {
        const participant = action.payload;
        state.participants[participant.name] = participant;
    }
  },
});

// Export the action creators
export const { 
    setRoomState, 
    addStory, 
    castVote, 
    revealVotes, 
    startNewRound,
    addParticipant
} = roomSlice.actions;

// Export the reducer
export default roomSlice.reducer;