// src/components/molecules/ParticipantListItem.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticipantListItem from './ParticipantListItem';

// We'll create a base participant object to avoid repetition
const baseParticipant = {
  name: 'Alice',
  isModerator: false,
  role: 'VOTER',
  hasVoted: false,
  vote: null,
};

describe('ParticipantListItem Component', () => {

  // --- Group 1: Tests for when votes are NOT revealed ---
  describe('when votes are hidden (votesRevealed = false)', () => {
    
    it('should display the participant name', () => {
      render(<ParticipantListItem participant={baseParticipant} votesRevealed={false} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('should display a crown icon for the moderator', () => {
      const moderator = { ...baseParticipant, isModerator: true };
      render(<ParticipantListItem participant={moderator} votesRevealed={false} />);
      // We check for the text content including the emoji.
      expect(screen.getByText('Alice 👑')).toBeInTheDocument();
    });

    it('should display an eye icon for a spectator', () => {
      const spectator = { ...baseParticipant, role: 'SPECTATOR' };
      render(<ParticipantListItem participant={spectator} votesRevealed={false} />);
      expect(screen.getByText('Alice 👁️')).toBeInTheDocument();
    });

    it('should display a checkmark if the participant has voted', () => {
      const votedParticipant = { ...baseParticipant, hasVoted: true };
      render(<ParticipantListItem participant={votedParticipant} votesRevealed={false} />);
      expect(screen.getByText('Alice ✅')).toBeInTheDocument();
    });

    it('should NOT display the vote badge', () => {
      const participant = { ...baseParticipant, hasVoted: true, vote: 8 };
      render(<ParticipantListItem participant={participant} votesRevealed={false} />);
      // `queryByText` is used because it returns `null` if the element is not found,
      // which is what we want to assert. `getByText` would throw an error.
      expect(screen.queryByText('8')).not.toBeInTheDocument();
    });

    it('should display multiple icons correctly (e.g., moderator who has voted)', () => {
        const participant = { ...baseParticipant, isModerator: true, hasVoted: true };
        render(<ParticipantListItem participant={participant} votesRevealed={false} />);
        expect(screen.getByText('Alice 👑 ✅')).toBeInTheDocument();
    });
  });


  // --- Group 2: Tests for when votes ARE revealed ---
  describe('when votes are revealed (votesRevealed = true)', () => {

    it('should display the participant name', () => {
      const participant = { ...baseParticipant, vote: 5 };
      render(<ParticipantListItem participant={participant} votesRevealed={true} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('should display the vote in a badge', () => {
      const participant = { ...baseParticipant, vote: 13 };
      render(<ParticipantListItem participant={participant} votesRevealed={true} />);
      // We can find the badge by its content.
      const badgeElement = screen.getByText('13');
      expect(badgeElement).toBeInTheDocument();
      // We can also check that it's inside an element with the 'badge' class.
      expect(badgeElement).toHaveClass('badge');
    });

    it('should NOT display the "has voted" checkmark', () => {
      const participant = { ...baseParticipant, hasVoted: true, vote: 3 };
      render(<ParticipantListItem participant={participant} votesRevealed={true} />);
      
      // The text "Alice" should exist, but not with the checkmark emoji.
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Alice ✅')).not.toBeInTheDocument();
    });
    
    it('should still display the moderator crown', () => {
      const moderator = { ...baseParticipant, isModerator: true, vote: 21 };
      render(<ParticipantListItem participant={moderator} votesRevealed={true} />);
      // The text content with the crown should still be there.
      expect(screen.getByText('Alice 👑')).toBeInTheDocument();
    });

    it('should still display the spectator eye', () => {
      const spectator = { ...baseParticipant, role: 'SPECTATOR', vote: null };
      render(<ParticipantListItem participant={spectator} votesRevealed={true} />);
      expect(screen.getByText('Alice 👁️')).toBeInTheDocument();
      // Spectators should not have a vote badge even when revealed.
      expect(screen.queryByRole('badge')).not.toBeInTheDocument(); // Assuming Badge renders a role
    });
  });
});