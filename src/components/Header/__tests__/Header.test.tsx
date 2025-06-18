import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  it('should render header with logo and navigation', () => {
    render(<Header />);
    
    expect(screen.getByText('Accel Editor')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<Header />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'border-b', 'border-gray-200');
  });
});
