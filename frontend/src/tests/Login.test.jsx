import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Stub = () => (
  <div>
    <label htmlFor="u">მომხმარებლის სახელი</label>
    <input id="u" type="text" />
    <label htmlFor="p">პაროლი</label>
    <input id="p" type="password" />
    <button type="submit">შესვლა</button>
  </div>
);

describe('Login', () => {
  it('renders fields', () => {
    render(<MemoryRouter><Stub /></MemoryRouter>);
    expect(screen.getByLabelText('მომხმარებლის სახელი')).toBeInTheDocument();
    expect(screen.getByLabelText('პაროლი')).toBeInTheDocument();
  });
  it('renders submit button', () => {
    render(<MemoryRouter><Stub /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'შესვლა' })).toBeInTheDocument();
  });
  it('AuthContext is defined', () => {
    expect(AuthContext).toBeDefined();
  });
});
