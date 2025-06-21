// src/App.test.js
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom'; // Use MemoryRouter for testing
import App from './App';
import roomReducer, { setRoomState } from './store/roomSlice';

// 1. Mock child components for isolation
jest.mock('./components/pages/HomePage', () => () => <div>HomePage Mock</div>);
jest.mock('./components/pages/RoomPage', () => () => <div>RoomPage Mock</div>);
// Mock the layout but ensure it renders its children
jest.mock('./components/layout/MainLayout', () => ({ children }) => <div data-testid="main-layout">{children}</div>);

describe('App Component', () => {
  // Helper function to render the App with necessary providers
  const renderApp = (initialRoute = '/') => {
    const store = configureStore({
      reducer: {
        room: roomReducer, // Use the real reducer
      },
    });

    // Spy on the dispatch method BEFORE rendering
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const utils = render(
      <Provider store={store}>
        {/* MemoryRouter is essential for testing components that use react-router */}
        <MemoryRouter initialEntries={[initialRoute]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    return { ...utils, store, dispatchSpy };
  };

  // --- Routing Tests ---

  test('renders the HomePage on the default route "/"', () => {
    renderApp('/');
    expect(screen.getByText('HomePage Mock')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    // Ensure the other page is not present
    expect(screen.queryByText('RoomPage Mock')).not.toBeInTheDocument();
  });

  test('renders the RoomPage on the "/room/:roomId" route', () => {
    renderApp('/room/test-123');
    expect(screen.getByText('RoomPage Mock')).toBeInTheDocument();
    // Ensure the other page is not present
    expect(screen.queryByText('HomePage Mock')).not.toBeInTheDocument();
  });

  // --- Side Effect (useEffect) Test ---

  describe('localStorage event handling', () => {
    test('dispatches setRoomState when a valid storage event occurs', () => {
      // Arrange
      const { dispatchSpy } = renderApp('/');
      const mockRoomData = { name: 'The Fun Room', users: ['Alice'] };
      const storageEvent = new StorageEvent('storage', {
        key: 'room-abc-456',
        newValue: JSON.stringify(mockRoomData),
      });

      // Act: Manually fire the window event.
      // act() ensures that React has processed the state update from the dispatch
      act(() => {
        window.dispatchEvent(storageEvent);
      });

      // Assert
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setRoomState({
          roomId: 'room-abc-456',
          ...mockRoomData,
        })
      );
    });

    test('does not dispatch if storage key does not start with "room-"', () => {
      const { dispatchSpy } = renderApp('/');
      const storageEvent = new StorageEvent('storage', {
        key: 'user-settings',
        newValue: '{"theme":"dark"}',
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    test('removes the event listener on component unmount', () => {
      // Arrange
      const { dispatchSpy, unmount } = renderApp('/');
      const storageEvent = new StorageEvent('storage', {
        key: 'room-will-not-be-seen',
        newValue: '{"name":"test"}',
      });

      // Act: Unmount the component to trigger the cleanup function in useEffect
      unmount();

      // Fire the event again AFTER the component is gone
      act(() => {
        window.dispatchEvent(storageEvent);
      });

      // Assert: The dispatch function should NOT have been called
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});