import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileSetup from '../ProfileSetup';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/hooks/use-toast');
global.fetch = jest.fn();

const mockPush = jest.fn();
const mockToast = jest.fn();

describe('ProfileSetup', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders profile setup form', () => {
    render(<ProfileSetup />);
    
    expect(screen.getByText(/complete your profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('displays all required form fields', () => {
    render(<ProfileSetup />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /complete profile/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<ProfileSetup />);
    
    const submitButton = screen.getByRole('button', { name: /complete profile/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });
  });

  it('submits profile data successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Profile updated successfully' }),
    });

    render(<ProfileSetup />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText(/last name/i), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByLabelText(/job title/i), { 
      target: { value: 'Software Engineer' } 
    });
    fireEvent.change(screen.getByLabelText(/department/i), { 
      target: { value: 'Engineering' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /complete profile/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
          job_title: 'Software Engineer',
          department: 'Engineering',
          profile_complete: true,
        }),
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Profile Completed',
        description: 'Profile updated successfully',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('handles profile update errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Profile update failed' }),
    });

    render(<ProfileSetup />);
    
    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText(/last name/i), { 
      target: { value: 'Doe' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /complete profile/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Profile update failed',
      });
    });
  });

  it('disables submit button while submitting', async () => {
    render(<ProfileSetup />);
    
    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText(/last name/i), { 
      target: { value: 'Doe' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /complete profile/i });
    fireEvent.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
  });

  it('validates first name length', async () => {
    render(<ProfileSetup />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'A' } });
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('validates last name length', async () => {
    render(<ProfileSetup />);
    
    const lastNameInput = screen.getByLabelText(/last name/i);
    fireEvent.change(lastNameInput, { target: { value: 'B' } });
    fireEvent.blur(lastNameInput);

    await waitFor(() => {
      expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('allows optional fields to be empty', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Profile updated successfully' }),
    });

    render(<ProfileSetup />);
    
    // Only fill required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText(/last name/i), { 
      target: { value: 'Doe' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /complete profile/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/profile/update', 
        expect.objectContaining({
          body: JSON.stringify({
            first_name: 'John',
            last_name: 'Doe',
            job_title: '',
            department: '',
            profile_complete: true,
          }),
        })
      );
    });
  });
});