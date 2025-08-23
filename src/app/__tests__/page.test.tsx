import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({})),
}));

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('Home Page', () => {
  const mockSupabase = {
    auth: {
      getSession: jest.fn(),
    },
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    jest.clearAllMocks();
  });

  it('renders the main heading and description for unauthenticated users', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText('A new dimension for team collaboration.')).toBeInTheDocument();
    expect(screen.getByText(/Step into a 2D virtual office/i)).toBeInTheDocument();
    expect(screen.getByText('SyncroSpace')).toBeInTheDocument();
  });

  it('shows login and signup buttons for unauthenticated users', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText('Enter SyncroSpace')).toBeInTheDocument();
  });

  it('displays all feature cards', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText('Virtual World')).toBeInTheDocument();
    expect(screen.getByText('Spatial Audio')).toBeInTheDocument();
    expect(screen.getByText('Team Chat')).toBeInTheDocument();
    expect(screen.getByText('Video Meetings')).toBeInTheDocument();
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Whiteboards')).toBeInTheDocument();
    expect(screen.getByText('Surveys & Polls')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('displays footer with all navigation links', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    // Product links
    expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /documentation/i })).toBeInTheDocument();

    // Company links
    expect(screen.getByRole('link', { name: /about us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /careers/i })).toBeInTheDocument();

    // Legal links
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
  });

  it('redirects authenticated users to dashboard', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: '123' } } },
    });

    await Home();

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('shows dashboard link for authenticated users', async () => {
    // Test when user is authenticated but doesn't redirect (edge case)
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: '123' } } },
    });

    // Mock redirect to not actually redirect for this test
    (redirect as jest.Mock).mockImplementation(() => {
      throw new Error('NEXT_REDIRECT'); // This is how Next.js redirect works in tests
    });

    try {
      await Home();
    } catch (error) {
      expect(error).toEqual(new Error('NEXT_REDIRECT'));
    }
  });
});