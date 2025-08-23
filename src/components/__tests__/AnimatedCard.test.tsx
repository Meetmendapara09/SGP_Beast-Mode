import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnimatedCard } from '../AnimatedCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, whileHover, whileTap, initial, animate, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('AnimatedCard', () => {
  it('renders children correctly', () => {
    render(
      <AnimatedCard>
        <div>Test Content</div>
      </AnimatedCard>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <AnimatedCard className={customClass}>
        <div>Test Content</div>
      </AnimatedCard>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass(customClass);
  });

  it('passes through additional props', () => {
    render(
      <AnimatedCard data-testid="animated-card" id="test-card">
        <div>Test Content</div>
      </AnimatedCard>
    );
    
    const cardElement = screen.getByTestId('animated-card');
    expect(cardElement).toHaveAttribute('id', 'test-card');
  });

  it('has proper card styling classes', () => {
    const { container } = render(
      <AnimatedCard>
        <div>Test Content</div>
      </AnimatedCard>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
  });
});