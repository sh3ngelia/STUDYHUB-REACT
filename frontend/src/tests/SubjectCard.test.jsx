import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthContext } from '../context/AuthContext';
import subjectsReducer from '../store/subjectsSlice';
import SubjectCard from '../components/SubjectCard/SubjectCard';

const store = configureStore({ reducer: { subjects: subjectsReducer } });
const subject = { id: '1', title: 'მათემატიკა', description: 'ალგებრა', color: '#6c5ce7', progress: 50 };

const Wrapper = ({ children }) => (
  <Provider store={store}>
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthContext.Provider>
  </Provider>
);

describe('SubjectCard', () => {
  it('renders title', () => {
    render(<SubjectCard subject={subject} />, { wrapper: Wrapper });
    expect(screen.getByText('მათემატიკა')).toBeInTheDocument();
  });
  it('renders progress', () => {
    render(<SubjectCard subject={subject} />, { wrapper: Wrapper });
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
  it('shows active status badge', () => {
    render(<SubjectCard subject={subject} />, { wrapper: Wrapper });
    expect(screen.getByText('მიმდინარე')).toBeInTheDocument();
  });
});
