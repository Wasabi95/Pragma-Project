// src/components/templates/RoomTemplate.test.js
// src/components/templates/RoomTemplate.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomTemplate from './RoomTemplate';

describe('RoomTemplate Component', () => {
  const mockParticipantsPanel = <div data-testid="participants">Participants</div>;
  const mockModeratorControls = <div data-testid="moderator">Moderator Controls</div>;
  const mockStoryPanel = <div data-testid="story">Story Panel</div>;
  const mockVotingPanel = <div data-testid="voting">Voting Panel</div>;

  const baseProps = {
    roomHeaderInfo: {
      roomName: 'Test Room',
      userName: 'Test User',
      isModerator: false,
      userRole: 'PLAYER',
      onCopyLink: jest.fn()
    },
    participantsPanel: mockParticipantsPanel,
    moderatorControls: mockModeratorControls,
    storyPanel: mockStoryPanel,
    votingPanel: mockVotingPanel
  };

  test('renders basic room information', () => {
    render(<RoomTemplate {...baseProps} />);
    
    expect(screen.getByText('Room: Test Room')).toBeInTheDocument();
    expect(screen.getByText('Welcome,')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('shows player badge when user is PLAYER', () => {
    render(<RoomTemplate {...baseProps} />);
    expect(screen.getByText('Jugador')).toBeInTheDocument();
    expect(screen.queryByText('Espectador')).not.toBeInTheDocument();
  });

  test('shows spectator badge when user is SPECTATOR', () => {
    const props = {
      ...baseProps,
      roomHeaderInfo: {
        ...baseProps.roomHeaderInfo,
        userRole: 'SPECTATOR'
      }
    };
    render(<RoomTemplate {...props} />);
    expect(screen.getByText('Espectador')).toBeInTheDocument();
    expect(screen.queryByText('Jugador')).not.toBeInTheDocument();
  });

  test('shows moderator badge when user is moderator', () => {
    const props = {
      ...baseProps,
      roomHeaderInfo: {
        ...baseProps.roomHeaderInfo,
        isModerator: true
      }
    };
    render(<RoomTemplate {...props} />);
    expect(screen.getByText('Moderator')).toBeInTheDocument();
  });

  test('calls onCopyLink when button is clicked', () => {
    render(<RoomTemplate {...baseProps} />);
    fireEvent.click(screen.getByText('📋 Copy Room Link'));
    expect(baseProps.roomHeaderInfo.onCopyLink).toHaveBeenCalledTimes(1);
  });

  test('renders all panel components', () => {
    render(<RoomTemplate {...baseProps} />);
    expect(screen.getByTestId('participants')).toBeInTheDocument();
    expect(screen.getByTestId('story')).toBeInTheDocument();
    expect(screen.getByTestId('voting')).toBeInTheDocument();
  });

  test('only shows moderator controls when user is moderator', () => {
    // Test when not moderator
    const { rerender } = render(<RoomTemplate {...baseProps} />);
    expect(screen.queryByTestId('moderator')).not.toBeInTheDocument();
    
    // Test when is moderator
    const moderatorProps = {
      ...baseProps,
      roomHeaderInfo: {
        ...baseProps.roomHeaderInfo,
        isModerator: true
      }
    };
    rerender(<RoomTemplate {...moderatorProps} />);
    expect(screen.getByTestId('moderator')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<RoomTemplate {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});