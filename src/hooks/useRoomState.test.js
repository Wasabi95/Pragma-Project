//src/hooks/useRoomState.test.js

import { renderHook, act } from '@testing-library/react';
import { useRoomState } from './useRoomState'; // The hook we are testing

// --- 1. Mocking localStorage ---
// We create a mock object that mimics the localStorage API.
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

// Before each test, we tell Jest to use our mock for localStorage.
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

// After each test, we clear the mock store to ensure tests are isolated.
afterEach(() => {
  localStorageMock.clear();
});


// --- 2. The Test Suite ---
describe('useRoomState hook', () => {
  const ROOM_ID = 'test-room-123';
  const initialState = { roomName: 'Test Room', participants: {} };

  // --- Test Case 1: Initial State ---
  it('should return null if localStorage is empty', () => {
    // Arrange: localStorage is empty (handled by beforeEach).
    // Act: Render the hook.
    const { result } = renderHook(() => useRoomState(ROOM_ID));

    // Assert: The initial state should be null.
    expect(result.current[0]).toBeNull();
  });

  it('should initialize state from localStorage if a value exists', () => {
    // Arrange: Put a value into our mock localStorage.
    localStorageMock.setItem(ROOM_ID, JSON.stringify(initialState));

    // Act: Render the hook.
    const { result } = renderHook(() => useRoomState(ROOM_ID));

    // Assert: The state should be the object we stored.
    expect(result.current[0]).toEqual(initialState);
  });

  // --- Test Case 2: Updating State ---
  it('should update the state and localStorage when the update function is called', () => {
    // Arrange: Render the hook.
    const { result } = renderHook(() => useRoomState(ROOM_ID));
    const newState = { roomName: 'Updated Name', participants: { 'user1': {} } };

    // Act: We call the update function returned by the hook.
    // `act` tells React Testing Library to handle the state update and re-render.
    act(() => {
      const updateState = result.current[1];
      updateState(newState);
    });

    // Assert 1: The hook's returned state should be the new state.
    expect(result.current[0]).toEqual(newState);
    
    // Assert 2: The mock localStorage should contain the new state.
    expect(JSON.parse(localStorageMock.getItem(ROOM_ID))).toEqual(newState);
  });

  // --- Test Case 3: Syncing from External Storage Event ---
  it('should update the state when a "storage" event is fired for the same roomId', () => {
    // Arrange: Render the hook with its initial state.
    const { result } = renderHook(() => useRoomState(ROOM_ID));
    const externalState = { roomName: 'Changed By Another Tab', participants: {} };
    
    // Act: We simulate a storage event from another tab.
    act(() => {
        // First, the other tab updates localStorage.
        localStorageMock.setItem(ROOM_ID, JSON.stringify(externalState));
        // Then, the browser dispatches the 'storage' event. We create a mock event.
        const storageEvent = new StorageEvent('storage', {
            key: ROOM_ID,
            newValue: JSON.stringify(externalState),
        });
        window.dispatchEvent(storageEvent);
    });

    // Assert: The hook's state should now match the state from the event.
    expect(result.current[0]).toEqual(externalState);
  });

  it('should NOT update the state when a "storage" event is fired for a different roomId', () => {
    // Arrange: Render the hook and get its initial state.
    localStorageMock.setItem(ROOM_ID, JSON.stringify(initialState));
    const { result } = renderHook(() => useRoomState(ROOM_ID));
    const externalState = { roomName: 'Should Not Be Seen', participants: {} };

    // Act: Simulate an event for a DIFFERENT room.
    act(() => {
        const storageEvent = new StorageEvent('storage', {
            key: 'some-other-room-id', // The key is different
            newValue: JSON.stringify(externalState),
        });
        window.dispatchEvent(storageEvent);
    });
    
    // Assert: The hook's state should NOT have changed.
    expect(result.current[0]).toEqual(initialState);
  });
});