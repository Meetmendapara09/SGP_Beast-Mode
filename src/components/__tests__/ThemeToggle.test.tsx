import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
    });
    mockSetTheme.mockClear();
  });

  it('renders the toggle button with proper accessibility', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-haspopup');
  });

  it('opens dropdown menu when clicked', async () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument();
    });
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setTheme with "light" when Light option is selected', async () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument();
    });
    
    const lightOption = screen.getByText('Light');
    fireEvent.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with "dark" when Dark option is selected', async () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
    
    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "system" when System option is selected', async () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('System')).toBeInTheDocument();
    });
    
    const systemOption = screen.getByText('System');
    fireEvent.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('displays sun and moon icons for theme indication', () => {
    render(<ThemeToggle />);
    
    // Icons are present but styling makes them conditionally visible
    const sunIcon = document.querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
  });
});