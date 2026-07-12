import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthContext } from '../context/AuthContext';
import subjectsReducer from '../store/subjectsSlice';
import Login from '../pages/Login/Login';

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...p }) => <button {...p}>{children}</button>,
    div:    ({ children, initial, animate, exit, transition, whileHover, ...p }) => <div {...p}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const store = configureStore({ reducer: { subjects: subjectsReducer } });

const mockAuth = {
  login:           vi.fn().mockResolvedValue(true),
  register:        vi.fn().mockResolvedValue(true),
  authError:       null,
  setAuthError:    vi.fn(),
  isAuthenticated: false,
  user:            null,
  logout:          vi.fn(),
};

const Wrapper = ({ children }) => (
  <Provider store={store}>
    <AuthContext.Provider value={mockAuth}>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthContext.Provider>
  </Provider>
);

const getForm = () => document.querySelector('form');

describe('Login (real component)', () => {
  it('renders username and password inputs', () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByLabelText('მომხმარებლის სახელი')).toBeInTheDocument();
    expect(screen.getByLabelText('პაროლი')).toBeInTheDocument();
  });

  it('form contains a submit button', () => {
    render(<Login />, { wrapper: Wrapper });
    const form = getForm();
    const submitBtn = form.querySelector('[type="submit"]');
    expect(submitBtn).not.toBeNull();
    expect(submitBtn.textContent).toContain('შესვლა');
  });

  it('switches to register mode and shows name field', async () => {
    render(<Login />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'რეგისტრაცია' }));
    await waitFor(() => {
      expect(screen.getByLabelText('სახელი')).toBeInTheDocument();
    });
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<Login />, { wrapper: Wrapper });
    fireEvent.submit(getForm());
    await waitFor(() => {
      expect(screen.getAllByText('სავალდებულო').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('calls auth.login with correct credentials', async () => {
    mockAuth.login.mockClear();
    render(<Login />, { wrapper: Wrapper });
    fireEvent.change(screen.getByLabelText('მომხმარებლის სახელი'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText('პაროლი'), {
      target: { value: 'secret123' },
    });
    fireEvent.submit(getForm());
    await waitFor(() => {
      expect(mockAuth.login).toHaveBeenCalledWith('testuser', 'secret123');
    });
  });
});