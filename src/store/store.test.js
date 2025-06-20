// src/store/store.test.js
// src/store/store.test.js

// Import the setup function and the initial state, NOT the global store instance
import { setupStore } from './store';
import { setRoomState, initialState as roomInitialState } from './roomSlice';

// --- Mocking localStorage (this part is correct and stays the same) ---
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
      localStorageMock.setItem.mockClear();
      localStorageMock.getItem.mockClear();
    },
  };
})();

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
});

afterEach(() => {
  localStorageMock.clear();
});


// --- The Test Suite ---
describe('Redux Store and Middleware', () => {

  // Test Case 1: Verifying the store's basic configuration
  it('should configure the store with the room reducer', () => {
    // Act: Create a fresh store for this specific test.
    const store = setupStore({}); 
    const state = store.getState();

    // Assert: Check that the 'room' slice exists and has its correct initial state.
    // This now works because the store is pristine.
    expect(state.room).toBeDefined();
    expect(state.room).toEqual(roomInitialState);
  });

  // Test Case 2: Verifying the middleware's primary success path
  it('should save state to localStorage via middleware when roomId is present', () => {
    // Arrange
    const store = setupStore({}); // Fresh store
    const roomData = {
      roomId: 'room-abc',
      roomName: 'Middleware Test Room',
      participants: {},
      stories: [],
      activeStoryId: null,
      votesRevealed: false,
    };
    
    // Act
    store.dispatch(setRoomState(roomData));

    // Assert
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'room-abc',
      JSON.stringify({ ...roomData }) // The state now includes this data
    );
  });

  // Test Case 3: Verifying the middleware's conditional logic
  it('should NOT save state to localStorage if roomId is null or missing', () => {
    // Arrange
    const store = setupStore({}); // Fresh store
    const roomData = {
      roomId: null,
      roomName: 'No ID Room',
    };
    
    // Act
    store.dispatch(setRoomState(roomData));

    // Assert
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  // Test Case 4: Verifying the middleware's error handling
  it('should catch and log an error if localStorage.setItem fails', () => {
    // Arrange
    const store = setupStore({}); // Fresh store
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorMessage = 'LocalStorage quota exceeded';
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const roomData = { roomId: 'room-with-error', roomName: 'Error Room' };
    
    // Act
    store.dispatch(setRoomState(roomData));
    
    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Could not save state to localStorage", 
        expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });
});