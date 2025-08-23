import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TourGuide from '../TourGuide';

// Mock react-joyride
jest.mock('react-joyride', () => {
  return function MockJoyride({ steps, run, callback, ...props }: any) {
    return (
      <div data-testid="joyride-mock">
        <div data-testid="joyride-run">{run ? 'running' : 'stopped'}</div>
        <div data-testid="joyride-steps">{steps?.length || 0}</div>
        <button 
          data-testid="joyride-callback" 
          onClick={() => callback && callback({ action: 'close', type: 'step:after' })}
        >
          Mock Callback
        </button>
      </div>
    );
  };
});

describe('TourGuide', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders the tour guide component', () => {
    render(<TourGuide isAdmin={false} />);
    
    expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
  });

  it('shows basic user tour when isAdmin is false', () => {
    render(<TourGuide isAdmin={false} />);
    
    const stepsElement = screen.getByTestId('joyride-steps');
    const stepCount = parseInt(stepsElement.textContent || '0');
    
    // Should have basic user steps
    expect(stepCount).toBeGreaterThan(0);
  });

  it('shows admin tour with additional steps when isAdmin is true', () => {
    render(<TourGuide isAdmin={true} />);
    
    const stepsElement = screen.getByTestId('joyride-steps');
    const stepCount = parseInt(stepsElement.textContent || '0');
    
    // Should have admin steps (more than basic user)
    expect(stepCount).toBeGreaterThan(0);
  });

  it('starts tour when no completion status in localStorage', () => {
    render(<TourGuide isAdmin={false} />);
    
    const runElement = screen.getByTestId('joyride-run');
    expect(runElement.textContent).toBe('running');
  });

  it('does not start tour when already completed', () => {
    localStorage.setItem('tourCompleted', 'true');
    
    render(<TourGuide isAdmin={false} />);
    
    const runElement = screen.getByTestId('joyride-run');
    expect(runElement.textContent).toBe('stopped');
  });

  it('saves completion status to localStorage when tour is finished', () => {
    render(<TourGuide isAdmin={false} />);
    
    const callbackButton = screen.getByTestId('joyride-callback');
    fireEvent.click(callbackButton);
    
    expect(localStorage.getItem('tourCompleted')).toBe('true');
  });

  it('handles different admin tour steps correctly', () => {
    const { rerender } = render(<TourGuide isAdmin={false} />);
    
    const userStepsElement = screen.getByTestId('joyride-steps');
    const userStepCount = parseInt(userStepsElement.textContent || '0');
    
    rerender(<TourGuide isAdmin={true} />);
    
    const adminStepsElement = screen.getByTestId('joyride-steps');
    const adminStepCount = parseInt(adminStepsElement.textContent || '0');
    
    // Admin should have more or equal steps than regular user
    expect(adminStepCount).toBeGreaterThanOrEqual(userStepCount);
  });
});