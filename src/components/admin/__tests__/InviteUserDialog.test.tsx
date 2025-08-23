import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InviteUserDialog from '../InviteUserDialog';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/hooks/use-toast');
global.fetch = jest.fn();

const mockToast = jest.fn();

describe('InviteUserDialog', () => {
  const mockOnInviteSent = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders the invite user button', () => {
    render(<InviteUserDialog onInviteSent={mockOnInviteSent} />);
    
    const button = screen.getByRole('button', { name: /invite user/i });
    expect(button).toBeInTheDocument();
  });

  it('opens dialog when invite button is clicked', () => {
    render(<InviteUserDialog onInviteSent={mockOnInviteSent} />);
    
    const triggerButton = screen.getByRole('button', { name: /invite user/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText('Invite New User')).toBeInTheDocument();
    expect(screen.getByText('Send an invitation to join the platform')).toBeInTheDocument();
  });

  it('renders all form fields when dialog is open', () => {
    render(<InviteUserDialog onInviteSent={mockOnInviteSent} />);
    
    fireEvent.click(screen.getByRole('button', { name: /invite user/i }));

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(<InviteUserDialog onInviteSent={mockOnInviteSent} />);
    
    fireEvent.click(screen.getByRole('button', { name: /invite user/i }));
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const sendButton = screen.getByText('Send Invitation');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('submits invitation successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Invitation sent successfully' }),
    });

    render(<InviteUserDialog onInviteSent={mockOnInviteSent} />);
    
    fireEvent.click(screen.getByRole('button', { name: /invite user/i }));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    
    const sendButton = screen.getByText('Send Invitation');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/admin/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          role: 'User',
        }),
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Invitation Sent',
        description: 'Invitation sent successfully',
      });
    });

    expect(mockOnInviteSent).toHaveBeenCalled();
  });

  it('handles invitation errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'User already exists' }),
    });

    render(<InviteUserDialog onInviteSent={mockOnInviteSent} />);
    
    fireEvent.click(screen.getByRole('button', { name: /invite user/i }));
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    
    fireEvent.click(screen.getByText('Send Invitation'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'User already exists',
      });
    });
  });
});