
import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUsPage from '../page';

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode, href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

describe('AboutUsPage', () => {
  it('renders the main heading', () => {
    render(<AboutUsPage />);
    const heading = screen.getByRole('heading', {
      name: /about syncrospace/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the mission, vision, and values cards', () => {
    render(<AboutUsPage />);
    expect(screen.getByText(/our mission/i)).toBeInTheDocument();
    expect(screen.getByText(/our vision/i)).toBeInTheDocument();
    expect(screen.getByText(/our values/i)).toBeInTheDocument();
  });

  it('renders the "Meet the Team" section', () => {
    render(<AboutUsPage />);
    expect(screen.getByRole('heading', { name: /meet the team/i })).toBeInTheDocument();
    expect(screen.getByText('Priyanshi Shekhada')).toBeInTheDocument();
    expect(screen.getByText('Dhruvi Ardeshana')).toBeInTheDocument();
    expect(screen.getByText('Meet Mendapara')).toBeInTheDocument();
    expect(screen.getByText('CEO (Chief Executive Officer)')).toBeInTheDocument();
    expect(screen.getByText('COO (Chief Operating Officer)')).toBeInTheDocument();
    expect(screen.getByText('CTO (Chief Technical Officer)')).toBeInTheDocument();
  });

  it('contains a link back to the dashboard', () => {
    render(<AboutUsPage />);
    const dashboardLink = screen.getByRole('link', { name: /back to dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });
});
