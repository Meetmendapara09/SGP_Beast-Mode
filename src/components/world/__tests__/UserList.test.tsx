import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../UserList';

describe('UserList', () => {
  const mockUsers = [
    {
      id: 'user-1',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      isOnline: true,
      position: { x: 100, y: 200 },
      avatar: null,
    },
    {
      id: 'user-2',
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      isOnline: false,
      position: { x: 150, y: 250 },
      avatar: 'https://example.com/avatar.jpg',
    },
    {
      id: 'user-3',
      email: 'mike@example.com',
      first_name: 'Mike',
      last_name: 'Johnson',
      isOnline: true,
      position: { x: 200, y: 300 },
      avatar: null,
    },
  ];

  const mockOnUserClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user list with all users', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
  });

  it('displays online status indicators', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    // Check for online indicators (green dots or similar)
    const onlineIndicators = screen.getAllByTestId(/online-status/);
    expect(onlineIndicators.length).toBeGreaterThan(0);
  });

  it('shows user avatars when available', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    // Jane should have an avatar
    const avatarImage = screen.getByAltText('Jane Smith avatar');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows default avatar for users without custom avatars', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    // John and Mike should have default avatars (initials)
    expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe initials
    expect(screen.getByText('MJ')).toBeInTheDocument(); // Mike Johnson initials
  });

  it('calls onUserClick when a user is clicked', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    const johnUser = screen.getByText('John Doe').closest('button');
    fireEvent.click(johnUser!);
    
    expect(mockOnUserClick).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('distinguishes between online and offline users visually', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    // Online users should have different styling than offline users
    const johnElement = screen.getByText('John Doe').closest('div');
    const janeElement = screen.getByText('Jane Smith').closest('div');
    
    expect(johnElement).toHaveClass(/online/i);
    expect(janeElement).toHaveClass(/offline/i);
  });

  it('renders empty state when no users provided', () => {
    render(<UserList users={[]} onUserClick={mockOnUserClick} />);
    
    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it('displays user positions when available', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    // Check if position information is displayed
    expect(screen.getByText(/100, 200/)).toBeInTheDocument();
    expect(screen.getByText(/150, 250/)).toBeInTheDocument();
    expect(screen.getByText(/200, 300/)).toBeInTheDocument();
  });

  it('sorts users by online status (online first)', () => {
    render(<UserList users={mockUsers} onUserClick={mockOnUserClick} />);
    
    const userElements = screen.getAllByRole('button');
    const firstUserName = userElements[0].textContent;
    const secondUserName = userElements[1].textContent;
    
    // Online users (John and Mike) should appear before offline users (Jane)
    expect(firstUserName).toMatch(/(John Doe|Mike Johnson)/);
    expect(secondUserName).toMatch(/(John Doe|Mike Johnson)/);
  });

  it('handles users with missing name information', () => {
    const usersWithMissingNames = [
      {
        id: 'user-4',
        email: 'test@example.com',
        first_name: '',
        last_name: '',
        isOnline: true,
        position: { x: 0, y: 0 },
        avatar: null,
      },
    ];

    render(<UserList users={usersWithMissingNames} onUserClick={mockOnUserClick} />);
    
    // Should fallback to email when name is missing
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});