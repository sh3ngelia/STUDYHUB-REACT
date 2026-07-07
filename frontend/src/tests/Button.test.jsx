import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../components/Button/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>დამატება</Button>);
    expect(screen.getByText('დამატება')).toBeInTheDocument();
  });
  it('applies variant class', () => {
    render(<Button variant="secondary">გაუქმება</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--secondary');
  });
  it('is disabled when prop passed', () => {
    render(<Button disabled>OK</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
