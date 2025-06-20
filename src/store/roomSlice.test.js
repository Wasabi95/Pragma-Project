// src/store/roomSlice.test.js
// src/store/roomSlice.test.js
import roomReducer, {
  setRoomState, // Import the missing actions
  addStory,
  castVote,
  revealVotes,
  startNewRound,
  addParticipant,
} from './roomSlice';

// A clean initial state to use as a baseline in tests
const initialState = {
  roomId: null,
  roomName: null,
  participants: {},
  stories: [],
  activeStoryId: null,
  votesRevealed: false,
};

// All tests for the reducer are grouped in this describe block
describe('roomSlice reducer', () => {
  // Test 1: Does the reducer return the initial state correctly?
  it('should handle initial state', () => {
    expect(roomReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // Test 2: Does setRoomState correctly overwrite the state?
  // This covers the `setRoomState` reducer.
  it('should handle setRoomState', () => {
    const payload = {
      roomId: 'room-123',
      roomName: 'Test Room',
      participants: { 'Alice': { name: 'Alice', hasVoted: false, vote: null } },
      stories: [{ id: 's1', title: 'A story' }],
      activeStoryId: 's1',
      votesRevealed: false,
    };
    const state = roomReducer(initialState, setRoomState(payload));
    expect(state).toEqual(payload);
  });

  // Test 3: Does addParticipant work?
  // This covers the `addParticipant` reducer (line 44 in your original report).
  it('should handle addParticipant', () => {
    const participant = { name: 'Alice', hasVoted: false, vote: null };
    const state = roomReducer(initialState, addParticipant(participant));
    expect(state.participants['Alice']).toEqual(participant);
  });

  // Test 4: Does addStory reset votes for existing participants?
  // This covers the `forEach` loop (lines 19-21 in your original report).
  it('should handle addStory and reset votes for participants', () => {
    const previousState = {
      ...initialState,
      participants: {
        'Bob': { name: 'Bob', hasVoted: true, vote: 5 }
      },
      votesRevealed: true,
    };
    const newStory = { id: 'story-123', title: 'New Feature' };

    const state = roomReducer(previousState, addStory(newStory));

    // Assertions
    expect(state.stories).toHaveLength(1);
    expect(state.stories[0]).toEqual(newStory);
    expect(state.activeStoryId).toBe('story-123');
    expect(state.votesRevealed).toBe(false);
    expect(state.participants['Bob'].hasVoted).toBe(false); // This line is crucial
    expect(state.participants['Bob'].vote).toBeNull();      // This line is crucial
  });

  // Test 5: Does castVote work for a valid user?
  it('should handle castVote for an existing participant', () => {
    const previousState = {
      ...initialState,
      participants: {
        'Carol': { name: 'Carol', hasVoted: false, vote: null }
      }
    };
    const state = roomReducer(previousState, castVote({ userName: 'Carol', vote: 8 }));
    expect(state.participants['Carol'].hasVoted).toBe(true);
    expect(state.participants['Carol'].vote).toBe(8);
  });
  
  // Test 6: Does castVote correctly do nothing for a non-existent user?
  // This covers the `else` branch of the `if (state.participants[userName])` check.
  it('should not change state when casting vote for a non-existent participant', () => {
    const previousState = {
      ...initialState,
      participants: { 'Carol': { name: 'Carol', hasVoted: false, vote: null } }
    };
    const state = roomReducer(previousState, castVote({ userName: 'David', vote: 8 }));
    expect(state).toEqual(previousState);
  });

  // Test 7: Does revealVotes work?
  // This covers the `revealVotes` reducer.
  it('should handle revealVotes', () => {
      const state = roomReducer(initialState, revealVotes());
      expect(state.votesRevealed).toBe(true);
  });
  
  // Test 8: Does startNewRound correctly reset the state?
  it('should handle startNewRound', () => {
     const previousState = {
      ...initialState,
      participants: {
        'Alice': { name: 'Alice', hasVoted: true, vote: 3 },
        'Bob': { name: 'Bob', hasVoted: true, vote: 5 }
      },
      activeStoryId: 'story-123',
      votesRevealed: true,
    };
    
    const state = roomReducer(previousState, startNewRound());
    
    expect(state.votesRevealed).toBe(false);
    expect(state.activeStoryId).toBeNull();
    expect(state.participants['Alice'].hasVoted).toBe(false);
    expect(state.participants['Bob'].vote).toBeNull();
  });
});