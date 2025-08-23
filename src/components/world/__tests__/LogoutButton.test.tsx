import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from '../LogoutButton';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/lib/supabase/client');
jest.mock('next/navigation');
jest.mock('@/hooks/use-toast');

const mockSupabaseClient = {
  auth: {
    signOut: jest.fn(),
  },
};

const mockPush = jest.fn();
const mockToast = jest.fn();

describe('LogoutButton', () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    jest.clearAllMocks();
  });

  it('renders the logout button', () => {
    render(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('displays logout icon and text', () => {
    render(<LogoutButton />);
    
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Check for icon by looking for svg element
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('calls signOut and redirects on logout', async () => {
    mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });
    
    render(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows error toast when logout fails', async () => {
    const errorMessage = 'Logout failed';
    mockSupabaseClient.auth.signOut.mockResolvedValue({ 
      error: { message: errorMessage } 
    });
    
    render(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Error',
      description: errorMessage,
    });
  });

  it('has proper styling classes', () => {
    render(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('flex', 'items-center', 'w-full');
  });
});