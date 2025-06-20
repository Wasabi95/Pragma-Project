// src/components/organisms/VotingPanel.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import VotingPanel from './VotingPanel';

// Define the voting options here as well so we can reference them in our tests
const VOTING_OPTIONS = [1, 2, 3, 5, 8, 13, '☕', '?'];

describe('VotingPanel Component', () => {
  // Define a mock handler for the onVote prop
  const mockOnVote = jest.fn();

  // Reset the mock's call history before each test
  beforeEach(() => {
    mockOnVote.mockClear();
  });

  // Test 1: Basic rendering check
  it('should render a button for each voting option', () => {
    render(<VotingPanel onVote={mockOnVote} hasVoted={false} />);

    // Check that every single option has a corresponding button on the screen
    VOTING_OPTIONS.forEach(option => {
      // Find each button by its role and accessible name (its text content)
      expect(screen.getByRole('button', { name: option.toString() })).toBeInTheDocument();
    });
  });

  // --- Group 2: Tests for when the user has NOT yet voted ---
  describe('when hasVoted is false', () => {
    
    it('should have all voting buttons enabled', () => {
      render(<VotingPanel onVote={mockOnVote} hasVoted={false} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });

    it('should call onVote with the correct value when a button is clicked', async () => {
      render(<VotingPanel onVote={mockOnVote} hasVoted={false} />);

      // Let's test clicking a number and a symbol
      const button8 = screen.getByRole('button', { name: '8' });
      const coffeeButton = screen.getByRole('button', { name: '☕' });

      // Simulate clicks
      await userEvent.click(button8);
      await userEvent.click(coffeeButton);

      // Assert that the handler was called with the correct values
      expect(mockOnVote).toHaveBeenCalledWith(8);
      expect(mockOnVote).toHaveBeenCalledWith('☕');
      expect(mockOnVote).toHaveBeenCalledTimes(2);
    });

    it('should not display the "vote is in" footer message', () => {
      render(<VotingPanel onVote={mockOnVote} hasVoted={false} />);

      // Use `queryByText` as it returns null if the text is not found
      const footerMessage = screen.queryByText(/your vote is in/i);
      expect(footerMessage).not.toBeInTheDocument();
    });
  });

  // --- Group 3: Tests for when the user HAS voted ---
  describe('when hasVoted is true', () => {
    
    it('should have all voting buttons disabled', () => {
      render(<VotingPanel onVote={mockOnVote} hasVoted={true} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should NOT call onVote when a disabled button is clicked', async () => {
      render(<VotingPanel onVote={mockOnVote} hasVoted={true} />);
      
      const button5 = screen.getByRole('button', { name: '5' });
      
      // Attempt to click the disabled button
      await userEvent.click(button5);

      // Assert that the handler was NOT called
      expect(mockOnVote).not.toHaveBeenCalled();
    });

    it('should display the "vote is in" footer message', () => {
      render(<VotingPanel onVote={mockOnVote} hasVoted={true} />);
      
      const footerMessage = screen.getByText(/your vote is in! waiting for others./i);
      expect(footerMessage).toBeInTheDocument();
    });
  });
});