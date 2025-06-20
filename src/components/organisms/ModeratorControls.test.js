// src/components/organisms/ModeratorControls.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ModeratorControls from './ModeratorControls';

describe('ModeratorControls Component', () => {
  
  // Define a set of mock props to be used in our tests
  const mockProps = {
    storyTitle: '',
    onTitleChange: jest.fn(),
    storyDesc: '',
    onDescChange: jest.fn(),
    onAddStory: jest.fn(),
    onRevealVotes: jest.fn(),
    onStartNewRound: jest.fn(),
    canReveal: false, // Default to disabled for Reveal Votes button
  };

  // Reset mocks before each test to ensure they are clean
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Basic rendering check
  it('should render all input fields and control buttons', () => {
    render(<ModeratorControls {...mockProps} />);

    // Check for the input fields by their labels
    expect(screen.getByLabelText(/story title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/story description/i)).toBeInTheDocument();

    // Check for the buttons by their accessible name (text content)
    expect(screen.getByRole('button', { name: /add & start story/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reveal votes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start new round/i })).toBeInTheDocument();
  });

  // Test 2: User input simulation
  it('should call onTitleChange and onDescChange when user types in the respective fields', async () => {
    render(<ModeratorControls {...mockProps} />);
    
    const titleInput = screen.getByLabelText(/story title/i);
    const descInput = screen.getByLabelText(/story description/i);

    // Simulate typing
    await userEvent.type(titleInput, 'New Feature');
    await userEvent.type(descInput, 'A cool new thing');

    // Assert that the handlers were called
    expect(mockProps.onTitleChange).toHaveBeenCalled();
    expect(mockProps.onDescChange).toHaveBeenCalled();
  });

  // Test 3: Button click simulations
  it('should call the correct handler when each button is clicked', async () => {
    // We need canReveal to be true to test the reveal votes button click
    render(<ModeratorControls {...mockProps} canReveal={true} />);
    
    // Find all the buttons
    const addButton = screen.getByRole('button', { name: /add & start story/i });
    const revealButton = screen.getByRole('button', { name: /reveal votes/i });
    const newRoundButton = screen.getByRole('button', { name: /start new round/i });
    
    // Click each button
    await userEvent.click(addButton);
    await userEvent.click(revealButton);
    await userEvent.click(newRoundButton);
    
    // Assert that each corresponding handler was called once
    expect(mockProps.onAddStory).toHaveBeenCalledTimes(1);
    expect(mockProps.onRevealVotes).toHaveBeenCalledTimes(1);
    expect(mockProps.onStartNewRound).toHaveBeenCalledTimes(1);
  });

  // Test 4: Conditional logic for the "Reveal Votes" button
  describe('the "Reveal Votes" button', () => {

    it('should be disabled when canReveal prop is false', () => {
      // Render with canReveal set to false (which is the default in mockProps)
      render(<ModeratorControls {...mockProps} canReveal={false} />);
      
      const revealButton = screen.getByRole('button', { name: /reveal votes/i });
      
      // The button should be disabled
      expect(revealButton).toBeDisabled();
    });

    it('should be enabled when canReveal prop is true', () => {
      // Render with canReveal set to true
      render(<ModeratorControls {...mockProps} canReveal={true} />);
      
      const revealButton = screen.getByRole('button', { name: /reveal votes/i });
      
      // The button should NOT be disabled
      expect(revealButton).not.toBeDisabled();
    });

    it('should not call onRevealVotes when clicked if disabled', async () => {
      // Render in the disabled state
      render(<ModeratorControls {...mockProps} canReveal={false} />);
      
      const revealButton = screen.getByRole('button', { name: /reveal votes/i });
      
      // Click the disabled button
      await userEvent.click(revealButton);

      // Assert that the handler was NOT called
      expect(mockProps.onRevealVotes).not.toHaveBeenCalled();
    });
  });
});