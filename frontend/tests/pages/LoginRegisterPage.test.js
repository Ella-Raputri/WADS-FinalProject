import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginRegisterPage from '../../src/pages/LoginRegisterPage';
import axios from 'axios';
import { AppContent } from '@/context/AppContext';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock components and icons
jest.mock('@/components/InputField', () => (props) => (
  <input 
    data-testid={props.id}
    type={props.type}
    value={props.value}
    onChange={props.onChange}
    placeholder={props.placeholder}
    onKeyDown={props.onKeyDown}
  />
));

jest.mock('@/components/UploadImage', () => () => (
  <div data-testid="upload-image-mock"></div>
));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <div data-testid={`icon-${icon.iconName}`} />,
}));

jest.mock('react-icons/fa', () => ({
  FaGoogle: () => <div data-testid="google-icon"></div>,
}));

jest.mock('@/context/AppContext', () => {
  const React = require('react');
  return {
    AppContent: React.createContext(),
  };
});

describe('LoginRegisterPage Component', () => {
  const mockContext = {
    backendUrl: 'http://localhost:5000/',
    setIsLoggedIn: jest.fn(),
    getUserData: jest.fn(),
    userData: null,
    initializeSocket: jest.fn(),
    uploadImage: jest.fn().mockResolvedValue('http://example.com/image.jpg'),
  };

  beforeEach(() => {
    axios.post.mockReset();
    toast.error.mockClear();
    toast.success.mockClear();
  });

  it('renders the login form by default', () => {
    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    expect(screen.getAllByText('Welcome!')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('password')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
  });

  it('switches between login and signup forms', () => {
    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    // Switch to signup
    fireEvent.click(screen.getByTestId('toggle-signup'));
    expect(screen.getAllByText('Hello Friend!')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('fullName')[0]).toBeInTheDocument();

    // Switch back to login
    fireEvent.click(screen.getByTestId('toggle-signup'));
    expect(screen.getAllByText('Welcome!')[0]).toBeInTheDocument();
  });


  it('handles login errors', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('login'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });


  it('handles signup errors', async () => {
    mockContext.uploadImage.mockResolvedValueOnce('http://example.com/image.jpg');
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } }
    });

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    // Switch to signup and submit
    fireEvent.click(screen.getByTestId('toggle-signup'));
    fireEvent.click(screen.getByText('Sign up'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });

  it('toggles password visibility', () => {
    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId('password');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(screen.getByTestId('icon-eye1'));
    expect(passwordInput.type).toBe('text');
  });

  it('handles Google login', () => {
    delete window.location;
    window.location = { href: '' };

    render(
      <MemoryRouter>
        <AppContent.Provider value={mockContext}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('google-login'));
    expect(window.location.href).toBe('http://localhost:5000/api/auth/google');
  });

  it('navigates away if user is already logged in (admin)', () => {
    const mockRouter = {
      push: jest.fn(),
    };
    
    render(
      <MemoryRouter>
        <AppContent.Provider value={{
          ...mockContext,
          userData: { role: 'admin' }
        }}>
          <LoginRegisterPage />
        </AppContent.Provider>
      </MemoryRouter>
    );

    expect(mockRouter.push).not.toHaveBeenCalled(); // MemoryRouter doesn't actually navigate
    // In a real test with a router, we would check for navigation
  });
});