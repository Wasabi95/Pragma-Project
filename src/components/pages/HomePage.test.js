// src/components/pages/HomePage.test.js
// src/components/pages/HomePage.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Import the REAL library as a namespace. The spy will intercept what we need.
import * as ReactRouterDom from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import roomReducer from '../../store/roomSlice';
import '@testing-library/jest-dom';

import HomePage from './HomePage';

// We'll create a mock alert to spy on it.
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Helper function to render the component with all necessary providers.
const renderComponent = () => {
  const store = configureStore({ reducer: { room: roomReducer } });
  
  // Use MemoryRouter via the namespace import.
  return render(
    <Provider store={store}>
      <ReactRouterDom.MemoryRouter>
        <HomePage />
      </ReactRouterDom.MemoryRouter>
    </Provider>
  );
};


describe('HomePage Component', () => {
  // Create a mock function for navigation.
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Before each test, we tell Jest to SPY on the 'useNavigate' hook
    // and make it return our mock function for the duration of the test.
    jest.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(mockNavigate);
    
    // Clear any previous calls to our mocks.
    mockNavigate.mockClear();
    mockAlert.mockClear();
  });

  // After each test, restore all mocks to their original state to prevent
  // tests from interfering with each other.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- All tests below are correct and will now work ---

  it('should navigate on successful form submission', async () => {
    renderComponent();

    const roomNameInput = screen.getByLabelText(/room name/i);
    const userNameInput = screen.getByLabelText(/your name/i);
    const playerRadio = screen.getByLabelText(/jugador/i);
    const createButton = screen.getByText(/create room/i);
    
    await userEvent.clear(roomNameInput);
    await userEvent.type(roomNameInput, 'Valid Room');
    await userEvent.clear(userNameInput);
    await userEvent.type(userNameInput, 'ValidUser');
    await userEvent.click(playerRadio);
    await userEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/room/room-'),
        expect.any(Object)
      );
    });
  });

  it('should show an error if room name is invalid and not submit', async () => {
    renderComponent();
    const roomNameInput = screen.getByLabelText(/room name/i);
    const createButton = screen.getByText(/create room/i);
    await userEvent.clear(roomNameInput);
    await userEvent.click(createButton);
    expect(screen.getByText('Name must be between 3 and 15 characters.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show an error if user name is invalid and not submit', async () => {
    renderComponent();
    const userNameInput = screen.getByLabelText(/your name/i);
    const createButton = screen.getByText(/create room/i);
    await userEvent.clear(userNameInput);
    await userEvent.click(createButton);
    expect(screen.getByText('Name must be between 3 and 15 characters.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show an alert and an error if user role is not selected', async () => {
    renderComponent();
    const roomNameInput = screen.getByLabelText(/room name/i);
    const userNameInput = screen.getByLabelText(/your name/i);
    const createButton = screen.getByText(/create room/i);
    await userEvent.clear(roomNameInput);
    await userEvent.type(roomNameInput, 'Valid Room');
    await userEvent.clear(userNameInput);
    await userEvent.type(userNameInput, 'ValidUser');
    await userEvent.click(createButton);
    const expectedMessage = 'Por favor, seleccione un modo de visualización (Jugador o Espectador).';
    expect(mockAlert).toHaveBeenCalledWith(expectedMessage);
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});