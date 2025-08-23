import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPanel from '../SettingsPanel';

// Mock the dependencies
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe('SettingsPanel', () => {
  const mockSettings = {
    notifications: true,
    soundEnabled: true,
    theme: 'light' as const,
    autoJoin: false,
  };

  const mockOnSettingsChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all settings options', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/sound/i)).toBeInTheDocument();
    expect(screen.getByText(/theme/i)).toBeInTheDocument();
    expect(screen.getByText(/auto join/i)).toBeInTheDocument();
  });

  it('displays current notification setting state', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const notificationToggle = screen.getByRole('switch', { name: /notifications/i });
    expect(notificationToggle).toBeChecked();
  });

  it('displays current sound setting state', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const soundToggle = screen.getByRole('switch', { name: /sound/i });
    expect(soundToggle).toBeChecked();
  });

  it('displays current auto join setting state', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const autoJoinToggle = screen.getByRole('switch', { name: /auto join/i });
    expect(autoJoinToggle).not.toBeChecked();
  });

  it('calls onSettingsChange when notification toggle is changed', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const notificationToggle = screen.getByRole('switch', { name: /notifications/i });
    fireEvent.click(notificationToggle);
    
    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      notifications: false,
    });
  });

  it('calls onSettingsChange when sound toggle is changed', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const soundToggle = screen.getByRole('switch', { name: /sound/i });
    fireEvent.click(soundToggle);
    
    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      soundEnabled: false,
    });
  });

  it('calls onSettingsChange when auto join toggle is changed', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const autoJoinToggle = screen.getByRole('switch', { name: /auto join/i });
    fireEvent.click(autoJoinToggle);
    
    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      autoJoin: true,
    });
  });

  it('handles theme selection change', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    // Assuming there's a theme selector
    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    
    expect(mockOnSettingsChange).toHaveBeenCalledWith({
      ...mockSettings,
      theme: 'dark',
    });
  });

  it('renders settings with disabled states correctly', () => {
    const disabledSettings = {
      ...mockSettings,
      notifications: false,
      soundEnabled: false,
    };

    render(
      <SettingsPanel 
        settings={disabledSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const notificationToggle = screen.getByRole('switch', { name: /notifications/i });
    const soundToggle = screen.getByRole('switch', { name: /sound/i });
    
    expect(notificationToggle).not.toBeChecked();
    expect(soundToggle).not.toBeChecked();
  });

  it('has proper accessibility attributes', () => {
    render(
      <SettingsPanel 
        settings={mockSettings} 
        onSettingsChange={mockOnSettingsChange} 
      />
    );
    
    const switches = screen.getAllByRole('switch');
    switches.forEach(switchElement => {
      expect(switchElement).toHaveAttribute('aria-checked');
    });
  });
});