// src/components/organisms/CreateRoomForm.test.js
// src/components/organisms/CreateRoomForm.test.js

import React from 'react';
// We need fireEvent for this specific test case
import { render, screen, fireEvent } from '@testing-library/react'; 
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import CreateRoomForm from './CreateRoomForm';

describe('CreateRoomForm Component', () => {
  // THIS MOCK IS CORRECT. It's crucial for the test to pass.
  const mockProps = {
    roomName: '',
    onRoomNameChange: jest.fn(),
    userName: '',
    onUserNameChange: jest.fn(),
    onSubmit: jest.fn(e => e.preventDefault()), // This is correct.
    roomNameError: '',
    userNameError: '',
    userRole: 'PLAYER',
    onUserRoleChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // All other tests are correct and do not need to change.
  it('should render the form with all fields and a submit button', () => {
    render(<CreateRoomForm {...mockProps} />);
    expect(screen.getByLabelText(/room name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /jugador/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /espectador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create room/i })).toBeInTheDocument();
  });

  it('should call onRoomNameChange and onUserNameChange when user types', async () => {
    render(<CreateRoomForm {...mockProps} />);
    const roomNameInput = screen.getByLabelText(/room name/i);
    const userNameInput = screen.getByLabelText(/your name/i);
    await userEvent.type(roomNameInput, 'My Test Room');
    await userEvent.type(userNameInput, 'Alice');
    expect(mockProps.onRoomNameChange).toHaveBeenCalled();
    expect(mockProps.onUserNameChange).toHaveBeenCalled();
  });

  it('should call onUserRoleChange when a radio button is selected', async () => {
    render(<CreateRoomForm {...mockProps} userRole="PLAYER" />);
    const spectatorRadio = screen.getByRole('radio', { name: /espectador/i });
    await userEvent.click(spectatorRadio);
    expect(mockProps.onUserRoleChange).toHaveBeenCalledTimes(1);
  });

  // =====================================================================
  // THIS IS THE CORRECTED TEST FOR FORM SUBMISSION
  // =====================================================================
it('should call onSubmit when the form is submitted', () => {
  render(<CreateRoomForm {...mockProps} />);
  
  // Find the form
  const submitButton = screen.getByRole('button', { name: /create room/i });
  const formElement = submitButton.closest('form');
  
  // Fire the submit event
  fireEvent.submit(formElement);
  
  // This is the only assertion we need. It proves the component did its job.
  expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
});
  // The rest of the tests are correct.
  it('should display validation error messages when provided', () => {
    const errorProps = {
      ...mockProps,
      roomNameError: 'Room name cannot be empty.',
      userNameError: 'User name is required.',
    };
    render(<CreateRoomForm {...errorProps} />);
    expect(screen.getByText('Room name cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('User name is required.')).toBeInTheDocument();
  });

  it('should not display validation error messages when they are not provided', () => {
    render(<CreateRoomForm {...mockProps} />);
    expect(screen.queryByText('Room name cannot be empty.')).not.toBeInTheDocument();
    expect(screen.queryByText('User name is required.')).not.toBeInTheDocument();
  });
});
