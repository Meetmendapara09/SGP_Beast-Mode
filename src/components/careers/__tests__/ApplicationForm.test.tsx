import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationForm from '../ApplicationForm';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

// Mock dependencies
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockSupabaseClient = {
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/resume.pdf' } })),
    })),
  },
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ApplicationForm', () => {
  const defaultProps = {
    jobTitle: 'Software Engineer',
    jobId: 'job-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    mockToast.mockClear();
  });

  it('renders the application form trigger button', () => {
    render(<ApplicationForm {...defaultProps} />);
    expect(screen.getByText('Apply for this position')).toBeInTheDocument();
  });

  it('opens dialog when trigger button is clicked', () => {
    render(<ApplicationForm {...defaultProps} />);
    
    const triggerButton = screen.getByText('Apply for this position');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Apply for Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Please fill out the form below. We\'re excited to hear from you!')).toBeInTheDocument();
  });

  it('renders all form fields when dialog is open', () => {
    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover letter/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    const submitButton = screen.getByText('Submit Application');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('shows error when trying to submit without resume', async () => {
    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    const submitButton = screen.getByText('Submit Application');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Resume Required',
        description: 'Please upload your resume to apply.',
      });
    });
  });

  it('handles file upload for resume', () => {
    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    const fileInput = document.querySelector('#resume-upload') as HTMLInputElement;
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('Click to select a different file')).toBeInTheDocument();
  });

  it('submits form successfully with all required data', async () => {
    const mockUpload = jest.fn().mockResolvedValue({ error: null });
    const mockGetPublicUrl = jest.fn().mockReturnValue({ 
      data: { publicUrl: 'https://example.com/resume.pdf' } 
    });
    
    mockSupabaseClient.storage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Application submitted successfully' }),
    });

    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText(/cover letter/i), { target: { value: 'I am interested in this position.' } });
    
    // Upload resume
    const fileInput = document.querySelector('#resume-upload') as HTMLInputElement;
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const submitButton = screen.getByText('Submit Application');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('resumes/job-123'),
        file
      );
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          cover_letter: 'I am interested in this position.',
          job_id: 'job-123',
          resume_url: 'https://example.com/resume.pdf',
        }),
      });
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Application Sent!',
        description: 'Your application for the Software Engineer position has been received.',
      });
    });
  });

  it('handles submission errors gracefully', async () => {
    const mockUpload = jest.fn().mockResolvedValue({ error: null });
    mockSupabaseClient.storage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: jest.fn().mockReturnValue({ 
        data: { publicUrl: 'https://example.com/resume.pdf' } 
      }),
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Server error' }),
    });

    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    // Fill out the form with minimum required data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    const fileInput = document.querySelector('#resume-upload') as HTMLInputElement;
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit Application'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'Server error',
      });
    });
  });

  it('handles resume upload errors', async () => {
    const mockUpload = jest.fn().mockResolvedValue({ 
      error: { message: 'Upload failed' } 
    });
    mockSupabaseClient.storage.from.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: jest.fn(),
    });

    render(<ApplicationForm {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Apply for this position'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    
    const fileInput = document.querySelector('#resume-upload') as HTMLInputElement;
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit Application'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Resume Upload Failed',
        description: 'Upload failed',
      });
    });
  });
});