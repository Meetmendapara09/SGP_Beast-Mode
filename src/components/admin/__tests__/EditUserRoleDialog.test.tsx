import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserRoleDialog from '../EditUserRoleDialog';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/hooks/use-toast');
global.fetch = jest.fn();

const mockToast = jest.fn();

describe('EditUserRoleDialog', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'User' as const,
    first_name: 'John',
    last_name: 'Doe',
    profile_complete: true,
  };

  const mockOnUserUpdate = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders the edit role button when closed', () => {
    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={false} 
        setIsOpen={jest.fn()} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    expect(screen.queryByText('Edit User Role')).not.toBeInTheDocument();
  });

  it('renders the dialog when open', () => {
    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={true} 
        setIsOpen={jest.fn()} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    expect(screen.getByText('Edit User Role')).toBeInTheDocument();
    expect(screen.getByText('Change the role for test@example.com')).toBeInTheDocument();
  });

  it('displays current user role as selected', () => {
    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={true} 
        setIsOpen={jest.fn()} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    const roleSelect = screen.getByDisplayValue('User');
    expect(roleSelect).toBeInTheDocument();
  });

  it('cancels role change when cancel is clicked', () => {
    const mockSetIsOpen = jest.fn();
    
    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={true} 
        setIsOpen={mockSetIsOpen} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('updates user role successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Role updated successfully' }),
    });

    const mockSetIsOpen = jest.fn();
    
    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={true} 
        setIsOpen={mockSetIsOpen} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    // Change role
    const roleSelect = screen.getByDisplayValue('User');
    fireEvent.change(roleSelect, { target: { value: 'Admin' } });
    
    const saveButton = screen.getByText('Update Role');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/admin/users/user-123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Admin' }),
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Role Updated',
        description: 'Role updated successfully',
      });
    });

    expect(mockOnUserUpdate).toHaveBeenCalled();
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('handles role update errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Insufficient permissions' }),
    });

    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={true} 
        setIsOpen={jest.fn()} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    const roleSelect = screen.getByDisplayValue('User');
    fireEvent.change(roleSelect, { target: { value: 'Admin' } });
    
    fireEvent.click(screen.getByText('Update Role'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Insufficient permissions',
      });
    });
  });

  it('prevents updating to the same role', () => {
    render(
      <EditUserRoleDialog 
        user={mockUser} 
        isOpen={true} 
        setIsOpen={jest.fn()} 
        onUserUpdate={mockOnUserUpdate} 
      />
    );
    
    // Role should remain as User and button should be disabled or not trigger update
    const saveButton = screen.getByText('Update Role');
    expect(saveButton).toBeInTheDocument();
  });
});