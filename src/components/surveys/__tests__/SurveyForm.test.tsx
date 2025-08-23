import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SurveyForm from '../SurveyForm';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/hooks/use-toast');
global.fetch = jest.fn();

const mockToast = jest.fn();

describe('SurveyForm', () => {
  const mockSurvey = {
    id: 'survey-123',
    title: 'Team Feedback Survey',
    description: 'Help us improve our team collaboration',
    questions: [
      {
        id: 'q1',
        question: 'How satisfied are you with our current tools?',
        type: 'rating',
        required: true,
        options: []
      },
      {
        id: 'q2', 
        question: 'What could we improve?',
        type: 'text',
        required: false,
        options: []
      },
      {
        id: 'q3',
        question: 'Which feature is most important?',
        type: 'multiple_choice',
        required: true,
        options: ['Chat', 'Video Calls', 'File Sharing', 'Task Management']
      }
    ]
  };

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('renders survey title and description', () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    expect(screen.getByText('Team Feedback Survey')).toBeInTheDocument();
    expect(screen.getByText('Help us improve our team collaboration')).toBeInTheDocument();
  });

  it('renders all survey questions', () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    expect(screen.getByText('How satisfied are you with our current tools?')).toBeInTheDocument();
    expect(screen.getByText('What could we improve?')).toBeInTheDocument();
    expect(screen.getByText('Which feature is most important?')).toBeInTheDocument();
  });

  it('renders rating question with star inputs', () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    // Rating questions should have radio buttons for star ratings
    const ratingInputs = screen.getAllByRole('radio');
    expect(ratingInputs.length).toBeGreaterThan(0);
  });

  it('renders text question with textarea', () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    const textArea = screen.getByRole('textbox');
    expect(textArea).toBeInTheDocument();
  });

  it('renders multiple choice question with radio buttons', () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Video Calls')).toBeInTheDocument();
    expect(screen.getByText('File Sharing')).toBeInTheDocument();
    expect(screen.getByText('Task Management')).toBeInTheDocument();
  });

  it('shows validation errors for required questions', async () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    const submitButton = screen.getByText('Submit Survey');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('This question is required')).toBeInTheDocument();
    });
  });

  it('submits survey successfully with all answers', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Survey submitted successfully' }),
    });

    render(<SurveyForm survey={mockSurvey} />);
    
    // Answer rating question (click 5 stars)
    const fiveStarRating = screen.getByRole('radio', { name: /5/i });
    fireEvent.click(fiveStarRating);
    
    // Answer text question
    const textArea = screen.getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'Great tools overall!' } });
    
    // Answer multiple choice
    const chatOption = screen.getByLabelText('Chat');
    fireEvent.click(chatOption);
    
    const submitButton = screen.getByText('Submit Survey');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey_id: 'survey-123',
          responses: expect.any(Object),
        }),
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Survey Submitted',
        description: 'Survey submitted successfully',
      });
    });
  });

  it('handles submission errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Survey submission failed' }),
    });

    render(<SurveyForm survey={mockSurvey} />);
    
    // Fill out required fields
    const fiveStarRating = screen.getByRole('radio', { name: /5/i });
    fireEvent.click(fiveStarRating);
    
    const chatOption = screen.getByLabelText('Chat');
    fireEvent.click(chatOption);
    
    fireEvent.click(screen.getByText('Submit Survey'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: 'Survey submission failed',
      });
    });
  });

  it('disables submit button while submitting', async () => {
    render(<SurveyForm survey={mockSurvey} />);
    
    // Fill out required fields
    const fiveStarRating = screen.getByRole('radio', { name: /5/i });
    fireEvent.click(fiveStarRating);
    
    const chatOption = screen.getByLabelText('Chat');
    fireEvent.click(chatOption);
    
    const submitButton = screen.getByText('Submit Survey');
    fireEvent.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
  });
});