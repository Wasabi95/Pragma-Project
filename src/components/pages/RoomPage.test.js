// src/components/pages/RoomPage.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ReactRouterDom from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import roomReducer, { initialState as roomInitialState } from '../../store/roomSlice';
import '@testing-library/jest-dom';

import RoomPage from './RoomPage';

// --- 1. MOCK ALL DEPENDENCIES ---

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep original components like MemoryRouter
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock browser APIs
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(navigator, 'clipboard', { value: { writeText: jest.fn().mockResolvedValue() }, configurable: true });
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// --- 2. SETUP HELPER FUNCTION ---
// This function simplifies rendering our component with all necessary providers
const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    routeParams = { roomId: 'test-room-123' },
    routeState = { currentUser: null }, // from location.state
    ...renderOptions
  } = {}
) => {
  // Set up mock implementations for the router hooks for this specific render
  ReactRouterDom.useParams.mockReturnValue(routeParams);
  ReactRouterDom.useLocation.mockReturnValue({ state: routeState });
  
  // Create a fresh store for each test
  const store = configureStore({
    reducer: { room: roomReducer },
    preloadedState,
  });

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ReactRouterDom.MemoryRouter>{children}</ReactRouterDom.MemoryRouter>
    </Provider>
  );

  // Return the store along with the render result so we can spy on dispatch
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};


// --- 3. THE TEST SUITE ---
describe('RoomPage Component', () => {
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  // Test Initial States
  it('should render "Room not found" if no state is available', () => {
    renderWithProviders(<RoomPage />, { preloadedState: { room: roomInitialState } });
    expect(screen.getByText(/room not found or is loading/i)).toBeInTheDocument();
  });

  it('should render JoinRoomForm if room state exists but currentUser does not', () => {
    const initialReduxState = { room: { ...roomInitialState, roomId: 'test-room-123', roomName: 'Test Room' } };
    renderWithProviders(<RoomPage />, { preloadedState: initialReduxState });
    expect(screen.getByRole('heading', { name: /join room: test room/i })).toBeInTheDocument();
  });

  // Test User Flows
  it('allows a new user to join the room', async () => {
    const roomState = { ...roomInitialState, roomId: 'test-room-123', roomName: 'Test Room Name', participants: {} };
    renderWithProviders(<RoomPage />, { preloadedState: { room: roomState } });

    // The join form should be visible
    const nameInput = screen.getByLabelText(/your name/i);
    const playerRadio = screen.getByLabelText(/jugador/i);
    const joinButton = screen.getByRole('button', { name: /join room/i });

    // Act: Fill out the form and click join
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'NewPlayer');
    await userEvent.click(playerRadio);
    await userEvent.click(joinButton);

    // Assert: The UI should update to the main room view
    // A good indicator is the participant list appearing.
    await waitFor(() => {
      expect(screen.getByText(/participants/i)).toBeInTheDocument();
      // And the new player's name should be visible
      expect(screen.getByText('NewPlayer')).toBeInTheDocument();
    });
  });

  it('allows a moderator to add a new story', async () => {
    const moderator = { name: 'Admin', isModerator: true, role: 'PLAYER' };
    const roomState = { 
      ...roomInitialState,
      roomId: 'test-room-123',
      participants: { [moderator.name]: moderator },
    };
    renderWithProviders(<RoomPage />, { preloadedState: { room: roomState }, routeState: { currentUser: moderator } });

    // Moderator controls should be visible
    const storyTitleInput = screen.getByLabelText(/story title/i);
    const addStoryButton = screen.getByRole('button', { name: /add & start story/i });
    
    // Act: Add a new story
    await userEvent.type(storyTitleInput, 'My New Story');
    await userEvent.click(addStoryButton);
    
    // Assert: The new story should be displayed
    await waitFor(() => {
        expect(screen.getByText('My New Story')).toBeInTheDocument();
    });
  });
  
  it('allows a player to cast a vote', async () => {
    const player = { name: 'Player1', isModerator: false, role: 'PLAYER', hasVoted: false };
    const roomState = { 
      ...roomInitialState,
      roomId: 'test-room-123',
      participants: { [player.name]: player },
      stories: [{ id: 's1', title: 'Active Story' }],
      activeStoryId: 's1',
    };
    renderWithProviders(<RoomPage />, { preloadedState: { room: roomState }, routeState: { currentUser: player } });

    // The voting panel should be visible
    const voteButton5 = screen.getByRole('button', { name: '5' });
    
    // Act: Cast a vote
    await userEvent.click(voteButton5);
    
    // Assert: The UI should update to show the vote was cast
    await waitFor(() => {
      expect(screen.getByText(/your vote is in!/i)).toBeInTheDocument();
      // The button should now be disabled
      expect(voteButton5).toBeDisabled();
    });
  });

  it('should not show VotingPanel or ModeratorControls for a spectator', () => {
    const spectator = { name: 'Watcher', isModerator: false, role: 'SPECTATOR' };
    const roomState = { 
        ...roomInitialState,
        roomId: 'test-room-123',
        participants: { [spectator.name]: spectator },
        stories: [{ id: 's1', title: 'Active Story' }],
        activeStoryId: 's1',
    };
    renderWithProviders(<RoomPage />, { preloadedState: { room: roomState }, routeState: { currentUser: spectator } });

    // Assert: The interactive panels should NOT be in the document
    expect(screen.queryByText(/cast your vote/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/moderator controls/i)).not.toBeInTheDocument();
    // But the participant list should be there
    expect(screen.getByText(/participants/i)).toBeInTheDocument();
  });
});