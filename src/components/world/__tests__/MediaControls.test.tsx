import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaControls from '../MediaControls';

describe('MediaControls', () => {
  const mockControls = {
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    onToggleMute: jest.fn(),
    onToggleVideo: jest.fn(),
    onToggleScreenShare: jest.fn(),
    onLeaveCall: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all media control buttons', () => {
    render(<MediaControls {...mockControls} />);
    
    expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /video/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /screen share/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /leave/i })).toBeInTheDocument();
  });

  it('shows microphone as unmuted when isMuted is false', () => {
    render(<MediaControls {...mockControls} />);
    
    const muteButton = screen.getByRole('button', { name: /mute/i });
    expect(muteButton).toHaveClass(/unmuted/i);
  });

  it('shows microphone as muted when isMuted is true', () => {
    const mutedControls = { ...mockControls, isMuted: true };
    render(<MediaControls {...mutedControls} />);
    
    const muteButton = screen.getByRole('button', { name: /mute/i });
    expect(muteButton).toHaveClass(/muted/i);
  });

  it('shows video as on when isVideoOff is false', () => {
    render(<MediaControls {...mockControls} />);
    
    const videoButton = screen.getByRole('button', { name: /video/i });
    expect(videoButton).toHaveClass(/video-on/i);
  });

  it('shows video as off when isVideoOff is true', () => {
    const videoOffControls = { ...mockControls, isVideoOff: true };
    render(<MediaControls {...videoOffControls} />);
    
    const videoButton = screen.getByRole('button', { name: /video/i });
    expect(videoButton).toHaveClass(/video-off/i);
  });

  it('shows screen share as inactive when isScreenSharing is false', () => {
    render(<MediaControls {...mockControls} />);
    
    const screenShareButton = screen.getByRole('button', { name: /screen share/i });
    expect(screenShareButton).toHaveClass(/screen-share-off/i);
  });

  it('shows screen share as active when isScreenSharing is true', () => {
    const screenSharingControls = { ...mockControls, isScreenSharing: true };
    render(<MediaControls {...screenSharingControls} />);
    
    const screenShareButton = screen.getByRole('button', { name: /screen share/i });
    expect(screenShareButton).toHaveClass(/screen-share-on/i);
  });

  it('calls onToggleMute when mute button is clicked', () => {
    render(<MediaControls {...mockControls} />);
    
    const muteButton = screen.getByRole('button', { name: /mute/i });
    fireEvent.click(muteButton);
    
    expect(mockControls.onToggleMute).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleVideo when video button is clicked', () => {
    render(<MediaControls {...mockControls} />);
    
    const videoButton = screen.getByRole('button', { name: /video/i });
    fireEvent.click(videoButton);
    
    expect(mockControls.onToggleVideo).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleScreenShare when screen share button is clicked', () => {
    render(<MediaControls {...mockControls} />);
    
    const screenShareButton = screen.getByRole('button', { name: /screen share/i });
    fireEvent.click(screenShareButton);
    
    expect(mockControls.onToggleScreenShare).toHaveBeenCalledTimes(1);
  });

  it('calls onLeaveCall when leave button is clicked', () => {
    render(<MediaControls {...mockControls} />);
    
    const leaveButton = screen.getByRole('button', { name: /leave/i });
    fireEvent.click(leaveButton);
    
    expect(mockControls.onLeaveCall).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<MediaControls {...mockControls} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('displays proper icons for each control', () => {
    render(<MediaControls {...mockControls} />);
    
    // Check that icons are present
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4); // At least 4 icons for 4 buttons
  });

  it('uses appropriate colors for active/inactive states', () => {
    const allActiveControls = {
      ...mockControls,
      isMuted: true,
      isVideoOff: true,
      isScreenSharing: true,
    };
    
    render(<MediaControls {...allActiveControls} />);
    
    const muteButton = screen.getByRole('button', { name: /mute/i });
    const videoButton = screen.getByRole('button', { name: /video/i });
    const screenShareButton = screen.getByRole('button', { name: /screen share/i });
    
    // Active/muted states should have different styling
    expect(muteButton).toHaveClass(/destructive/i);
    expect(videoButton).toHaveClass(/destructive/i);
    expect(screenShareButton).toHaveClass(/primary/i);
  });

  it('maintains button accessibility during state changes', () => {
    const { rerender } = render(<MediaControls {...mockControls} />);
    
    // Check initial state
    const muteButton = screen.getByRole('button', { name: /mute/i });
    expect(muteButton).toBeInTheDocument();
    
    // Change state and rerender
    const newControls = { ...mockControls, isMuted: true };
    rerender(<MediaControls {...newControls} />);
    
    // Button should still be accessible
    const updatedMuteButton = screen.getByRole('button', { name: /mute/i });
    expect(updatedMuteButton).toBeInTheDocument();
  });
});