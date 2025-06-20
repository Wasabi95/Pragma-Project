// src/components/organisms/JoinRoomForm.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import JoinRoomForm from './JoinRoomForm';

describe('JoinRoomForm Component', () => {

  // Define default mock props for a clean baseline in each test.
  const mockProps = {
    roomName: 'Awesome Planning Room',
    userName: '',
    onUserNameChange: jest.fn(),
    // Apply the lesson learned: our mock onSubmit must call preventDefault.
    onSubmit: jest.fn(e => e.preventDefault()),
    userRole: 'PLAYER',
    onUserRoleChange: jest.fn(),
    roleError: '',
  };

  // Reset all mock functions before each test to ensure isolation.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verifying the initial render and key display logic.
  it('should render the form with the correct room name in the title', () => {
    render(<JoinRoomForm {...mockProps} />);

    // Find the heading by its role and name, ensuring the prop is displayed.
    expect(screen.getByRole('heading', { name: /join room: awesome planning room/i })).toBeInTheDocument();
    
    // Check that the other fields are present.
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /jugador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join room/i })).toBeInTheDocument();
  });

  // Test 2: Simulating user typing.
  it('should call onUserNameChange when the user types in the name field', async () => {
    render(<JoinRoomForm {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/your name/i);
    await userEvent.type(nameInput, 'Bob');

    // Assert that the handler was called.
    expect(mockProps.onUserNameChange).toHaveBeenCalled();
  });

  // Test 3: Simulating role selection.
  it('should call onUserRoleChange when a role radio button is clicked', async () => {
    render(<JoinRoomForm {...mockProps} userRole="PLAYER" />);
    
    const spectatorRadio = screen.getByRole('radio', { name: /espectador/i });
    await userEvent.click(spectatorRadio);
    
    expect(mockProps.onUserRoleChange).toHaveBeenCalledTimes(1);
  });
  
  // Test 4: Verifying form submission using the robust fireEvent.submit pattern.
  it('should call onSubmit when the form is submitted', () => {
    render(<JoinRoomForm {...mockProps} />);
    
    // Find the form element itself.
    const formElement = screen.getByRole('button', { name: /join room/i }).closest('form');
    
    // Directly fire the submit event on the form.
    fireEvent.submit(formElement);
    
    // The only assertion we need is that our handler was called.
    expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
  });
  
  // Test 5: Checking the display of validation errors.
  it('should display the roleError message when the prop is provided', () => {
    const errorText = 'You must select a role to join.';
    render(<JoinRoomForm {...mockProps} roleError={errorText} />);
    
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });
  
  // Test 6: Ensuring errors are not displayed when they shouldn't be.
  it('should not display a roleError message when the prop is empty', () => {
    render(<JoinRoomForm {...mockProps} />);
    
    // Use `queryBy...` because it returns null instead of throwing an error if the element isn't found.
    const errorText = 'You must select a role to join.';
    expect(screen.queryByText(errorText)).not.toBeInTheDocument();
  });
});