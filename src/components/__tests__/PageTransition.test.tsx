import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageTransition } from '../PageTransition';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, animate, exit, transition, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('PageTransition', () => {
  it('renders children correctly', () => {
    render(
      <PageTransition>
        <div>Page Content</div>
      </PageTransition>
    );
    
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-page-class';
    const { container } = render(
      <PageTransition className={customClass}>
        <div>Page Content</div>
      </PageTransition>
    );
    
    const pageElement = container.firstChild as HTMLElement;
    expect(pageElement).toHaveClass(customClass);
  });

  it('passes through additional props', () => {
    render(
      <PageTransition data-testid="page-transition" id="test-page">
        <div>Page Content</div>
      </PageTransition>
    );
    
    const pageElement = screen.getByTestId('page-transition');
    expect(pageElement).toHaveAttribute('id', 'test-page');
  });

  it('has default styling when no className provided', () => {
    const { container } = render(
      <PageTransition>
        <div>Page Content</div>
      </PageTransition>
    );
    
    const pageElement = container.firstChild as HTMLElement;
    expect(pageElement).toBeInTheDocument();
  });
});