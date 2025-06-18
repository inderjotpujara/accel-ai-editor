import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should apply primary variant classes by default', () => {
    render(<Button>Primary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  it('should apply secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-secondary');
  });

  it('should apply outline variant classes', () => {
    render(<Button variant="outline">Outline Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-gray-300');
  });

  it('should apply size classes', () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should merge custom className with default classes', () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'custom-class');
  });
});
